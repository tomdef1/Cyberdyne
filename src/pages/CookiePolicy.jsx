import PolicyLayout from '../ui/PolicyLayout.jsx';

export default function CookiePolicy(){
  return (
    <PolicyLayout title="Cookie & Tracking Policy" updated="2025-08-30" disclaimer="Adapt inventory to actual cookies deployed.">
      <h2>Overview</h2>
      <p>This policy explains how we use cookies, local storage, and similar technologies.</p>
      <h2>Categories</h2>
      <ul>
        <li>Strictly Necessary (session auth, load balancing)</li>
        <li>Security (CSRF token, anomaly markers)</li>
        <li>Performance & Analytics (aggregated latency, feature usage)</li>
        <li>Preferences (UI layout, theme choices)</li>
        <li>Optional / Marketing (none by default; requires consent)</li>
      </ul>
      <h2>Controls</h2>
      <p>Browser settings, in-product cookie panel (planned), and opt-out headers (Do Not Track honored for non-essential tracking).</p>
      <h2>Retention</h2>
      <p>Session cookies expire on logout or inactivity; analytics tokens rotate within 24h; preference cookies up to 12 months.</p>
      <h2>Third Parties</h2>
      <p>We minimize third-party scripts; if added, each will be disclosed with purpose and data scope.</p>
      <h2>Updates</h2>
      <p>Substantive changes announced via banner.</p>
    </PolicyLayout>
  );
}
