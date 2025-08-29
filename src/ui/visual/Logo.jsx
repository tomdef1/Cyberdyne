export default function Logo({ height = 40 }) {
  const png = '/images/dolce.png';
  return <img src={png} height={height} alt="Cyberdyne Systems" className="logo-img" decoding="async" />; // width auto to preserve aspect
}
