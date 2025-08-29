import { useEffect, useState, useRef } from 'react';

const TYPES = ['SNAP','VETO','TRACE','HASH','ATTEST'];
const DETAILS = ['segment rotated','quorum ack','intent hashed','drift probe','rollback verified','enclave diff','policy bundle','snapshot pruned'];

function rand(a){ return a[Math.floor(Math.random()*a.length)]; }
function make(){
  const ts = new Date().toISOString().split('T')[1].replace('Z','');
  return { id: Math.random().toString(36).slice(2), ts, type: rand(TYPES), detail: rand(DETAILS), seq: (Math.random()*1e6|0).toString(16) };
}

export default function TransparencyFeed({ rate=28, max=80, persistKey="transparency" }){
  const [rows,setRows] = useState(()=>Array.from({length:12},make));
  const [paused,setPaused]=useState(false);
  const [typeFilter,setTypeFilter]=useState(()=>{ try{ return localStorage.getItem('tf:flt:'+persistKey)||'';}catch{return '';} });
  const rateRef = useRef(rate);
  useEffect(()=>{ rateRef.current = rate; },[rate]);
  useEffect(()=>{ try{ localStorage.setItem('tf:flt:'+persistKey,typeFilter);}catch{} },[typeFilter,persistKey]);
  useEffect(()=>{
    if(paused) return; let stopped=false;
    function loop(){
      const interval = 60000 / rateRef.current;
      setTimeout(()=>{
        if(stopped || paused) return;
        setRows(r=>[make(),...r].slice(0,max));
        loop();
      }, interval);
    }
    loop();
    return ()=>{ stopped=true; };
  },[max,paused]);
  const filtered = typeFilter? rows.filter(r=>r.type===typeFilter): rows;
  function exportJSON(){
    const blob = new Blob([JSON.stringify(filtered,null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href=url; a.download='transparency-log.json'; a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div style={{display:'flex',flexDirection:'column',gap:'.5rem'}}>
      <div className="tf-controls" style={{display:'flex',flexWrap:'wrap',gap:'.4rem',alignItems:'center'}}>
        <button className="es-btn" onClick={()=>setPaused(p=>!p)} aria-pressed={paused}>{paused?'RESUME':'PAUSE'}</button>
        <label style={{display:'flex',alignItems:'center',gap:4}} className="small">TYPE
          <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)} aria-label="Filter type" style={{background:'#10171a',color:'#d2d8db',border:'1px solid #202b30',fontSize:'.55rem',letterSpacing:'.15em',padding:'.25rem .35rem'}}>
            <option value="">ALL</option>
            {TYPES.map(t=> <option key={t} value={t}>{t}</option>)}
          </select>
        </label>
        <button className="es-btn" onClick={exportJSON}>EXPORT</button>
      </div>
      <div className="transparency-feed" role="log" aria-live="polite" aria-label="Export log feed">
        {filtered.map(r=> <div key={r.id} className="tf-row"><span className="tf-ts">{r.ts}</span><span className="tf-type">{r.type}</span><span className="tf-det">{r.detail}</span><span className="tf-seq">{r.seq}</span></div>)}
      </div>
    </div>
  );
}
