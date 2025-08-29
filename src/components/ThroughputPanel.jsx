import { useEffect, useRef, useState } from 'react';
import { registerSnapshot } from '../utils/snapshotBus.js';

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
  if(n >= 1e3) return (n/1e3).toFixed(2) + ' ' + 'E' + unit; // exa
  if(n >= 1) return n.toFixed(2) + ' P' + unit; // peta
  return (n*1e3).toFixed(1) + ' T' + unit; // fallback
};

export default function ThroughputPanel({ pods=3, racksPerPod=8, gpusPerRack=72 }){
  const [tick,setTick]=useState(0);
  // Correlated stochastic state (mean reversion + bursts) to avoid linear / predictable waves
  const state = useRef({
    baseLoad: 0.78,
    memBias: 0.65,
    netBias: 0.58,
    drift: 0,
    lastBurst: performance.now(),
    burstMag: 0,
  });
  useEffect(()=>{
    let id;
    function loop(){
      const s = state.current;
      const now = performance.now();
      // Occasional synchronized burst every 3-7s
      if(now - s.lastBurst > (3000 + Math.random()*4000)){
        s.lastBurst = now;
        s.burstMag = 0.18 + Math.random()*0.25; // magnitude injected then decays
      }
      // Mean reversion + noise (Ornstein–Uhlenbeck style)
      const dt = 0.22; // pseudo time step
      function step(val, target, sigma=0.035){
        return val + (target - val)*0.18*dt + (Math.random()-0.5)*sigma; }
      s.baseLoad = step(s.baseLoad, 0.80 + Math.sin(now/7000)*0.04, 0.05);
      s.memBias = step(s.memBias, s.baseLoad - 0.06 + Math.sin(now/5300)*0.03, 0.04);
      s.netBias = step(s.netBias, s.baseLoad - 0.14 + Math.sin(now/6100 + 1)*0.05, 0.055);
      s.drift += (Math.random()-0.5)*0.002; // slow hidden drift affecting efficiency only
      // Burst decay
      s.burstMag *= 0.90;
      setTick(t=>t+1);
      const interval = 160 + Math.random()*90; // faster, jittery
      id=setTimeout(loop, interval);
    }
    loop();
    return ()=>clearTimeout(id);
  },[]);

  // Derived synthetic metrics (15x scale up vs prior baseline)
  const racks = pods * racksPerPod;
  const totalGPUs = racks * gpusPerRack;
  // Hyper-dense module assumption: prior rackFp4 1.44 exa -> *15 ≈ 21.6 exa
  const rackFp4 = 1.44 * 15; // exaFLOPS
  const rackFp8 = rackFp4/2; // exa
  const rackBf16 = rackFp4/4; // exa

  const s = state.current;
  const burstFactor = 1 + s.burstMag;
  const util = Math.min(0.995, Math.max(0.4, s.baseLoad * burstFactor));
  const memUtil = Math.min(0.99, Math.max(0.35, s.memBias * (0.92 + s.burstMag*0.4)));
  const netUtil = Math.min(0.99, Math.max(0.30, s.netBias * (0.9 + s.burstMag*0.6)));

  const exaFp4 = racks * rackFp4 * util;
  const exaFp8 = racks * rackFp8 * util * (0.94 + Math.random()*0.06 + s.burstMag*0.15);
  const exaBf16 = racks * rackBf16 * (util*0.97 + (Math.random()-0.5)*0.015);

  // Memory bandwidth (TB/s)
  const bwPerGPU_TBs = 4.8 * 1.2; // assume faster HBM revision
  const memTBs = totalGPUs * bwPerGPU_TBs * memUtil * (1 + s.burstMag*0.2);

  // Interconnect aggregate (TB/s)
  const linkPerGPU_TBs = 1.8 * 1.3; // next-gen fabric uplift
  const fabricTBs = totalGPUs * linkPerGPU_TBs * netUtil * (1 + s.burstMag*0.32);

  // Power (kW) — sublinear scaling; advanced cooling & binning keep envelope saner
  const rackPower = 126 * 1.55; // modestly higher per rack
  const thermalSag = 0.97 + (Math.random()*0.02) - s.burstMag*0.08; // efficiency dip under burst
  const totalPowerKW = racks * rackPower * (0.86 + util*0.18) * thermalSag;
  const fp8PF = exaFp8 * 1000; // exa -> peta
  const efficiency = (fp8PF / totalPowerKW) * (1 + s.drift); // PFLOPS / kW

  const rows = [
    { label: 'FP4 THROUGHPUT', value: fmt(exaFp4*1000,'FLOPS'), util },
    { label: 'FP8 THROUGHPUT', value: fmt(exaFp8*1000,'FLOPS'), util: util*0.985 },
    { label: 'BF16 THROUGHPUT', value: fmt(exaBf16*1000,'FLOPS'), util: util*0.95 },
    { label: 'MEM BANDWIDTH', value: (memTBs/1000).toFixed(2)+' PB/s', util: memUtil },
    { label: 'FABRIC XFER', value: (fabricTBs/1000).toFixed(2)+' PB/s', util: netUtil },
    { label: 'TOTAL POWER', value: totalPowerKW.toFixed(0)+' kW', util: totalPowerKW/(racks*rackPower*1.2) },
    { label: 'FP8 EFFICIENCY', value: efficiency.toFixed(2)+' PF/kW', util: efficiency / 25 },
    { label: 'ACTIVE GPUS', value: totalGPUs.toLocaleString(), util: util*0.99 },
  ];

  return (
    <div className="throughput" aria-label="AI compute throughput" role="group">
      <header className="throughput-h">AI FABRIC THROUGHPUT</header>
      <div className="throughput-grid">
        {rows.map(r=>{
          const pct = Math.min(1, Math.max(0, r.util));
          return (
            <div key={r.label} className="tp-row">
              <span className="tp-label">{r.label}</span>
              <span className="tp-val">{r.value}</span>
              <span className="tp-bar" aria-hidden="true">
                <span style={{width:(pct*100).toFixed(1)+'%'}} />
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

// Register snapshot provider outside render to avoid re-registration loops.
registerSnapshot('throughput', () => {
  // expose current approximated metrics (last computed values on module scope not retained, so compute minimal surrogate)
  return { pods, racksPerPod, gpusPerRack };
});
