import Logo from '../visual/Logo.jsx';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef, useCallback } from 'react';

// Grouped desktop nav structure (max 4 top-level: Skynet + 3 dropdowns)
const GROUPS = [
  {
    id: 'tech',
    label: 'Technology',
    items: [
      { to: '/research', label: 'Research' },
      { to: '/edge-robotics', label: 'Edge Robotics' },
      { to: '/neuromorphic', label: 'Neuromorphic' }
    ]
  },
  {
    id: 'governance',
    label: 'Governance',
    items: [
      { to: '/executive', label: 'Executive' },
      { to: '/containment', label: 'Containment' },
      { to: '/security', label: 'Security' },
      { to: '/transparency', label: 'Transparency' },
      { to: '/ethics', label: 'Ethics' }
    ]
  },
  {
    id: 'company',
    label: 'Company',
    items: [
      { to: '/expos', label: 'Expos' },
      { to: '/timeline', label: 'Timeline' },
      { to: '/careers', label: 'Careers' }
    ]
  }
];

// Flat list for mobile drawer reuse
const MOBILE_LINKS = [
  { to: '/skynet', label: 'Skynet' },
  ...GROUPS.flatMap(g=> g.items)
];

export default function NavBar(){
  const [drawer,setDrawer] = useState(false);
  const [scrolled,setScrolled] = useState(false);
  const drawerRef = useRef(null);
  const toggleBtnRef = useRef(null);
  const location = useLocation();
  const [openMenu,setOpenMenu] = useState(null); // which dropdown is open
  const menuRefs = useRef({});

  // Body scroll lock when drawer open
  useEffect(()=>{ document.body.style.overflow = drawer? 'hidden' : ''; return ()=>{ document.body.style.overflow=''; }; },[drawer]);

  // Scroll compression
  useEffect(()=>{
    const onScroll = () => setScrolled(window.scrollY>48);
    window.addEventListener('scroll', onScroll, { passive:true });
    onScroll();
    return ()=> window.removeEventListener('scroll', onScroll);
  },[]);

  // TFLOPS ticker (kept lightweight)
  const [tflops,setTflops] = useState(()=> 2_300_000 + Math.floor(Math.random()*90_000));
  const formatTflops = useCallback((v)=>{
    if(v >= 1_000_000) {
      const m = (v/1_000_000).toFixed(2);
      // trim trailing zeros
      return m.replace(/0+$/,'').replace(/\.$/,'') + 'M';
    }
    if(v >= 1_000) return (v/1_000).toFixed(1) + 'K';
    return String(v);
  },[]);
  useEffect(()=>{
    let alive=true;
    const loop=()=>{
      setTflops(v=>{
        const target=2_320_000; const delta=(target-v)*0.035 + (Math.random()-0.5)*1200; let n=Math.round(v+delta);
        if(n<2_250_000) n=2_250_000; if(n>2_390_000) n=2_390_000; return n; });
      if(alive) setTimeout(loop, 2600+Math.random()*2500);
    };
    const id=setTimeout(loop,1800); return ()=>{alive=false; clearTimeout(id);};
  },[]);

  // Focus trap in drawer
  const onKeyTrap = useCallback((e)=>{
    if(!drawer) return;
    if(e.key==='Escape'){ setDrawer(false); toggleBtnRef.current?.focus(); }
    if(e.key==='Tab'){
      const focusables = drawerRef.current?.querySelectorAll('a,button');
      if(!focusables?.length) return;
      const list=Array.from(focusables);
      const first=list[0]; const last=list[list.length-1];
      if(e.shiftKey && document.activeElement===first){ e.preventDefault(); last.focus(); }
      else if(!e.shiftKey && document.activeElement===last){ e.preventDefault(); first.focus(); }
    }
  },[drawer]);
  useEffect(()=>{ if(drawer) document.addEventListener('keydown', onKeyTrap); else document.removeEventListener('keydown', onKeyTrap); return ()=> document.removeEventListener('keydown', onKeyTrap); },[drawer,onKeyTrap]);

  // Close on outside click
  useEffect(()=>{
    function handler(e){ if(drawer && drawerRef.current && !drawerRef.current.contains(e.target) && !toggleBtnRef.current.contains(e.target)){ setDrawer(false); } }
    document.addEventListener('mousedown', handler);
    return ()=> document.removeEventListener('mousedown', handler);
  },[drawer]);

  // Close dropdowns on outside click / escape
  useEffect(()=>{
    function outside(e){
      if(!openMenu) return;
      const el = menuRefs.current[openMenu];
      if(el && !el.contains(e.target)) setOpenMenu(null);
    }
    function onKey(e){ if(e.key==='Escape') setOpenMenu(null); }
    document.addEventListener('mousedown', outside);
    document.addEventListener('keydown', onKey);
    return ()=>{ document.removeEventListener('mousedown', outside); document.removeEventListener('keydown', onKey); };
  },[openMenu]);

  const isGroupActive = (group)=> group.items.some(i=> i.to === location.pathname);

  return (
    <header className={`site-header${scrolled? ' is-scrolled':''}`} role="banner">
      <a href="#main" className="skip-link">Skip to content</a>
      <Link to="/" className="site-brand" aria-label="Return to home">
        <Logo />
        <span className="site-brand__name" aria-label="Cyberdyne Systems">
          <span className="site-brand__word site-brand__word--primary">Cyberdyne</span>
          <span className="site-brand__word site-brand__word--secondary">Systems</span>
        </span>
      </Link>
  <nav className="site-nav" aria-label="Primary">
        <ul className="site-nav__links" role="menubar">
          {/* Primary Skynet link */}
          <li role="none" className="site-nav__link-item">
            <NavLink to="/skynet" role="menuitem" className={({isActive})=> 'site-nav__link'+(isActive?' is-active':'')+(!isActive && location.pathname.startsWith('/skynet')?' is-active':'')}>Skynet</NavLink>
          </li>
          {GROUPS.map(g=> (
            <li key={g.id} role="none" className={'site-nav__link-item site-nav__item--has-menu'+(openMenu===g.id?' is-open':'')} ref={el=> menuRefs.current[g.id]=el}>
              <button className={'site-nav__link site-nav__menu-btn'+(isGroupActive(g)?' is-active':'')} aria-haspopup="true" aria-expanded={openMenu===g.id} aria-controls={`menu-${g.id}`} onClick={()=> setOpenMenu(m=> m===g.id? null : g.id)}>{g.label} ▾</button>
              <ul id={`menu-${g.id}`} role="menu" className="site-nav__submenu" hidden={openMenu!==g.id}>
                {g.items.map(it=> (
                  <li key={it.to} role="none"><NavLink to={it.to} role="menuitem" className={({isActive})=> 'site-nav__submenu-link'+(isActive?' is-active':'')} onClick={()=> setOpenMenu(null)}>{it.label}</NavLink></li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </nav>
      <button ref={toggleBtnRef} className="site-nav__toggle" aria-expanded={drawer} aria-controls="mobile-drawer" aria-label={drawer? 'Close navigation menu':'Open navigation menu'} onClick={()=>setDrawer(d=>!d)}>{drawer?'Close':'Menu'}</button>
      <div className="site-status" role="status" aria-live="polite" title={tflops.toLocaleString()+ ' TFLOPS'}>
        OK {formatTflops(tflops)} TFLOPS
      </div>
      {/* Overlay */}
      <div className={`site-drawer__overlay${drawer?' is-open':''}`} onClick={()=>setDrawer(false)} aria-hidden={!drawer} />
      {/* Drawer */}
      <aside id="mobile-drawer" ref={drawerRef} className={`site-drawer${drawer?' is-open':''}`} aria-hidden={!drawer} aria-label="Mobile navigation">
        <div className="site-drawer__head">
          <span className="site-drawer__title">Navigation</span>
          <button onClick={()=>setDrawer(false)} className="site-drawer__close" aria-label="Close navigation">✕</button>
        </div>
        <ul className="site-drawer__links" role="menubar">
          {MOBILE_LINKS.map(l=> (
            <li key={l.to} role="none"><NavLink to={l.to} role="menuitem" onClick={()=>setDrawer(false)} className={({isActive})=> 'site-drawer__link'+(isActive?' is-active':'')}>{l.label}</NavLink></li>
          ))}
        </ul>
  <div className="site-drawer__status" title={tflops.toLocaleString()+ ' TFLOPS'}>OK {formatTflops(tflops)} TFLOPS</div>
      </aside>
    </header>
  );
}
