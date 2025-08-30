import PolicyLayout from '../ui/PolicyLayout.jsx';

export default function ForwardLooking(){
  return (
    <PolicyLayout title="Forward-Looking Statements" updated="2025-08-30" disclaimer="Disclaims obligation to update except as required by law.">
      <h2>Nature of Statements</h2>
      <p>Certain statements regarding roadmap, expected performance, safety advancements, and risk mitigation are forward‑looking and involve risks and uncertainties.</p>
      <h2>Risk Factors</h2>
      <ul>
        <li>Regulatory shifts in AI governance</li>
        <li>Security incidents or model failures</li>
        <li>Supply chain or infrastructure constraints</li>
        <li>Third-party dependency performance</li>
      </ul>
      <h2>No Duty to Update</h2>
      <p>Actual results may differ materially; we assume no obligation to update forward‑looking statements.</p>
    </PolicyLayout>
  );
}
