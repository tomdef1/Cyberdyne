import { useState, useId, useRef, useEffect } from 'react';

export default function Tabs({ tabs, initial, persistKey }) {
  const keys = Object.keys(tabs);
  const [active, setActive] = useState(()=>{
    if(persistKey){
      try{ const saved = localStorage.getItem('tabs:'+persistKey); if(saved && tabs[saved]) return saved; }catch{}
    }
    return (initial && tabs[initial])? initial : keys[0];
  });
  const listRef = useRef(null);
  const panelId = useId();
  const baseId = useId();

  useEffect(()=>{
    // Ensure focus ring stays on active when using arrows
    if(listRef.current){
      const btn = listRef.current.querySelector('[data-tab="'+active+'"]');
      if(btn) btn.focus();
    }
  },[active]);

  function onKey(e){
    if(!['ArrowRight','ArrowLeft','Home','End'].includes(e.key)) return;
    e.preventDefault();
    const idx = keys.indexOf(active);
    if(e.key==='ArrowRight') setActive(keys[(idx+1)%keys.length]);
    else if(e.key==='ArrowLeft') setActive(keys[(idx-1+keys.length)%keys.length]);
    else if(e.key==='Home') setActive(keys[0]);
    else if(e.key==='End') setActive(keys[keys.length-1]);
  }

  useEffect(()=>{
    if(persistKey){
      try{ localStorage.setItem('tabs:'+persistKey, active); }catch{}
    }
  },[active,persistKey]);

  return (
    <div className="tabs">
      <div className="tab-list" role="tablist" aria-orientation="horizontal" ref={listRef} onKeyDown={onKey}>
        {keys.map(k => (
          <button
            key={k}
            id={`${baseId}-${k}`}
            data-tab={k}
            role="tab"
            aria-selected={active===k}
            aria-controls={`${panelId}-${k}`}
            tabIndex={active===k?0:-1}
            className={active===k?'on':''}
            onClick={()=>setActive(k)}
          >{k}</button>
        ))}
      </div>
      {keys.map(k=> active===k && (
        <div key={k} id={`${panelId}-${k}`} role="tabpanel" aria-labelledby={`${baseId}-${k}`} className="tab-panel">
          {tabs[k]}
        </div>
      ))}
    </div>
  );
}
