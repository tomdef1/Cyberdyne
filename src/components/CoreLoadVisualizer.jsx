import { useEffect, useRef, useState, useMemo } from 'react';
import { downloadJSON } from '../utils/download.js';
import { registerSnapshot } from '../utils/snapshotBus.js';

/* CoreLoadVisualizer
   Replaces ASCII mesh with dual specialized views:
   - Neural core ring buffer occupancy & burst heat
   - Simulation sandbox scenario lifecycle chart
*/

function makeBuffer(len){ return new Array(len).fill(0); }

export default function CoreLoadVisualizer({ coreSize=48, scenarios=18, refresh=520 }){
  const [t,setT]=useState(0);
  const coreRef=useRef(makeBuffer(coreSize));
  const heatRef=useRef(makeBuffer(coreSize)); // separate heat for burst memory
  const scenRef=useRef(makeBuffer(scenarios).map(()=>({phase:0,ttl:Math.random()*12+6,load:Math.random()*0.4+0.2})));
  const metaRef=useRef({ lastPhaseWave: performance.now(), waveDir:1 });

  useEffect(()=>{
    let id;function loop(){
      const core = coreRef.current;
      const heat = heatRef.current;
      // Phase influenced bulk wave: every ~5s invert direction
      const m = metaRef.current;
      if(performance.now() - m.lastPhaseWave > 5000 + Math.random()*2500){
        m.lastPhaseWave = performance.now();
        m.waveDir *= -1;
      }
      // Shift
      core.shift(); heat.shift();
      // Compute aggregate scenario pressure (more eval/fork phases -> higher core push)
      const scenStats = scenRef.current.reduce((acc,s)=>{ acc.phase[s.phase]++; acc.load+=s.load; return acc; },{phase:[0,0,0,0],load:0});
      const pressure = (scenStats.load / scenarios) * 0.6 + (scenStats.phase[2]/scenarios)*0.25 + (scenStats.phase[1]/scenarios)*0.15; // eval, fork heavier
      // New sample with multi-component noise
      const base = 0.25 + pressure;
      const wave = 0.18 * Math.sin((t/9) * m.waveDir) + 0.1*Math.sin(t/3.7);
      const burst = Math.random()<0.12 ? (0.9 + Math.random()*0.6) : 0;
      const val = Math.min(1, base + wave + burst + (Math.random()*0.08 - 0.04));
      core.push(val);
      heat.push(Math.max(heat[heat.length-2]||0, val) * (burst?1.0:0.94));
      // decay
      for(let i=0;i<core.length-1;i++){ core[i]*=0.985; heat[i]*=0.96; }
      // mutate scenarios
      scenRef.current = scenRef.current.map(s=>{
        let {phase,ttl,load}=s; ttl -= refresh/1000; if(ttl<=0){ return {phase:0, ttl: 6+Math.random()*20, load:0.3+Math.random()*0.5}; }
        // probabilistic phase advancement weighted by load (heavier loads evaluate longer)
        const advChance = 0.18 + load*0.25;
        if(Math.random()<advChance){ phase = (phase+1)%4; if(phase===0){ load = 0.25+Math.random()*0.45; } }
        // subtle load drift
        load = Math.min(1, Math.max(0.15, load + (Math.random()-0.5)*0.05));
        return {phase,ttl,load};
      });
      setT(x=>x+1);
      id=setTimeout(loop, refresh + (Math.random()*140-70));
    } loop(); return ()=>clearTimeout(id);
  },[refresh,t]);

  const coreBars = useMemo(()=> coreRef.current.map((v,i)=>({v,i,h:heatRef.current[i]})),[t]);
  const scen = useMemo(()=> scenRef.current.map((s,i)=>({...s,i})),[t]);

  const avgLoad = coreBars.reduce((a,b)=>a+b.v,0)/coreBars.length;
  const peak = Math.max(...coreBars.map(b=>b.v));
  const evalCount = scen.filter(s=>s.phase===2).length;

  function snapshot(){
    const data = {
      ts: new Date().toISOString(),
      core: coreBars.map(b=>b.v),
      heat: coreBars.map(b=>b.h),
      scenarios: scen.map(s=>({ id:s.i, phase:s.phase, load:s.load })),
      metrics: { avgLoad, peak, evalCount }
    };
    downloadJSON('core-snapshot-'+Date.now()+'.json', data);
  }

  return (
    <div className="core-vis" role="group" aria-label="Core and simulation utilization">
      <div className="core-strip" aria-label="Neural core ring buffer">
        {coreBars.map(b=> <span key={b.i} style={{height:(b.v*100).toFixed(0)+'%', background:`linear-gradient(180deg, rgba(255,110,90,${0.6+b.v*0.4}), rgba(200,50,40,${0.5+b.h*0.5}))`}} />)}
      </div>
      <div className="scen-grid" aria-label="Simulation scenarios">
        {scen.map(s=> <div key={s.i} className={`scen scen-p${s.phase}`}>S{s.i.toString().padStart(2,'0')}<em /> </div>)}
      </div>
      <div className="legend small" style={{display:'flex',gap:'1rem',flexWrap:'wrap'}}>
        <span><b>PHASES</b> <i style={{color:'var(--accent)'}}>0</i> INGEST · 1 FORK · 2 EVAL · 3 ROLLBACK</span>
        <span>AVG { (avgLoad*100).toFixed(1)}%</span>
        <span>PEAK { (peak*100).toFixed(1)}%</span>
        <span>EVAL {evalCount}</span>
        <button onClick={snapshot} className="es-btn" style={{marginLeft:'auto'}}>SNAPSHOT</button>
      </div>
    </div>
  );
}

// Register a lightweight provider (only structural metrics to avoid large arrays unless explicitly snapshotted via button)
registerSnapshot('coreMeta', () => ({
  coreSize: 48,
  scenarios: 18,
}));
