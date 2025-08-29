import { useMemo } from 'react';
import Sparkline from './Sparkline.jsx';

// RiskPanel synthesizes operational risk surface metrics for realism.
// Each metric uses a deterministic pseudo-random generator seeded by label for stable variability.

function makeSource(seed){
  let x = seed;
  return ()=>{
    // xorshift-like
    x ^= x << 13; x ^= x >> 17; x ^= x << 5;
    const norm = (x>>>0) / 0xffffffff;
    return 0.35 + Math.sin(x)*0.15 + norm*0.4; // keep within ~0..1
  };
}

const METRICS = [
  ['ANOMALY SURFACE', 11],
  ['ROLLBACK LATENCY', 23],
  ['POLICY QUEUE DEPTH', 37],
  ['EDGE PACKET LOSS', 19],
  ['MODEL DRIFT INDEX', 29],
  ['SANDBOX SATURATION', 41],
];

export default function RiskPanel(){
  const rows = useMemo(()=> METRICS.map(([label,seed])=>({ label, seed })),[]);
  return (
    <div className="risk-panel" aria-label="Operational risk indicators" role="group">
      <header className="risk-h">RISK INDICATORS</header>
      <div className="risk-grid">
        {rows.map(r=>{
          const src = makeSource(r.seed + Date.now()%1000);
          return (
            <div key={r.label} className="risk-row">
              <span className="risk-label">{r.label}</span>
              <Sparkline source={src} ariaLabel={r.label.toLowerCase()} interval={1000+ (r.seed%7)*140} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
