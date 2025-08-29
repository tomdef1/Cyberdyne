import { useEffect, useRef, useState } from 'react';
import { registerSnapshot } from '../utils/snapshotBus.js';

/* MeshExecutionStream (formerly anomaly cascade)
   Depicts continuous successful mesh execution micro-batches across pipeline lanes.
   Each chip represents a completed micro execution slice with latency + classification.
*/

const LANES = 4;
const CLASSES = ['VECTOR','TENSOR','SCAN','PAYLOAD'];
const STAGES = ['INGEST','SCHEDULE','EXEC','COMMIT'];
const QUAL = ['OK','OK','OK','OK','DEGRADED']; // mostly OK

function rand(a){ return a[Math.floor(Math.random()*a.length)]; }

function latencyFor(stage){
  // base realistic microbatch latencies (ms)
  const base = stage==='INGEST'? 2.2 : stage==='SCHEDULE'? 4.5 : stage==='EXEC'? 8.0 : 3.1;
  const jitter = (Math.random()*base*0.45);
  return (base + jitter + (Math.random()<0.04? base*1.6:0)).toFixed(1)+'ms';
}

function makeItem(id){
  const stage = rand(STAGES);
  const quality = rand(QUAL);
  return {
    id,
    stage,
    cls: rand(CLASSES),
    quality,
    ms: latencyFor(stage),
    ts: new Date().toISOString().split('T')[1].replace('Z','').slice(0,12),
    lane: Math.floor(Math.random()*LANES),
    life: 1,
  };
}

export default function MeshExecutionStream(){
  const [items,setItems]=useState(()=>Array.from({length:24},(_,i)=>makeItem(i+1)));
  const idRef=useRef(items.length);
  const statsRef=useRef({ total:items.length, degraded: items.filter(i=>i.quality==='DEGRADED').length });
  useEffect(()=>{
    let t; function loop(){
      setItems(prev=>{
        const next = prev.map(it=>({...it, life: it.life - 0.02 - Math.random()*0.012 })).filter(it=>it.life>0);
        if(Math.random()<0.75){
          const spawnCount = (Math.random()<0.12? 3:1);
          for(let s=0;s<spawnCount;s++){
            const n = makeItem(++idRef.current);
            if(n.quality==='DEGRADED') statsRef.current.degraded++;
            statsRef.current.total++;
            next.unshift(n);
          }
        }
        return next.slice(0,140);
      });
      t=setTimeout(loop, 160 + Math.random()*130);
    }
    loop();
    return ()=>clearTimeout(t);
  },[]);

  const LANE_TITLES = ['VECTOR PIPE','TENSOR PIPE','SCAN PIPE','COMMIT PIPE'];

  return (
    <div className="cascade" role="group" aria-label="Mesh execution lanes">
      <header className="cascade-h">MESH EXECUTIONS</header>
      <div className="cascade-lanes mesh">
        {Array.from({length:LANES}).map((_,lane)=> (
          <div key={lane} className="cascade-lane">
            <div className="cascade-lane-h" aria-hidden="true">{LANE_TITLES[lane]}</div>
            {items.filter(i=>i.lane===lane).slice(0,14).map(it=> (
              <div key={it.id} className={`c-chip mesh-chip ${it.quality==='DEGRADED'?'c-deg':''}`} style={{opacity:Math.max(0,it.life), transform:`translateY(${(1-it.life)*14}px) scale(${0.9+it.life*0.1})`}}>
                <span className="c-ts" title="timestamp">{it.ts}</span>
                <span className="c-code" title="stage">{it.stage}</span>
                <span className="c-lat" title="latency">{it.ms}</span>
                <span className="c-tag" title="class/quality">{it.cls}{it.quality==='DEGRADED'?'*':''}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <footer className="cascade-ft small">
        <span>BATCHES {statsRef.current.total}</span>
        <span>DEG {statsRef.current.degraded}</span>
        <span>LANES {LANES}</span>
      </footer>
    </div>
  );
}

registerSnapshot('meshExec', () => ({ total: statsRef.current.total, degraded: statsRef.current.degraded, lanes: LANES }));
