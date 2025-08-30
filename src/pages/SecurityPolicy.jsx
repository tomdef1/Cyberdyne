import PolicyLayout from '../ui/PolicyLayout.jsx';

export default function SecurityPolicy(){
  return (
    <PolicyLayout title="Security Policy" updated="2025-08-30" disclaimer="High-level overview; excludes sensitive runbooks.">
      <h2>Principles</h2>
      <ul>
        <li>Defense in Depth</li>
        <li>Least Privilege & Zero Standing Access</li>
        <li>Secure by Design & Threat Modeling</li>
        <li>Continuous Monitoring & Telemetry</li>
      </ul>
      <h2>Controls</h2>
      <ul>
        <li>Encryption: TLS 1.3, AES‑256 at rest, key rotation</li>
        <li>Secrets: hardware-backed KMS, just-in-time decryption</li>
        <li>Identity: SSO, MFA mandatory for privileged roles</li>
        <li>Network: segmented VPC, micro-segmentation, WAF, rate limiting</li>
        <li>Logging: tamper-resistant append-only audit ledger</li>
        <li>Vulnerability Management: automated SCA + weekly patch windows</li>
      </ul>
      <h2>Incident Response</h2>
      <p>24x7 on-call rotation, triage SLAs, post-incident reviews with action tracking.</p>
      <h2>Business Continuity</h2>
      <p>Multi-region replication, RPO ≤ 15m targets, periodic failover drills.</p>
      <h2>Third Party Risk</h2>
      <p>Vendors undergo security questionnaire, contractual DPAs, and periodic re-assessment.</p>
      <h2>Responsible Disclosure</h2>
      <p>See <a href="/responsible-disclosure">Responsible Disclosure</a> for vulnerability reporting channel.</p>
    </PolicyLayout>
  );
}
