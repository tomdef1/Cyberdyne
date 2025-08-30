import PolicyLayout from '../ui/PolicyLayout.jsx';

export default function PrivacyPolicy(){
  return (
    <PolicyLayout title="Privacy Policy" updated="2025-08-30" disclaimer="For transparency only – customize to your actual data flows; not legal advice.">
      <h2>Scope</h2>
      <p>This Privacy Policy describes how we collect, use, disclose, and safeguard Personal Data relating to users of our Services.</p>
      <h2>Data Categories</h2>
      <ul>
        <li>Account: name, email, authentication identifiers.</li>
        <li>Usage & Telemetry: feature events, performance metrics, latency, error logs (pseudonymized).</li>
        <li>Content: inputs you submit (prompts, uploads) and generated outputs (retained per retention settings).</li>
        <li>Device & Network: IP (truncated where required), user agent, approximate region.</li>
        <li>Security Artifacts: access tokens, key fingerprints, anomaly flags, audit trails.</li>
        <li>Billing (if applicable): payment tokens, plan metadata (handled via PCI-compliant processor).</li>
      </ul>
      <h2>Lawful Bases (EEA/UK)</h2>
      <ul>
        <li>Contract performance (core service delivery)</li>
        <li>Legitimate interests (security, analytics, product improvement – balanced with user rights)</li>
        <li>Consent (marketing comms, optional telemetry)</li>
        <li>Legal obligations (tax, compliance, sanctions screening)</li>
      </ul>
      <h2>Processing Purposes</h2>
      <p>Operate and improve the Services, secure infrastructure, detect abuse, provide support, develop new features, comply with law, and conduct aggregated analytics.</p>
      <h2>Retention</h2>
      <p>We retain Personal Data only as long as necessary for purposes collected or as required by law. Optional logs may be truncated or anonymized after a defined window (e.g., 30–90 days).</p>
      <h2>Sharing & Disclosure</h2>
      <ul>
        <li>Service Providers (infrastructure, monitoring, support) under written agreements with confidentiality & data protection clauses.</li>
        <li>Legal & Compliance (court orders, lawful requests)</li>
        <li>Business Transfers (merger, acquisition, insolvency) subject to safeguards</li>
        <li>Security Research (aggregated or anonymized insights)</li>
      </ul>
      <h2>International Transfers</h2>
      <p>Transfers rely on adequacy decisions, Standard Contractual Clauses (SCCs), and supplementary safeguards (encryption in transit & at rest, access minimization).</p>
      <h2>Security Measures</h2>
      <p>Encryption (TLS 1.3, AES-256), least privilege IAM, network segmentation, continuous vulnerability scanning, independent penetration testing, incident response procedures.</p>
      <h2>User Rights</h2>
      <ul>
        <li>Access / Portability</li>
        <li>Rectification</li>
        <li>Erasure (subject to exceptions)</li>
        <li>Restriction & Objection (including profiling limits)</li>
        <li>Withdraw consent (for optional processing)</li>
        <li>Complaint to supervisory authority</li>
      </ul>
      <h2>Children</h2>
      <p>We do not knowingly collect data from children under the minimum legal age. Contact us to request deletion.</p>
      <h2>Automated Decision-Making / AI</h2>
      <p>Certain model outputs may be probabilistic. We do not conduct solely automated decisions producing legal or similarly significant effects without human oversight.</p>
      <h2>Cookies & Tracking</h2>
      <p>See <a href="/cookies">Cookie Policy</a> for granular controls.</p>
      <h2>Changes</h2>
      <p>We will notify material privacy changes through the Service or email (if available) before effective date.</p>
      <h2>Contact</h2>
      <p>privacy@cyberdyne.example</p>
    </PolicyLayout>
  );
}
