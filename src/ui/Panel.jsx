export default function Panel({ title, children, variant = 'base' }) {
  return (
    <div className={`panel variant-${variant}`}>      
      <h3>{title}</h3>
      <div className="panel-body">{children}</div>
    </div>
  );
}
