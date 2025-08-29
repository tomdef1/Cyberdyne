export default function HeroPanel({ title, tagline, ctaText, ctaLink }) {
  return (
    <section className="hero" aria-labelledby="hero-heading">
      <div className="scanlines" aria-hidden="true" />
      <h1 id="hero-heading">{title}</h1>
      <p className="tagline">{tagline}</p>
      {ctaText && <a className="cta" href={ctaLink}>{ctaText}</a>}
    </section>
  );
}
