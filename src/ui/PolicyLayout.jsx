import { useEffect, useRef } from 'react';

export default function PolicyLayout({ title, updated, children, disclaimer }) {
  const tocRef = useRef(null);
  useEffect(()=>{
    const headings = Array.from(document.querySelectorAll('.policy-content h2'));
    if(!tocRef.current) return;
    tocRef.current.innerHTML = '';
    headings.forEach(h=>{
      const id = h.id || h.textContent.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
      h.id = id;
      const li=document.createElement('li');
      const a=document.createElement('a');
      a.href = '#'+id; a.textContent = h.textContent; a.className='policy-toc__link';
      li.appendChild(a); tocRef.current.appendChild(li);
    });
  },[children]);
  return (
    <article className="policy" aria-labelledby="policy-title">
      <header className="policy-head">
        <h1 id="policy-title">{title}</h1>
        {updated && <p className="policy-meta">Last Updated: {updated}</p>}
        {disclaimer && <p className="policy-disclaimer small" role="note">{disclaimer}</p>}
      </header>
      <div className="policy-body">
        <nav className="policy-toc" aria-label="On this page">
          <h2 className="policy-toc__h">Contents</h2>
          <ul ref={tocRef} className="policy-toc__list" />
        </nav>
        <div className="policy-content">
          {children}
        </div>
      </div>
    </article>
  );
}
