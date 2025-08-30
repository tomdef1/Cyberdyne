import PolicyLayout from '../ui/PolicyLayout.jsx';

export default function ResponsibleDisclosure(){
  return (
    <PolicyLayout title="Responsible Disclosure" updated="2025-08-30" disclaimer="Policy does not authorize unlawful access.">
      <h2>Safe Harbor</h2>
      <p>If you make a good-faith effort to follow this policy we will not pursue legal action related to your research.</p>
      <h2>In-Scope</h2>
      <ul>
        <li>Core application domains & public APIs</li>
        <li>Authentication, authorization, session handling</li>
        <li>Cryptographic implementation flaws</li>
      </ul>
      <h2>Out-of-Scope</h2>
      <ul>
        <li>Denial of service (volumetric)</li>
        <li>Physical attacks</li>
        <li>Social engineering, phishing employees</li>
        <li>Third-party platforms we do not control</li>
      </ul>
      <h2>Guidelines</h2>
      <ul>
        <li>Do not access or exfiltrate unrelated user data.</li>
        <li>Avoid privacy violations and service disruption.</li>
        <li>Provide detailed steps, impact, and remediation suggestions.</li>
      </ul>
      <h2>Submission</h2>
      <p>Email security@cyberdyne.example with summary, affected endpoints, PoC, logs, and suggested CVSS base metrics.</p>
      <h2>Recognition</h2>
      <p>We may acknowledge valid reports publicly (opt-in) and provide swag or non-monetary thanks; no guaranteed bounty.</p>
    </PolicyLayout>
  );
}
