import { NavLink, Link } from 'react-router-dom';
import { useState, useId, useEffect, useRef } from 'react';
import Logo from '../visual/Logo.jsx';

const primary = [
  { to: '/skynet', label: 'Skynet' },
  { to: '/research', label: 'Research' },
  { to: '/executive', label: 'Executive' },
  { to: '/expos', label: 'Expos' },
  { to: '/timeline', label: 'Timeline' },
  { to: '/careers', label: 'Careers' }
];

const programs = [
  { to: '/containment', label: 'Containment' },
  { to: '/edge-robotics', label: 'Edge Robotics' },
  { to: '/neuromorphic', label: 'Neuromorphic' },
  { to: '/ethics', label: 'Ethics' },
  { to: '/security', label: 'Security' },
  { to: '/transparency', label: 'Transparency' }
];

export default function NavBar(){
  const menuId = useId();
  const [open,setOpen] = useState(false);
  const [mobile,setMobile] = useState(false);
  const wrapRef = useRef(null);
  useEffect(()=>{
    function onKey(e){
      if(e.key==='Escape') setOpen(false);
    }
    function onClick(e){
      if(open && wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    window.addEventListener('keydown',onKey);
    window.addEventListener('mousedown',onClick);
    return ()=>{window.removeEventListener('keydown',onKey);window.removeEventListener('mousedown',onClick);};
  },[open]);
  // Lightweight believable aggregated TFLOPS figure (simulated EFLOPS scale -> reported as TFLOPS)
  const [tflops,setTflops] = useState(()=> 2_300_000 + Math.floor(Math.random()*90_000)); // ~2.3M TFLOPS (≈2.3 EFLOPS)
  useEffect(()=>{
    let live = true;
    function step(){
      setTflops(v=>{
        // mean reversion around 2.32M with mild noise
        const target = 2_320_000;
        const delta = (target - v)*0.04 + (Math.random()-0.5)*1500;
        let next = Math.round(v + delta);
        if(next < 2_250_000) next = 2_250_000;
        if(next > 2_390_000) next = 2_390_000;
        return next;
      });
      if(live) setTimeout(step, 3000 + Math.random()*3000);
    }
    const id = setTimeout(step, 2500);
    return ()=>{ live=false; clearTimeout(id); };
  },[]);

  return (
    <header className="nav" role="banner" data-mobile-open={mobile}>
      <a href="#main" className="skip-link">Skip to content</a>
      <div className="brand">
        <Logo />
        <span className="title gritty-logo" aria-label="Cyberdyne Systems">Cyberdyne Systems</span>
        <span className="nav-status" role="status" aria-live="polite">
          <span className="nav-status-dot" aria-hidden="true" />
          <span className="nav-status-text">OK {tflops.toLocaleString()} TFLOPS</span>
        </span>
      </div>
      <button className="mobile-toggle" aria-expanded={mobile} aria-controls="nav-primary" onClick={()=>setMobile(m=>!m)}>{mobile? 'Close' : 'Menu'}</button>
      <nav aria-label="Primary" className="nav-group" ref={wrapRef}>
        <ul id="nav-primary" className="nav-primary" role="menubar">
          <li><NavLink to="/" end className={({isActive})=>isActive?'active':undefined}>Home</NavLink></li>
          {primary.map(l=>(
            <li key={l.to} role="none"><NavLink role="menuitem" to={l.to} className={({isActive})=>isActive?'active':undefined}>{l.label}</NavLink></li>
          ))}
        </ul>
        <div className="nav-secondary">
          <div className="nav-programs" data-open={open}>
            <button
              aria-haspopup="true"
              aria-expanded={open}
              aria-controls={menuId}
              onClick={()=>setOpen(o=>!o)}
              className="es-btn"
            >Programs</button>
            {open && (
              <div id={menuId} role="menu" style={{position:'absolute',top:'100%',right:0,background:'#06090b',border:'1px solid #1d2428',outline:'1px solid #0c1114',outlineOffset:'-4px',padding:'.6rem .7rem',display:'grid',gap:'.35rem',gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))',minWidth:'420px',zIndex:80}}>
                {programs.map(p=> <Link key={p.to} role="menuitem" to={p.to} onClick={()=>setOpen(false)}>{p.label}</Link>)}
              </div>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
