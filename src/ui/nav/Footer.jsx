import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer" role="contentinfo">
      <div className="cols">
        <div>
          <h4>Cyberdyne Systems</h4>
          <p className="small">Advancing contained autonomous capability.</p>
        </div>
        <div>
          <h4>Programs</h4>
          <ul>
            <li><Link to="/skynet">Skynet Initiative</Link></li>
            <li><Link to="/containment">Containment Sandbox</Link></li>
            <li><Link to="/edge-robotics">Edge Robotics</Link></li>
            <li><Link to="/neuromorphic">Neuromorphic Lab</Link></li>
          </ul>
        </div>
        <div>
          <h4>Compliance</h4>
            <ul>
              <li><Link to="/ethics">Ethics Oversight</Link></li>
              <li><Link to="/security">Security Audits</Link></li>
              <li><Link to="/transparency">Transparency Logs</Link></li>
            </ul>
        </div>
      </div>
      <div className="legal">© {new Date().getFullYear()} Cyberdyne Systems.</div>
    </footer>
  );
}
