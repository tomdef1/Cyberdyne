import PolicyLayout from '../ui/PolicyLayout.jsx';

export default function Accessibility(){
  return (
    <PolicyLayout title="Accessibility Statement" updated="2025-08-30" disclaimer="We strive for WCAG 2.2 AA conformance; ongoing improvements tracked internally.">
      <h2>Commitment</h2>
      <p>Cyberdyne aims to make the Services accessible to the broadest audience regardless of technology or ability.</p>
      <h2>Standards</h2>
      <p>Target conformance: WCAG 2.2 Level AA, EN 301 549 applicable sections.</p>
      <h2>Measures</h2>
      <ul>
        <li>Semantic HTML & ARIA only where necessary</li>
        <li>Keyboard navigability (focus traps, skip links)</li>
        <li>Contrast ratios meeting or exceeding AA</li>
        <li>Reduced motion preference detection</li>
        <li>Continuous automated a11y linting & manual audits</li>
      </ul>
      <h2>Limitations</h2>
      <p>Certain complex visualizations may present alternative text summaries rather than full parity interactions.</p>
      <h2>Feedback</h2>
      <p>Send accessibility feedback: a11y@cyberdyne.example</p>
    </PolicyLayout>
  );
}
