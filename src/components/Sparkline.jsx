import { useEffect, useRef, useState } from 'react';

// Tiny sparkline using unicode block levels for quick rendering without canvas.
// Accepts numeric samples 0..1 (auto clamps) and renders fixed width.

const BLOCKS = ['▁','▂','▃','▄','▅','▆','▇','█'];
function ch(v){
  const i = Math.min(BLOCKS.length-1, Math.max(0, Math.round(v*(BLOCKS.length-1))));
  return BLOCKS[i];
}

export default function Sparkline({ source, interval=1200, points=28, ariaLabel }){
  const [samples,setSamples] = useState(()=>Array(points).fill(0));
  const timer = useRef();
  useEffect(()=>{
    function tick(){
      setSamples(s=>{
        const val = (()=>{ try { return source(); } catch { return Math.random(); } })();
        const clamped = Math.max(0, Math.min(1, val));
        const next = [...s.slice(1), clamped];
        return next;
      });
      timer.current = setTimeout(tick, interval + (Math.random()*interval*0.25 - interval*0.125));
    }
    tick();
    return ()=>clearTimeout(timer.current);
  },[interval, source]);
  const text = samples.map(ch).join('');
  const latest = samples[samples.length-1];
  return (
    <div className="sparkline" role="img" aria-label={ariaLabel ? ariaLabel+` current ${(latest*100).toFixed(1)}%` : undefined} title={(latest*100).toFixed(2)+'%'}>{text}</div>
  );
}
