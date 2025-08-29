import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { downloadJSON } from '../utils/download.js';
import { SUBJECTS, VERBS, OBJECTS, TAGS } from '../data/lexicon.js';

function rand(arr){return arr[Math.floor(Math.random()*arr.length)];}
function ts(){const d=new Date();return d.toISOString().split('T')[1].replace('Z','');}
let counter=0;
const NAMESPACES=['FABRIC','SANDBOX','EDGE','AUTH','MODEL','IO','POLICY'];
const severities={ OK:'INFO', WARN:'WARN', FAIL:'ERR', AUTH:'INFO', NET:'INFO', IO:'INFO', SIM:'INFO', SEC:'WARN', DBG:'DBG' };
function quickHash(str){ let h=2166136261>>>0; for(let i=0;i<str.length;i++){ h^=str.charCodeAt(i); h = Math.imul(h,16777619); } return (h>>>0).toString(16).padStart(8,'0'); }
function makeEvent(prevHash){
  const subj = rand(SUBJECTS);
  const verb = rand(VERBS);
  const obj = rand(OBJECTS);
  const tag = rand(TAGS);
  const code = (100+ (counter % 900)).toString();
  const created = Date.now();
  const ms = new Date().toISOString().split('T')[1].replace('Z','');
  // correlation id reused ~20% of time
  const reuse = Math.random()<0.2 && window.__corr && Math.random()<0.7;
  if(!reuse || !window.__corr){ window.__corr = Math.random().toString(36).slice(2,8);}  
  const corr = window.__corr;
  const ns = rand(NAMESPACES);
  const shard = Math.floor(Math.random()*4);
  const latency = (Math.random()<0.85? (3+Math.random()*15) : (20+Math.random()*120)).toFixed(1);
  const sev = severities[tag]||'INFO';
  const base = `${counter}|${ms}|${ns}|${shard}|${subj}|${verb}|${obj}|${tag}|${corr}|${latency}`;
  const hash = quickHash((prevHash||'')+base);
  const id = ++counter;
  return { id, seq:id, code, tag, subj, verb, obj, ns, shard, corr, lat:latency, sev, msg: `${subj}:${verb}:${obj}`, ts: ms, created, hash, prev: prevHash||null };
}

export default function EventStream({ rate=360, retention=240, lifetimeMs=45000, compact=false, persistKey, showControls=true, anomalyScan=true, snapshotName }){
  const [events,setEvents]=useState(()=>{
    let prev=null;return Array.from({length:compact?8:18},()=>{ const e=makeEvent(prev); prev=e.hash; return e;});
  });
  const [paused,setPaused]=useState(false);
  const [lock,setLock]=useState(true); // auto scroll to top
  const [filters,setFilters]=useState(()=>{
    if(persistKey){
      try{ const raw = localStorage.getItem('es:filt:'+persistKey); if(raw){ return new Set(JSON.parse(raw)); } }catch{}
    }
    return new Set();
  }); // tags to include; empty = all
  const [subjectFilter,setSubjectFilter]=useState(()=>{
    if(persistKey){ try{ const v = localStorage.getItem('es:subj:'+persistKey); if(v) return v; }catch{} }
    return '';
  });
  const [dynRate,setDynRate]=useState(rate);
  const [dynRetention,setDynRetention]=useState(retention);
  const ref=useRef(null);
  const adaptiveRateRef=useRef(rate);
  const lastRenderRef=useRef(performance.now());
  const [anomalies,setAnomalies]=useState([]); // store recent anomaly event ids
  const [raw,setRaw]=useState(false);
  const lastHashRef=useRef(events[0]?.hash||null);

  // Adaptive throttle based on tab visibility & simple frame delta
  useEffect(()=>{
    function vis(){ if(document.hidden){ adaptiveRateRef.current = rate/4; } else { adaptiveRateRef.current = rate; } }
    document.addEventListener('visibilitychange',vis);
    return ()=>document.removeEventListener('visibilitychange',vis);
  },[rate]);

  useEffect(()=>{
    let raf;
    function loop(){
      const now=performance.now();
      const delta=now - lastRenderRef.current;
      lastRenderRef.current = now;
      // if delta big (laggy), reduce rate temporarily
      if(delta > 120){ adaptiveRateRef.current = Math.max(30, adaptiveRateRef.current * 0.85); }
      else if(delta < 40){ adaptiveRateRef.current = Math.min(rate, adaptiveRateRef.current * 1.02); }
      raf=requestAnimationFrame(loop);
    }
    raf=requestAnimationFrame(loop);
    return ()=>cancelAnimationFrame(raf);
  },[rate]);

  useEffect(()=>{ adaptiveRateRef.current = dynRate; },[dynRate]);

  // persist filters / subject
  useEffect(()=>{ if(persistKey){ try{ localStorage.setItem('es:filt:'+persistKey, JSON.stringify([...filters])); }catch{} } },[filters,persistKey]);
  useEffect(()=>{ if(persistKey){ try{ localStorage.setItem('es:subj:'+persistKey, subjectFilter); }catch{} } },[subjectFilter,persistKey]);

  useEffect(()=>{
    if(paused) return;
    let cancelled=false;
    function schedule(){
      const interval = 60000 / adaptiveRateRef.current;
      setTimeout(()=>{
        if(cancelled || paused) return;
    setEvents(ev=>{
          const now=Date.now();
      const nextEvents = ev.filter(e=> now - e.created < lifetimeMs).slice(0,dynRetention);
      const newestPrev = nextEvents[0]? nextEvents[0].hash : lastHashRef.current;
      const newE = makeEvent(newestPrev);
      lastHashRef.current = newE.hash;
      const next=[newE,...nextEvents];
            // anomaly detection: check recent frequency spikes
            if(anomalyScan){
              const windowMs = 4000;
              const recent = next.filter(e=> now - e.created < windowMs);
              if(recent.length > (adaptiveRateRef.current * (windowMs/60000)) * 1.6){
                // mark top 3 newest as anomaly
                setAnomalies(a=>[...recent.slice(0,3).map(r=>r.id),...a].slice(0,30));
              }
            }
            return next;
        });
        schedule();
      }, interval);
    }
    schedule();
    return ()=>{cancelled=true};
  },[paused, dynRetention, lifetimeMs, anomalyScan]);

  // Scroll lock behaviour
  const onScroll=useCallback(()=>{
    if(!ref.current) return;
    if(ref.current.scrollTop>5 && lock){ setLock(false); }
  },[lock]);

  useEffect(()=>{ if(lock && ref.current){ ref.current.scrollTop=0; } },[events,lock]);

  const toggleFilter = tag => setFilters(f=>{ const n=new Set(f); if(n.has(tag)) n.delete(tag); else n.add(tag); return n; });

  const filtered = useMemo(()=>{
    return events.filter(e=> (filters.size===0 || filters.has(e.tag)) && (!subjectFilter || e.subj.startsWith(subjectFilter)) );
  },[events,filters,subjectFilter]);

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'4px'}}>
      {!compact && showControls && (
        <div className="event-controls" aria-label="Event stream controls">
          <button onClick={()=>setPaused(p=>!p)} className="es-btn" aria-pressed={paused}>{paused?'RESUME':'PAUSE'}</button>
          <button onClick={()=>setLock(l=>!l)} className="es-btn" aria-pressed={lock}>{lock?'UNLOCK SCROLL':'LOCK SCROLL'}</button>
          <label style={{display:'flex',alignItems:'center',gap:4}} className="es-rate small">RATE
            <input type="range" min="60" max="600" value={dynRate} onChange={e=>setDynRate(+e.target.value)} aria-label="Event rate" />
          </label>
          <label style={{display:'flex',alignItems:'center',gap:4}} className="es-ret small">KEEP
            <input type="range" min="60" max="600" value={dynRetention} onChange={e=>setDynRetention(+e.target.value)} aria-label="Retention count" />
          </label>
          <div className="es-tags" role="group" aria-label="Tag filters">
            {TAGS.map(t=> <button key={t} onClick={()=>toggleFilter(t)} className={`es-tag ${filters.has(t)?'on':''}`} aria-pressed={filters.has(t)}>{t}</button>)}
            <button onClick={()=>setFilters(new Set())} className="es-btn es-clear">CLR</button>
          </div>
          <input aria-label="Subject filter" className="es-subj" placeholder="SUBJ" value={subjectFilter} onChange={e=>setSubjectFilter(e.target.value.toUpperCase())} />
          <button className="es-btn" onClick={()=>setRaw(r=>!r)} aria-pressed={raw}>{raw?'VIEW FORMAT':'VIEW JSON'}</button>
          <button className="es-btn" onClick={()=>downloadJSON((snapshotName||persistKey||'events')+ '-' + Date.now()+'.json', filtered.slice(0,400))}>SNAPSHOT</button>
        </div>
      )}
      {!raw && (
        <div className="event-stream" ref={ref} onScroll={onScroll} aria-label="Live system events" role="log" aria-live="polite">
          {filtered.map(e=> {
            const age = Date.now() - e.created;
            const fading = age > lifetimeMs * 0.8;
            const anomaly = anomalies.includes(e.id);
            // chain integrity (re-hash)
            const expected = quickHash((e.prev||'')+`${e.seq-1}|${e.ts}|${e.ns}|${e.shard}|${e.subj}|${e.verb}|${e.obj}|${e.tag}|${e.corr}|${e.lat}`);
            const chainBreak = e.prev && expected!==e.hash; // should rarely happen
            return (
              <div key={e.id} className={`event-row ${fading?'fade':''} ${anomaly?'anomaly':''} ${chainBreak?'chain-break':''} tag-${e.tag.toLowerCase()}`}>          
                <span className="event-ts" title={e.created}>{e.ts}</span>
                <span className="event-code" title={e.sev}>{e.sev}</span>
                <span className="event-ns" title="namespace">{e.ns}</span>
                <span className="event-shard" title="shard">s{e.shard}</span>
                <span className="event-msg">{e.msg}</span>
                <span className="event-lat" title="latency ms">{e.lat}ms</span>
                <span className="event-corr" title="correlation">{e.corr}</span>
                <span className="event-hash" title={`hash ${e.hash}`}>{e.hash.slice(0,6)}</span>
                <span className="event-tag" data-tag={e.tag}>{e.tag}</span>
              </div>
            );
          })}
        </div>
      )}
      {raw && (
        <pre className="event-stream raw-json" aria-label="Raw JSON events" style={{maxHeight:210,overflow:'auto',background:'#05080a',padding:'.5rem',border:'1px solid #1d2428',outline:'1px solid #0d1214',outlineOffset:'-3px',fontSize:'.44rem'}}>{JSON.stringify(filtered.slice(0,120),null,2)}</pre>
      )}
    </div>
  );
}
