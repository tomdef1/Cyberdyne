export default function HeroPanel({ title, tagline, ctaText, ctaLink, stackedBrand=false }) {
  const renderTitle = () => {
    if(!stackedBrand) return title;
    // Split on space assuming two-word brand
    const parts = title.split(/\s+/);
    if(parts.length < 2) return title;
    const first = parts.slice(0, parts.length-1).join(' ');
    const last = parts[parts.length-1];
    return (
      <span className="hero-brand-stack" aria-label={title}>
        <span className="hero-brand__primary">{first}</span>
        <span className="hero-brand__secondary">{last}</span>
      </span>
    );
  };
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="scanlines" aria-hidden="true" />
      <h1 id="hero-heading">{renderTitle()}</h1>
      <p className="tagline">{tagline}</p>
      {ctaText && <a className="cta" href={ctaLink}>{ctaText}</a>}
    </section>
  );
}
