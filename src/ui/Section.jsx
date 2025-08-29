export default function Section({ heading, eyebrow, children, tone }) {
  return (
    <section className={`section tone-${tone || 'base'}`}>      
      <header>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h2>{heading}</h2>
      </header>
      <div className="body">{children}</div>
    </section>
  );
}
