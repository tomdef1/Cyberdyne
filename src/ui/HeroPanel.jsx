import { useEffect, useRef } from 'react';

export default function HeroPanel({ title, tagline, ctaText, ctaLink, stackedBrand=false }) {
  const stackRef = useRef(null);
  const renderTitle = () => {
    if(!stackedBrand) return title;
    // Split on space assuming two-word brand
    const parts = title.split(/\s+/);
    if(parts.length < 2) return title;
    const first = parts.slice(0, parts.length-1).join(' ');
    const last = parts[parts.length-1];
    // Split primary word into characters for sequential pulse
    const chars = first.split('').map((ch,i)=>(<span key={i} className="hero-char" style={{'--char-index':i}}>{ch}</span>));
    return (
      <span ref={stackRef} className="hero-brand-stack" aria-label={title}>
        <span className="hero-brand__primary" data-char-count={chars.length}>{chars}</span>
        <span className="hero-brand__secondary">{last}</span>
      </span>
    );
  };
  // Sequential pulse loop
  useEffect(()=>{
    if(!stackedBrand) return; // only when stacked brand used
    let cancelled=false;
  const cycleMs = 45000; // full repeat interval
    function runCycle(){
      if(cancelled) return;
      const root = stackRef.current; if(!root) return;
      const chars = root.querySelectorAll('.hero-char');
      const secondary = root.querySelector('.hero-brand__secondary');
  const pulseLen = 800; // ms pulse duration (kept)
  const gap = 150; // small gap after a pulse before next letter starts
  const perDelay = pulseLen + gap; // ensures previous finishes before next begins
      chars.forEach((el,i)=>{
        setTimeout(()=>{
          if(cancelled) return;
          el.classList.add('is-pulse');
          setTimeout(()=> el.classList.remove('is-pulse'), pulseLen);
        }, i*perDelay);
      });
  const afterLetters = chars.length*perDelay + 400; // extra pause before secondary word pulse
      setTimeout(()=>{
        if(cancelled||!secondary) return;
        secondary.classList.add('is-pulse');
        setTimeout(()=> secondary.classList.remove('is-pulse'), pulseLen);
      }, afterLetters);
      const totalThisRun = afterLetters + pulseLen;
  setTimeout(runCycle, Math.max(2000, cycleMs - totalThisRun));
    }
    runCycle();
    return ()=>{ cancelled=true; };
  },[stackedBrand]);
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="scanlines" aria-hidden="true" />
      <h1 id="hero-heading">{renderTitle()}</h1>
      <p className="tagline">{tagline}</p>
      {ctaText && <a className="cta" href={ctaLink}>{ctaText}</a>}
    </section>
  );
}
