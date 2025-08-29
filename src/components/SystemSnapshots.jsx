import { useEffect, useState } from 'react';
import { bundleWithSignature, startAutoCapture, stopAutoCapture, isAutoRunning, getAutoCaptures, clearAutoCaptures, listProviders } from '../utils/snapshotBus.js';
import { downloadJSON } from '../utils/download.js';

export default function SystemSnapshots(){
  const [auto,setAuto]=useState(isAutoRunning());
  const [captures,setCaptures]=useState(()=>getAutoCaptures());
  const [busy,setBusy]=useState(false);
  const providers = listProviders();

  useEffect(()=>{
    const id = setInterval(()=> setCaptures(getAutoCaptures()), 3000);
    return ()=>clearInterval(id);
  },[]);

  async function manual(){
    setBusy(true);
    const b = await bundleWithSignature();
    downloadJSON('bundle-'+Date.now()+'.json', b);
    setCaptures(getAutoCaptures());
    setBusy(false);
  }
  function toggle(){
    if(auto){ stopAutoCapture(); setAuto(false); }
    else { startAutoCapture(); setAuto(true); }
  }
  function clear(){ clearAutoCaptures(); setCaptures([]); }

  return (
    <div className="snapshot-panel" aria-label="Snapshot controls" role="group">
      <header className="snapshot-h">SYSTEM SNAPSHOTS</header>
      <div className="snapshot-actions">
        <button className="es-btn" onClick={manual} disabled={busy}>{busy?'GENERATING...':'CAPTURE & DOWNLOAD'}</button>
        <button className="es-btn" onClick={toggle}>{auto?'STOP AUTO':'START AUTO'}</button>
        <button className="es-btn" onClick={clear}>CLEAR BUFFER</button>
      </div>
      <div className="snapshot-meta small">Providers: {providers.join(', ')||'none'}</div>
      <ol className="snapshot-list small" aria-label="Recent auto snapshots">
        {captures.map((c,i)=>(
          <li key={i}>
            <button className="es-btn" onClick={()=>downloadJSON('auto-'+c.ts+'.json', c)}>{i+1}. {c.ts} sig {c.signature?.hex?.slice(0,10)}</button>
          </li>
        ))}
        {captures.length===0 && <li>No auto captures yet.</li>}
      </ol>
    </div>
  );
}
