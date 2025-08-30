import PolicyLayout from '../ui/PolicyLayout.jsx';
import { Link } from 'react-router-dom';

export default function LegalOverview(){
  return (
    <PolicyLayout title="Legal & Compliance Center" updated="2025-08-30" disclaimer="Summaries only – see individual policies for authoritative language. Not legal advice.">
      <h2>Primary Policies</h2>
      <ul>
        <li><Link to="/terms">Terms of Service</Link></li>
        <li><Link to="/privacy">Privacy Policy</Link></li>
        <li><Link to="/cookies">Cookie Policy</Link></li>
        <li><Link to="/dpa">Data Processing Addendum (DPA)</Link></li>
      </ul>
      <h2>Operational & Use</h2>
      <ul>
        <li><Link to="/acceptable-use">Acceptable Use Policy</Link></li>
        <li><Link to="/code-of-conduct">Code of Conduct</Link></li>
        <li><Link to="/ai-ethics">AI & Model Ethics Policy</Link></li>
        <li><Link to="/export-compliance">Export & Sanctions Compliance</Link></li>
      </ul>
      <h2>Security & Disclosure</h2>
      <ul>
        <li><Link to="/security-policy">Security Policy</Link></li>
        <li><Link to="/responsible-disclosure">Responsible Disclosure</Link></li>
        <li><Link to="/dmca">DMCA Notice</Link></li>
      </ul>
      <h2>Accessibility & Transparency</h2>
      <ul>
        <li><Link to="/accessibility">Accessibility Statement</Link></li>
        <li><Link to="/forward-looking">Forward‑Looking Statements</Link></li>
      </ul>
    </PolicyLayout>
  );
}
