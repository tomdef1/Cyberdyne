import { useEffect, useState, useRef } from 'react';

const TYPES = ['ANOM','SYNC','POLICY','SIM','NODE','I/O','AUTH'];
const MSG = [
  'anomaly score stable','sandbox fork complete','policy quorum cached','latency within envelope','snapshot persisted','rollback point sealed','edge mesh converged','no unauthorized escalation','thermal variance acceptable','integrity attest OK','delta drift below threshold'
];

function sample(a){return a[Math.floor(Math.random()*a.length)];}
function now(){return new Date().toISOString().split('T')[1].split('.')[0];}

export default function EventFeed(){
  const [rows,setRows]=useState(()=>[]);
  const ref=useRef();
  useEffect(()=>{
    const push=()=>setRows(r=>{
      const next=[{id:crypto.randomUUID(),time:now(),type:sample(TYPES),msg:sample(MSG)} , ...r].slice(0,60);
      return next;
    });
    push();
    ref.current=setInterval(push,1300);
    return ()=>clearInterval(ref.current);
  },[]);
  return (
    <div className="live-feed" aria-live="polite" aria-label="System event feed">
      {rows.map(row=> <div key={row.id} className="live-row"><span className="live-time">{row.time}</span><span className="live-type">{row.type}</span><span>{row.msg}</span></div>)}
    </div>
  );
}
