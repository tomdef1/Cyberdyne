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
            <li><Link to="/skynet-base-layer">Base Layer Image</Link></li>
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
        <div>
          <h4>Legal</h4>
          <ul>
            <li><Link to="/legal">Overview</Link></li>
            <li><Link to="/terms">Terms</Link></li>
            <li><Link to="/privacy">Privacy</Link></li>
            <li><Link to="/cookies">Cookies</Link></li>
            <li><Link to="/acceptable-use">Acceptable Use</Link></li>
            <li><Link to="/security-policy">Security Policy</Link></li>
            <li><Link to="/responsible-disclosure">Disclosure</Link></li>
            <li><Link to="/dpa">DPA</Link></li>
            <li><Link to="/accessibility">Accessibility</Link></li>
            <li><Link to="/export-compliance">Export</Link></li>
            <li><Link to="/ai-ethics">AI Ethics</Link></li>
            <li><Link to="/dmca">DMCA</Link></li>
            <li><Link to="/code-of-conduct">Code of Conduct</Link></li>
            <li><Link to="/forward-looking">Forward Looking</Link></li>
          </ul>
        </div>
      </div>
      <div className="legal">© {new Date().getFullYear()} Cyberdyne Systems.</div>
    </footer>
  );
}
