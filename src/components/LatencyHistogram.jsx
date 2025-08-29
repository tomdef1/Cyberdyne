import { useEffect, useState, useRef } from 'react';

// LatencyHistogram simulates rolling containment rollback latency distribution in ms.
// Shows buckets and p95/p99 estimates updated every second.

const BUCKETS = [1,2,4,8,12,16,24,32,48,64,96,128,192,256];

function genSample(){
  // mixture: fast path majority, occasional slower tail
  const base = Math.random();
  if(base < 0.82) return 3 + Math.random()*9; // 3-12ms
  if(base < 0.96) return 12 + Math.random()*30; // 12-42
  return 42 + Math.random()*140; // tail
}

export default function LatencyHistogram({ windowSize=420, updateMs=1000 }){
  const [tick,setTick]=useState(0);
  const store = useRef([]);
  useEffect(()=>{
    let id;
    function loop(){
      // push ~60 new samples per second (simulate high-volume operations)
      for(let i=0;i<60;i++) store.current.push(genSample());
      if(store.current.length>windowSize) store.current.splice(0, store.current.length-windowSize);
      setTick(t=>t+1);
      id=setTimeout(loop, updateMs);
    }
    loop();
    return ()=>clearTimeout(id);
  },[windowSize, updateMs]);

  const samples = store.current;
  const sorted = [...samples].sort((a,b)=>a-b);
  const p = q => sorted.length? sorted[Math.min(sorted.length-1, Math.floor(q*(sorted.length-1)))] : 0;
  const p95 = p(0.95).toFixed(1);
  const p99 = p(0.99).toFixed(1);
  const counts = BUCKETS.map(()=>0);
  for(const s of samples){
    const idx = BUCKETS.findIndex(b=> s <= b) ?? BUCKETS.length-1;
    counts[idx===-1?counts.length-1:idx]++;
  }
  const max = Math.max(1,...counts);
  return (
    <div className="lat-hist" role="group" aria-label="Rollback latency distribution">
      <header className="lat-hist-h">ROLLBACK LATENCY</header>
      <div className="lat-hist-grid">
        {counts.map((c,i)=>{
          const pct = (c/max);
          const bucket = BUCKETS[i];
          return (
            <div key={i} className="lat-bar" title={`<=${bucket}ms: ${c} samples`}> <span style={{height:(pct*100).toFixed(1)+'%'}} /> <em>{bucket}</em></div>
          );
        })}
      </div>
      <footer className="lat-hist-f"><span>P95 {p95}ms</span><span>P99 {p99}ms</span><span>N {samples.length}</span></footer>
    </div>
  );
}
