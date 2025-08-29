import NavBar from './nav/NavBar.jsx';
import Footer from './nav/Footer.jsx';
import { useEffect } from 'react';

export default function SiteShell({ children }) {
  // Body scroll lock when a modal overlay is present
  useEffect(()=>{
    const body=document.body;
    const obs=new MutationObserver(()=>{
      const open = document.querySelector('.modal-overlay');
      if(open){ body.style.overflow='hidden'; } else { body.style.overflow=''; }
    });
    obs.observe(document.body,{subtree:true,childList:true});
    return ()=>{ obs.disconnect(); body.style.overflow=''; };
  },[]);
  return (
  <div className="app-shell">
      <NavBar />
  <main id="main" tabIndex={-1}>{children}</main>
      <Footer />
    </div>
  );
}
