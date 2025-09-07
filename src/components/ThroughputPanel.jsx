import { useEffect, useRef, useState } from "react";
import { registerSnapshot } from "../utils/snapshotBus.js";

/*
  ThroughputPanel
  High‑frequency synthetic telemetry approximating real AI datacenter performance layers.
  - Multi precision FLOPS (FP4/FP8/BF16) aggregated
  - Rack / pod scale estimates
  - Memory + interconnect bandwidth utilization
  - Power envelope + efficiency trends
  - Adaptive refresh ~ every 250ms, micro jitter for realism
*/

const fmt = (n, unit) => {
  if (n >= 1e3) return (n / 1e3).toFixed(2) + " " + "E" + unit; // exa
  if (n >= 1) return n.toFixed(2) + " P" + unit; // peta
  return (n * 1e3).toFixed(1) + " T" + unit; // fallback
};

export default function ThroughputPanel({
  pods = 3,
  racksPerPod = 8,
  gpusPerRack = 72,
}) {
  const [tick, setTick] = useState(0);
  // Correlated stochastic state (mean reversion + bursts) to avoid linear / predictable waves
  const state = useRef({
    baseLoad: 0.78,
    memBias: 0.65,
    netBias: 0.58,
    drift: 0,
    lastBurst: performance.now(),
    burstMag: 0,
  });
  useEffect(() => {
    // single loop updates light-weight per-metric state values so metrics
    // move independently but remain plausibly correlated via baseLoad
    let id;
    function loop() {
      const s = state.current;
      const now = performance.now();
      // Occasional larger burst (less frequent, smaller magnitude than before)
      if (now - s.lastBurst > 4500 + Math.random() * 6000) {
        s.lastBurst = now;
        s.burstMag = 0.1 + Math.random() * 0.12; // smaller injected magnitude
      }

      // smaller pseudo time step for gentler reversion
      const dt = 0.12;
      function step(val, target, sigma = 0.018) {
        return val + (target - val) * 0.14 * dt + (Math.random() - 0.5) * sigma;
      }

      // base workload drifts slowly with a long-period oscillation
      s.baseLoad = step(s.baseLoad, 0.78 + Math.sin(now / 12000) * 0.03, 0.03);

      // biases track baseLoad but have independent targets and smaller noise
      s.memBias = step(
        s.memBias,
        s.baseLoad - 0.06 + Math.sin(now / 9000) * 0.02,
        0.02
      );
      s.netBias = step(
        s.netBias,
        s.baseLoad - 0.12 + Math.sin(now / 10000 + 1) * 0.03,
        0.025
      );

      // independent micro-noise channels cause metrics to diverge a bit
      s.fp8Noise = (s.fp8Noise || 0) * 0.92 + (Math.random() - 0.5) * 0.01;
      s.bf16Noise = (s.bf16Noise || 0) * 0.92 + (Math.random() - 0.5) * 0.01;
      s.memNoise = (s.memNoise || 0) * 0.9 + (Math.random() - 0.5) * 0.008;
      s.netNoise = (s.netNoise || 0) * 0.9 + (Math.random() - 0.5) * 0.01;

      // slow hidden drift affecting efficiency only
      s.drift += (Math.random() - 0.5) * 0.001;

      // Burst decay (faster decay)
      s.burstMag *= 0.86;

      setTick((t) => t + 1);
      // slower, less jittery interval to reduce perceived volatility
      const interval = 420 + Math.random() * 480; // 420-900ms
      id = setTimeout(loop, interval);
    }
    loop();
    return () => clearTimeout(id);
  }, []);

  // Derived synthetic metrics (15x scale up vs prior baseline)
  const racks = pods * racksPerPod;
  const totalGPUs = racks * gpusPerRack;
  // Hyper-dense module assumption: prior rackFp4 1.44 exa -> *15 ≈ 21.6 exa
  const rackFp4 = 1.44 * 15; // exaFLOPS
  const rackFp8 = rackFp4 / 2; // exa
  const rackBf16 = rackFp4 / 4; // exa

  const s = state.current;
  // Compose metrics with light per-metric deviations so they don't all move identically.
  const burstFactor = 1 + s.burstMag;
  const util = Math.min(0.98, Math.max(0.42, s.baseLoad * burstFactor));
  const memUtil = Math.min(
    0.98,
    Math.max(0.36, s.memBias * (0.92 + s.burstMag * 0.25) + (s.memNoise || 0))
  );
  const netUtil = Math.min(
    0.98,
    Math.max(0.3, s.netBias * (0.9 + s.burstMag * 0.28) + (s.netNoise || 0))
  );

  // Add small independent multipliers for FP8/BF16 to desynchronize them
  const exaFp4 = racks * rackFp4 * util;
  const exaFp8 =
    racks * rackFp8 * util * (0.96 + (s.fp8Noise || 0) + s.burstMag * 0.08);
  const exaBf16 = racks * rackBf16 * (util * 0.975 + (s.bf16Noise || 0));

  // Memory bandwidth (TB/s)
  const bwPerGPU_TBs = 4.8 * 1.2; // assume faster HBM revision
  const memTBs =
    totalGPUs *
    bwPerGPU_TBs *
    memUtil *
    (1 + s.burstMag * 0.12 + (s.memNoise || 0));

  // Interconnect aggregate (TB/s)
  const linkPerGPU_TBs = 1.8 * 1.3; // next-gen fabric uplift
  const fabricTBs =
    totalGPUs *
    linkPerGPU_TBs *
    netUtil *
    (1 + s.burstMag * 0.14 + (s.netNoise || 0));

  // Power (kW) — sublinear scaling; advanced cooling & binning keep envelope saner
  const rackPower = 126 * 1.55; // modestly higher per rack
  const thermalSag = 0.98 + Math.random() * 0.01 - s.burstMag * 0.05; // milder dip under burst
  const totalPowerKW = racks * rackPower * (0.88 + util * 0.14) * thermalSag;
  const fp8PF = exaFp8 * 1000; // exa -> peta
  const efficiency = (fp8PF / Math.max(1, totalPowerKW)) * (1 + s.drift); // PFLOPS / kW

  const rows = [
    { label: "FP4 THROUGHPUT", value: fmt(exaFp4 * 1000, "FLOPS"), util },
    {
      label: "FP8 THROUGHPUT",
      value: fmt(exaFp8 * 1000, "FLOPS"),
      util: util * 0.985,
    },
    {
      label: "BF16 THROUGHPUT",
      value: fmt(exaBf16 * 1000, "FLOPS"),
      util: util * 0.95,
    },
    {
      label: "MEM BANDWIDTH",
      value: (memTBs / 1000).toFixed(2) + " PB/s",
      util: memUtil,
    },
    {
      label: "FABRIC XFER",
      value: (fabricTBs / 1000).toFixed(2) + " PB/s",
      util: netUtil,
    },
    {
      label: "TOTAL POWER",
      value: totalPowerKW.toFixed(0) + " kW",
      util: totalPowerKW / (racks * rackPower * 1.2),
    },
    {
      label: "FP8 EFFICIENCY",
      value: efficiency.toFixed(2) + " PF/kW",
      util: Math.max(0, efficiency / 25),
    },
    {
      label: "ACTIVE GPUS",
      value: totalGPUs.toLocaleString(),
      util: util * 0.99,
    },
  ];

  // update module-level snapshot so other components (history/live) can read exact values
  try {
    // exaFp4 -> TF conversion: exa * 1e6
    const fp4_tf = exaFp4 * 1e6;
    // include counts and constants so consumers can reconstruct more accurate historic points
    _updateThroughputSnapshot({
      fp4_tf,
      power_kw: totalPowerKW,
      util,
      pods,
      racksPerPod,
      gpusPerRack,
      racks,
      rackFp4,
    });
  } catch (e) {
    // ignore in render-critical path
  }

  return (
    <div className="throughput" aria-label="AI compute throughput" role="group">
      <header className="throughput-h">AI FABRIC THROUGHPUT</header>
      <div className="throughput-grid">
        {rows.map((r) => {
          const pct = Math.min(1, Math.max(0, r.util));
          // split value into number + unit (if present) so unit can break to its own line
          const parts = ("" + r.value).split(" ");
          const unit = parts.length > 1 ? parts.pop() : "";
          const number = parts.join(" ");
          return (
            <div key={r.label} className="tp-row">
              <span className="tp-label">{r.label}</span>
              <span className="tp-val">
                <span className="tp-number">{number}</span>
                {unit && <span className="tp-unit">{unit}</span>}
              </span>
              <span className="tp-bar" aria-hidden="true">
                <span style={{ width: (pct * 100).toFixed(1) + "%" }} />
              </span>
            </div>
          );
        })}
      </div>
      <footer className="throughput-f">
        <span>{pods} PODS</span>
        <span>{racks} RACKS</span>
        <span>{totalGPUs.toLocaleString()} ACCELERATORS</span>
      </footer>
    </div>
  );
}

// Expose the most recent computed metrics for other consumers (snapshot bus)
const _lastThroughputSnapshot = {
  ts: new Date().toISOString(),
  fp4_tf: 0,
  power_kw: 0,
  util: 0,
};

// register once; provider reads the mutable _lastThroughputSnapshot
registerSnapshot("throughput", () => ({ ..._lastThroughputSnapshot }));

// helper used inside component to update module-level snapshot (keeps registration stable)
export function _updateThroughputSnapshot(vals) {
  if (!vals) return;
  _lastThroughputSnapshot.ts = new Date().toISOString();
  if (typeof vals.fp4_tf === "number")
    _lastThroughputSnapshot.fp4_tf = vals.fp4_tf;
  if (typeof vals.power_kw === "number")
    _lastThroughputSnapshot.power_kw = vals.power_kw;
  if (typeof vals.util === "number") _lastThroughputSnapshot.util = vals.util;
}
