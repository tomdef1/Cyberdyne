import PolicyLayout from '../ui/PolicyLayout.jsx';

export default function AcceptableUse(){
  return (
    <PolicyLayout title="Acceptable Use Policy" updated="2025-08-30" disclaimer="Illustrative, refine per jurisdiction.">
      <h2>Prohibited Conduct</h2>
      <ul>
        <li>Illegal, infringing, or deceptive activity.</li>
        <li>Malware generation, exploitation tooling without authorization.</li>
        <li>Automated scraping causing service degradation.</li>
        <li>Attempts to bypass rate limits or security controls.</li>
        <li>Generation of disallowed content (eg. personal data exfiltration, targeted harassment).</li>
        <li>High-risk use (medical, life support, autonomous weapons) without written approval.</li>
      </ul>
      <h2>Rate & Resource Limits</h2>
      <p>We may enforce dynamic throttles for stability; sustained violation results in suspension.</p>
      <h2>Enforcement</h2>
      <p>Progressive measures: warning → temporary restriction → suspension → termination. Severe abuse may trigger immediate termination and law enforcement referral.</p>
      <h2>Reporting Abuse</h2>
      <p>Report violations: abuse@cyberdyne.example. Include timestamps, request IDs, and reproducible steps.</p>
    </PolicyLayout>
  );
}
