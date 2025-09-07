import { useMemo, useState, useRef, useEffect } from "react";
import {
  getAutoCaptures,
  startAutoCapture,
  stopAutoCapture,
} from "../utils/snapshotBus.js";

// deterministic PRNG (mulberry32)
function mulberry32(a) {
  return function () {
    let t = (a += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function niceFmtFp(n) {
  // align with ThroughputPanel display semantics (TF/PF/E)
  if (n >= 1e6) return (n / 1e6).toFixed(2) + " E";
  if (n >= 1e3) return (n / 1e3).toFixed(2) + " P";
  if (n >= 1) return n.toFixed(1) + " T";
  return (n * 1000).toFixed(1) + " G";
}

function buildDeterministicSeries(seed, cycleDays = 4) {
  const rng = mulberry32(seed >>> 0);
  const now = new Date();
  const totalPoints = 24 * 12; // 288
  const points = [];

  // replicate base constants from ThroughputPanel for parity
  const pods = 3,
    racksPerPod = 8,
    gpusPerRack = 72;
  const racks = pods * racksPerPod;
  const rackFp4 = 1.44 * 15; // exaFLOPS

  for (let i = totalPoints - 1; i >= 0; i--) {
    const t = new Date(+now - i * 5 * 60 * 1000);
    const hour = t.getHours();

    // deterministic diurnal phase using seed
    const phase = Math.sin(((hour + rng() * 2) / 24) * Math.PI * 2);
    const baseLoad = 0.7 + 0.12 * phase + (rng() - 0.5) * 0.03;

    let util = Math.min(0.99, Math.max(0.35, baseLoad));
    let exaFp4 = racks * rackFp4 * util;
    // base power envelope per region will be derived below; keep an average base here
    let basePower = 5600; // kW scale used previously
    // placeholder overall power; we'll create region splits next
    let power =
      basePower *
      (0.92 + (exaFp4 / (racks * rackFp4)) * 0.12 + (rng() - 0.5) * 0.02);

    // Spike rule for current date between 14:00-14:59 local
    if (t.getDate() === now.getDate() && hour === 14) {
      const minute = t.getMinutes();
      const spikeWindow = Math.max(0, 1 - Math.abs(minute - 30) / 30);
      const spikeFactor = 1 + 0.25 * spikeWindow + rng() * 0.12; // ensures >15% uplift at peak
      exaFp4 *= spikeFactor;
      power *= 1 + 0.12 * spikeWindow;
    }

    // occasional deterministic downtime seeded across cycleDays
    const daySeed = Math.floor((+t / 86400000) % cycleDays);
    const down = rng() < 0.0025 && daySeed === Math.floor(seed % cycleDays);
    if (down) {
      exaFp4 = 0;
      power = Math.max(80, basePower * 0.18);
    }

    // errors more likely when fp4 is high relative to baseline (deterministic)
    const localStress = Math.max(0, exaFp4 / (racks * rackFp4) - 0.78);
    const errProb =
      0.008 + Math.min(0.25, localStress * 0.6 + (rng() - 0.5) * 0.02);
    const errors = rng() < errProb ? Math.ceil(rng() * 6) : 0;

    // convert exaFp4 to TF (exa * 1e6 => TF?), ThroughputPanel often multiplies exa*1000 and uses P/E units,
    // here keep FP4 in TF for axis labeling to be human-friendly but format with niceFmtFp where needed.
    const fp4_tf = exaFp4 * 1e6; // exaFLOPS -> TFLOPS

    // regional power shapes (US/EU/UK) — scale from base power with diurnal phases and regional offsets
    const regionPhase = (regionOffset = 0) => {
      // regionOffset shifts peak hours; rng introduces minor regional variability
      const phaseR = Math.sin(
        ((hour + regionOffset + rng() * 0.5) / 24) * Math.PI * 2
      );
      return 0.92 + 0.08 * phaseR + (rng() - 0.5) * 0.02;
    };

    const powerUS = Math.round(
      basePower * regionPhase(2) * (1 + (exaFp4 / (racks * rackFp4)) * 0.06)
    );
    const powerEU = Math.round(
      basePower * regionPhase(1) * (1 + (exaFp4 / (racks * rackFp4)) * 0.05)
    );
    // UK shall spike higher today between 14-15 local
    let ukMult = regionPhase(0);
    if (t.getDate() === now.getDate() && hour === 14) {
      const minute = t.getMinutes();
      const spikeWindow = Math.max(0, 1 - Math.abs(minute - 30) / 30);
      ukMult *= 1 + 0.35 * spikeWindow + rng() * 0.08;
    }
    const powerUK = Math.round(
      basePower * ukMult * (1 + (exaFp4 / (racks * rackFp4)) * 0.055)
    );

    points.push({
      ts: t,
      fp4: fp4_tf,
      power: power,
      down,
      errors,
      powerUS,
      powerEU,
      powerUK,
    });
  }
  return points;
}

export default function ThroughputHistory({ className = "" }) {
  // persistent seed + cycleDays stored so each load is identical unless user clears storage
  const STORAGE_KEY = "tp.hist.seed.v1";
  const CYCLE_KEY = "tp.hist.cycleDays.v1";
  const [live, setLive] = useState(false);
  const [seedInfo] = useState(() => {
    try {
      let seed = Number(localStorage.getItem(STORAGE_KEY));
      let cycle = Number(localStorage.getItem(CYCLE_KEY));
      if (!seed || Number.isNaN(seed)) {
        seed = Math.floor(Math.random() * 0xffffffff);
        localStorage.setItem(STORAGE_KEY, String(seed));
      }
      if (!cycle || Number.isNaN(cycle)) {
        cycle = 4; // default 4-day loop
        localStorage.setItem(CYCLE_KEY, String(cycle));
      }
      return { seed, cycle };
    } catch (e) {
      return { seed: 1234567, cycle: 4 };
    }
  });

  const baseData = useMemo(
    () => buildDeterministicSeries(seedInfo.seed, seedInfo.cycle),
    [seedInfo.seed, seedInfo.cycle]
  );

  const [data, setData] = useState(baseData);
  const [hover, setHover] = useState(null);
  const svgRef = useRef(null);

  // attempt to read live captures when toggled — start auto-capture and poll regularly
  useEffect(() => {
    if (!live) return;
    let mounted = true;
    // start auto-capture (safe-noop if already running)
    try {
      startAutoCapture();
    } catch (e) {}

    function applyCaptures() {
      const captures = getAutoCaptures();
      if (!captures || captures.length === 0) return;
      const copied = [...data];
      const lastBundles = captures
        .slice(0, Math.min(captures.length, data.length))
        .reverse();

      // Helper: normalize a bundle to numeric metrics
      const mapBundle = (bundle) => {
        const entry = (bundle.entries || []).find(
          (e) => e.name === "throughput"
        );
        if (!entry || !entry.data) return null;
        const d = entry.data;
        let fp4 = typeof d.fp4_tf === "number" ? d.fp4_tf : null;
        let power = typeof d.power_kw === "number" ? d.power_kw : null;
        if (fp4 === null) {
          const pods = d.pods || 3;
          const racksPerPod = d.racksPerPod || 8;
          const racks = pods * racksPerPod;
          const rackFp4 = d.rackFp4 || 1.44 * 15;
          const util = d.util || 0.78;
          const exaFp4 = racks * rackFp4 * util;
          fp4 = exaFp4 * 1e6;
        }
        if (power === null) {
          if (typeof d.racks === "number" || (d.pods && d.racksPerPod)) {
            const pods = d.pods || 3;
            const racksPerPod = d.racksPerPod || 8;
            const racks = pods * racksPerPod;
            power = Math.round(
              racks * 126 * 1.55 * (0.88 + (d.util || 0.78) * 0.14)
            );
          } else {
            power = 0;
          }
        }
        return { ts: new Date(bundle.ts), fp4, power, d };
      };

      // Compute boundary alignment to avoid a step at the switch
      const firstIdx = data.length - lastBundles.length;
      const prev = copied[Math.max(0, firstIdx - 1)];
      const firstLive = mapBundle(lastBundles[0]);
      const eps = 1e-6;
      const sFp =
        prev && firstLive ? prev.fp4 / Math.max(eps, firstLive.fp4) : 1;
      const sPw =
        prev && firstLive ? prev.power / Math.max(eps, firstLive.power) : 1;
      // tighter clamp to reduce visible jumps
      const scaleFp4 = Math.max(0.9, Math.min(1.1, sFp));
      const scalePower = Math.max(0.9, Math.min(1.1, sPw));
      const bridgeLen = 24;

      // region alignment: preserve visual magnitude at the boundary and ease to live shares
      const shares = { us: 0.33, eu: 0.32, uk: 0.35 };
      const prevTotal = prev ? prev.power : 0;
      const regionScale = {
        us:
          prev && prevTotal
            ? prev.powerUS / Math.max(1, prevTotal * shares.us)
            : 1,
        eu:
          prev && prevTotal
            ? prev.powerEU / Math.max(1, prevTotal * shares.eu)
            : 1,
        uk:
          prev && prevTotal
            ? prev.powerUK / Math.max(1, prevTotal * shares.uk)
            : 1,
      };

      lastBundles.forEach((b, idx) => {
        const pos = data.length - lastBundles.length + idx;
        if (pos < 0) return;
        const m = mapBundle(b);
        if (!m) return;
        const alpha = Math.max(0, Math.min(1, (idx + 1) / bridgeLen));
        const fp4Out = m.fp4 * ((1 - alpha) * scaleFp4 + alpha);
        const powerOut = m.power * ((1 - alpha) * scalePower + alpha);

        // ease region scaling toward pure shares (scale -> 1)
        const sUS = (1 - alpha) * regionScale.us + alpha * 1;
        const sEU = (1 - alpha) * regionScale.eu + alpha * 1;
        const sUK = (1 - alpha) * regionScale.uk + alpha * 1;

        copied[pos] = {
          ts: m.ts,
          fp4: fp4Out,
          power: powerOut,
          down: false,
          errors: 0,
          powerUS: Math.round(powerOut * shares.us * sUS),
          powerEU: Math.round(powerOut * shares.eu * sEU),
          powerUK: Math.round(powerOut * shares.uk * sUK),
        };
      });

      if (mounted) setData(copied);
    }

    // initial apply then poll every 3s
    applyCaptures();
    const id = setInterval(applyCaptures, 3000);

    return () => {
      mounted = false;
      clearInterval(id);
      try {
        stopAutoCapture();
      } catch (e) {}
    };
  }, [live]);

  // hover handling (mouse & touch)
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const padding = { t: 18, r: 40, b: 28, l: 50 };
    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const mx = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      const rel = Math.max(
        0,
        Math.min(1, (mx - padding.l) / (rect.width - padding.l - padding.r))
      );
      const idx = Math.round(rel * (data.length - 1));
      if (!isNaN(idx))
        setHover({
          idx,
          data: data[idx],
          x: mx + rect.left,
          y: e.touches ? e.touches[0].clientY : e.clientY,
        });
    };
    const onLeave = () => setHover(null);
    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    el.addEventListener("touchmove", onMove, { passive: true });
    el.addEventListener("touchend", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onLeave);
    };
  }, [data]);

  // rendering helpers & scaling
  const padding = { t: 18, r: 48, b: 28, l: 56 };
  const width = 920;
  const height = 240;
  const maxFp4 = Math.max(1, ...data.map((d) => d.fp4));
  const maxPower = Math.max(1, ...data.map((d) => d.power));
  const xFor = (i) =>
    padding.l + (i / (data.length - 1)) * (width - padding.l - padding.r);
  const yFp4 = (v) =>
    padding.t + (1 - v / maxFp4) * (height - padding.t - padding.b);
  const yPower = (v) =>
    padding.t + (1 - v / maxPower) * (height - padding.t - padding.b);

  const pathFp4 = data
    .map((p, i) =>
      i === 0 ? `M ${xFor(i)} ${yFp4(p.fp4)}` : `L ${xFor(i)} ${yFp4(p.fp4)}`
    )
    .join(" ");
  const pathPower = data
    .map((p, i) =>
      i === 0
        ? `M ${xFor(i)} ${yPower(p.power)}`
        : `L ${xFor(i)} ${yPower(p.power)}`
    )
    .join(" ");
  const pathPowerUS = data
    .map((p, i) =>
      i === 0
        ? `M ${xFor(i)} ${yPower(p.powerUS)}`
        : `L ${xFor(i)} ${yPower(p.powerUS)}`
    )
    .join(" ");
  const pathPowerEU = data
    .map((p, i) =>
      i === 0
        ? `M ${xFor(i)} ${yPower(p.powerEU)}`
        : `L ${xFor(i)} ${yPower(p.powerEU)}`
    )
    .join(" ");
  const pathPowerUK = data
    .map((p, i) =>
      i === 0
        ? `M ${xFor(i)} ${yPower(p.powerUK)}`
        : `L ${xFor(i)} ${yPower(p.powerUK)}`
    )
    .join(" ");

  // left axis ticks for FP4 (choose 4 ticks)
  const leftTicks = 4;
  const leftTickVals = Array.from({ length: leftTicks + 1 }).map(
    (_, i) => maxFp4 * (i / leftTicks)
  );

  // right axis ticks for power
  const rightTicks = 4;
  const rightTickVals = Array.from({ length: rightTicks + 1 }).map(
    (_, i) => maxPower * (i / rightTicks)
  );

  const stats = useMemo(() => {
    const valid = data.filter((d) => !d.down && d.fp4 > 0);
    const avg =
      valid.reduce((s, v) => s + v.fp4, 0) / Math.max(1, valid.length);
    const peak = Math.max(...data.map((d) => d.fp4));
    const downtime = data.filter((d) => d.down).length;
    const uptimePct = 100 * (1 - downtime / data.length);
    const errors = data.reduce((s, v) => s + v.errors, 0);
    return { avg, peak, downtime, uptimePct, errors };
  }, [data]);

  // mobile downsampled sparkline
  const [isCompact, setIsCompact] = useState(false);
  useEffect(() => {
    function check() {
      setIsCompact(window.innerWidth <= 520);
    }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const compactData = useMemo(() => {
    if (!isCompact) return null;
    // downsample to ~48 points (5min -> ~4h coverage per 12 points; but keep 48 across 24h)
    const out = [];
    const step = Math.max(1, Math.floor(data.length / 48));
    for (let i = 0; i < data.length; i += step) out.push(data[i]);
    return out;
  }, [isCompact, data]);

  return (
    <section
      className={`throughput-hist ${className}`}
      aria-label="Throughput history overview"
    >
      <div className="th-header">
        <div>
          <div className="th-h">24h FP4 Throughput · 5‑minute averages</div>
          <div className="th-sub">
            Rolling 24h · left: FP4 · right: Power · deterministic seed
          </div>
        </div>

        <div style={{ display: "flex", gap: ".6rem", alignItems: "center" }}>
          <div className="th-stats">
            <div className="th-stat">
              <small>Avg</small>
              <strong>{niceFmtFp(stats.avg / 1e6)}</strong>
            </div>
            <div className="th-stat">
              <small>Peak</small>
              <strong>{niceFmtFp(stats.peak / 1e6)}</strong>
            </div>
            <div className="th-stat">
              <small>Uptime</small>
              <strong>{Math.round(stats.uptimePct)}%</strong>
            </div>
            <div className="th-stat">
              <small>Errors</small>
              <strong>{stats.errors}</strong>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: ".5rem" }}>
            <label style={{ fontSize: ".52rem", color: "#9fb0b7" }}>
              <input
                type="checkbox"
                checked={live}
                onChange={(e) => setLive(e.target.checked)}
                style={{ marginRight: ".35rem" }}
              />{" "}
              Live
            </label>
          </div>
        </div>
      </div>

      <div className="th-chart-wrap">
        <svg
          ref={svgRef}
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="xMidYMid meet"
          className="th-chart"
          role="img"
        >
          <defs>
            <linearGradient id="gFp4" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#ff9a8b" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#ff6d5f" stopOpacity="0.18" />
            </linearGradient>
            <linearGradient id="gPower" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#6ed6ff" stopOpacity="0.78" />
              <stop offset="100%" stopColor="#1b9be0" stopOpacity="0.06" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="6" result="b" />
            </filter>
          </defs>

          {/* horizontal grid + left and right axis ticks */}
          {leftTickVals.map((v, i) => {
            const y =
              padding.t + (1 - v / maxFp4) * (height - padding.t - padding.b);
            return (
              <g key={i}>
                <line
                  x1={padding.l}
                  x2={width - padding.r}
                  y1={y}
                  y2={y}
                  stroke="#0f1517"
                  strokeWidth="1"
                />
                <text
                  x={padding.l - 8}
                  y={y + 4}
                  textAnchor="end"
                  fill="#7f9ca2"
                  fontSize="11"
                >
                  {niceFmtFp(v / 1e6)}
                </text>
              </g>
            );
          })}

          {rightTickVals.map((v, i) => {
            const y =
              padding.t + (1 - v / maxPower) * (height - padding.t - padding.b);
            return (
              <text
                key={i}
                x={width - padding.r + 36}
                y={y + 4}
                textAnchor="end"
                fill="#7f9ca2"
                fontSize="11"
              >
                {Math.round(v)}
              </text>
            );
          })}

          {/* regional power areas (stacked-ish overlay) */}
          <path
            d={`${pathPowerUS} L ${xFor(data.length - 1)} ${
              height - padding.b
            } L ${xFor(0)} ${height - padding.b} Z`}
            fill="rgba(82,180,255,0.06)"
            stroke="transparent"
          />
          <path
            d={`${pathPowerEU} L ${xFor(data.length - 1)} ${
              height - padding.b
            } L ${xFor(0)} ${height - padding.b} Z`}
            fill="rgba(110,214,255,0.08)"
            stroke="transparent"
          />
          <path
            d={`${pathPowerUK} L ${xFor(data.length - 1)} ${
              height - padding.b
            } L ${xFor(0)} ${height - padding.b} Z`}
            fill="rgba(90,220,150,0.08)"
            stroke="transparent"
          />

          {/* fp4 primary line */}
          <path
            d={pathFp4}
            fill="none"
            stroke="#ff6d5f"
            strokeWidth="2.4"
            strokeLinejoin="round"
            strokeLinecap="round"
            filter="url(#glow)"
          />

          {/* separate thin power lines per region for clarity */}
          <path
            d={pathPowerUS}
            fill="none"
            stroke="#4db9ff"
            strokeWidth="1"
            strokeLinejoin="round"
            opacity="0.85"
          />
          <path
            d={pathPowerEU}
            fill="none"
            stroke="#1bb0dd"
            strokeWidth="1"
            strokeLinejoin="round"
            opacity="0.85"
          />
          <path
            d={pathPowerUK}
            fill="none"
            stroke="#78f09a"
            strokeWidth="1.2"
            strokeLinejoin="round"
            opacity="0.95"
          />

          {/* fp4 highlight stroke */}
          <path
            d={pathFp4}
            fill="none"
            stroke="#ffb8a8"
            strokeWidth="1"
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity="0.36"
          />

          {/* downtime overlays & error markers */}
          {data.map((d, i) => {
            if (d.down) {
              const x = xFor(i);
              return (
                <rect
                  key={`d-${i}`}
                  x={x - 2}
                  y={padding.t}
                  width={4}
                  height={height - padding.t - padding.b}
                  fill="rgba(200,40,40,0.18)"
                />
              );
            }
            return null;
          })}

          {data.map((d, i) => {
            if (!d.errors) return null;
            const x = xFor(i);
            const y = yFp4(Math.max(1, d.fp4));
            return (
              <g key={`e-${i}`} transform={`translate(${x}, ${y - 10})`}>
                <circle r="4" fill="#ffd86b" stroke="#b07a00" strokeWidth="1" />
              </g>
            );
          })}

          {/* x-axis ticks (6 labels) */}
          {Array.from({ length: 6 }).map((_, k) => {
            const idx = Math.round((k / 5) * (data.length - 1));
            const p = data[idx];
            const x = xFor(idx);
            const label = p.ts.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });
            return (
              <g key={k}>
                <line
                  x1={x}
                  x2={x}
                  y1={height - padding.b}
                  y2={height - padding.b + 6}
                  stroke="#152022"
                />
                <text
                  x={x}
                  y={height - 6}
                  fill="#9fb0b7"
                  fontSize="10"
                  textAnchor="middle"
                >
                  {label}
                </text>
              </g>
            );
          })}
        </svg>

        {hover && (
          <div
            className="th-tooltip"
            style={{ left: hover.x + 8, top: hover.y - 18 }}
          >
            <div className="tt-time">{hover.data.ts.toLocaleString()}</div>
            <div className="tt-row">
              <strong>{Math.round(hover.data.fp4).toLocaleString()}</strong>{" "}
              TFLOPS (FP4)
            </div>
            <div className="tt-row">
              <small>{Math.round(hover.data.power)} kW</small>
            </div>
            {hover.data.down && <div className="tt-down">Downtime</div>}
            {hover.data.errors ? (
              <div className="tt-error">Errors: {hover.data.errors}</div>
            ) : null}
          </div>
        )}
      </div>

      <div className="th-legend">
        <div className="th-legend-item">
          <span className="swatch fp4"></span>FP4
        </div>
        <div className="th-legend-item">
          <span className="swatch us"></span>US
        </div>
        <div className="th-legend-item">
          <span className="swatch eu"></span>EU
        </div>
        <div className="th-legend-item">
          <span className="swatch uk"></span>UK
        </div>
        <div className="th-legend-item down">
          <span className="swatch down"></span>Downtime
        </div>
      </div>
    </section>
  );
}
