import { useEffect, useState, useRef } from 'react';

const seeds = [
  'NEURAL FABRIC LOAD','EDGE LATENCY','SANDBOX FORKS','ANOMALY Δ','MEM SNAPSHOTS','POLICY QUEUE','ROBOTICS SWARM','THERMAL CORE','I/O THROUGHPUT'
];

function randMetric(label){
  switch(label){
    case 'NEURAL FABRIC LOAD': return `${Math.floor(30+Math.random()*50)}%`;
    case 'EDGE LATENCY': return `${(2+Math.random()*4).toFixed(1)}ms`;
    case 'SANDBOX FORKS': return Math.floor(8+Math.random()*8).toString();
    case 'ANOMALY Δ': return (Math.random()*0.01).toFixed(4);
    case 'MEM SNAPSHOTS': return Math.floor(200+Math.random()*40)+'';
    case 'POLICY QUEUE': return Math.floor(Math.random()*3)+' pending';
    case 'ROBOTICS SWARM': return Math.floor(40+Math.random()*20)+' units';
    case 'THERMAL CORE': return (40+Math.random()*15).toFixed(1)+'C';
    case 'I/O THROUGHPUT': return (5+Math.random()*3).toFixed(2)+'Gb/s';
    default: return 'OK';
  }
}

export default function TelemetryTicker(){
  const [rows,setRows]=useState(()=>seeds.map(l=>({id:l,val:randMetric(l)})));
  const timer = useRef();
  useEffect(()=>{
    timer.current=setInterval(()=>{
      setRows(r=>r.map(row=>Math.random()<0.4?{...row,val:randMetric(row.id)}:row));
    },1500);
    return ()=>clearInterval(timer.current);
  },[]);
  return (
    <div className="teletext-grid" role="log" aria-live="polite" aria-label="Live telemetry">
      {rows.map(r=> <div key={r.id} className="teletext-block">{r.id.padEnd(18,' ')} {r.val}</div>)}
    </div>
  );
}
