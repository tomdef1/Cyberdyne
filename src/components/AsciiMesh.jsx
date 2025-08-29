import { useEffect, useRef, useState, useMemo } from 'react';

/* MeshVisual 2.0
   Simulated neural / interconnect lattice with:
   - Node activation intensity (decaying)
   - Dynamic link pulses between random node pairs
   - Cluster highlighting (pods) for realism
   - Character palette encoding state (low '.' idle → '@' saturated)
*/

const CHARS = ['·','.',':','-','+','*','#','%','@'];
const palette = (v)=> CHARS[Math.min(CHARS.length-1, Math.floor(v*(CHARS.length)))];

export default function AsciiMesh({ dim=40, refresh=90, pulseRate=240, pods=4, showPods=true }){
  const total = dim*dim;
  const [frame,setFrame]=useState(0);
  const activityRef = useRef(new Float32Array(total));
  const linkRef = useRef([]); // active pulses {a,b,t}
  const lastTime = useRef(performance.now());

  // Tick
  useEffect(()=>{
    let raf;
    function loop(){
      const now = performance.now();
      const dt = (now - lastTime.current)/1000; // seconds
      lastTime.current = now;
      // decay
      const act = activityRef.current;
      for(let i=0;i<act.length;i++){
        const v = act[i];
        if(v>0){
          act[i] = Math.max(0, v - dt*0.85 - (v*0.18*dt));
        }
      }
      // spawn new pulses
      const expected = pulseRate * dt;
      let spawns = expected + (Math.random()-0.5);
      for(let s=0;s<spawns;s++){
        const a = Math.floor(Math.random()*total);
        const b = Math.floor(Math.random()*total);
        if(a===b) continue;
        linkRef.current.push({a,b,t:0});
      }
      // advance pulses
      linkRef.current = linkRef.current.filter(l=>{
        l.t += dt*3; // speed
        if(l.t>=1){
          // deposit activation at destination
            act[l.b] = Math.min(1, act[l.b] + 0.55 + Math.random()*0.25);
          return false;
        }
        // mid-pulse activation trace
        const ix = Math.random()<0.5? l.a : l.b;
        act[ix] = Math.min(1, act[ix] + 0.02);
        return true;
      });
      // mild background noise
      for(let n=0;n<4;n++){
        const idx = Math.floor(Math.random()*total);
        act[idx] = Math.min(1, act[idx] + Math.random()*0.15);
      }
      setFrame(f=>f+1);
      raf=requestAnimationFrame(loop);
    }
    raf=requestAnimationFrame(loop);
    return ()=>cancelAnimationFrame(raf);
  },[pulseRate,total]);

  const cells = useMemo(()=>{
    const act = activityRef.current;
    const out = new Array(total);
    for(let i=0;i<total;i++){
      const v = act[i];
      out[i] = palette(v);
    }
    return out;
  },[frame,total]);

  // optional pod highlighting by background color banding
  const podMap = useMemo(()=>{
    if(!showPods) return null;
    const per = Math.floor(dim/Math.sqrt(pods));
    const map = new Array(total).fill(0);
    let podIndex=0;
    const podsPerRow = Math.ceil(dim/per);
    for(let y=0;y<dim;y++){
      for(let x=0;x<dim;x++){
        const py = Math.floor(y/per);
        const px = Math.floor(x/per);
        podIndex = py * podsPerRow + px;
        map[y*dim+x] = podIndex;
      }
    }
    return map;
  },[showPods,dim,pods,total]);

  return (
    <div className="ascii-mesh" aria-hidden="true" style={{gridTemplateColumns:`repeat(${dim},8px)`}}>
      {cells.map((ch,i)=>{
        let style; if(podMap){ const hue = (podMap[i]*37)%360; style={color:`hsl(${hue} 28% ${25 + (activityRef.current[i]*40)|0}%)`}; }
        return <span key={i} style={style}>{ch}</span>;
      })}
    </div>
  );
}
