import { useEffect, useState } from 'react';

const LOCKS = [
  'POLICY SIG','MODEL HASH','I/O GATE','POWER TRIP','SANDBOX WALL','FABRIC QUOTA','CRYPTO SEAL','HUMAN QUORUM','ROLLBACK ARM','ANOMALY QUAR','EDGE REVOC','TIMEBOX','LOG CHAIN','RATE LIMIT','SAFE MODE'
];

export default function InterlockMatrix(){
  const [states,setStates]=useState(()=>LOCKS.map(()=>({ok:true,ts:Date.now()})));
  useEffect(()=>{
    let id;
    function loop(){
      setStates(s=> s.map((st,i)=>{
        // occasional transient faults
        if(Math.random()<0.03){ return {ok:false,ts:Date.now()}; }
        if(!st.ok && Date.now()-st.ts>1500){ return {ok:true,ts:Date.now()}; }
        return st;
      }));
      id=setTimeout(loop, 700);
    }
    loop();
    return ()=>clearTimeout(id);
  },[]);
  return (
    <div className="interlock" role="grid" aria-label="Safety interlock status matrix">
      {LOCKS.map((name,i)=>{
        const st = states[i];
        return <div role="row" key={name} className={`il-row ${st.ok?'ok':'fail'}`}> <span role="gridcell" className="il-name">{name}</span><span role="gridcell" className="il-state">{st.ok?'OK':'FAULT'}</span></div>;
      })}
    </div>
  );
}
