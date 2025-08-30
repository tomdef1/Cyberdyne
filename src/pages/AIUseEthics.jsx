import PolicyLayout from '../ui/PolicyLayout.jsx';

export default function AIUseEthics(){
  return (
    <PolicyLayout title="AI & Model Ethics Policy" updated="2025-08-30" disclaimer="Framework evolves with regulation and research.">
      <h2>Guiding Principles</h2>
      <ul>
        <li>Safety & Containment First</li>
        <li>Human Oversight</li>
        <li>Privacy Preservation</li>
        <li>Transparency & Traceability</li>
        <li>Fairness & Bias Mitigation</li>
      </ul>
      <h2>Lifecycle Governance</h2>
      <p>Model design → data sourcing vetting → bias assessment → red-team adversarial evaluation → deployment gating → continuous monitoring & rollback triggers.</p>
      <h2>Dataset Governance</h2>
      <p>Provenance tracking, license compliance, PII minimization, synthetic augmentation with labeling for disclosure.</p>
      <h2>Red Teaming</h2>
      <p>Scenario-based stress tests (prompt injection, data exfiltration, hallucination risk, policy circumvention) prior to major releases.</p>
      <h2>Transparency</h2>
      <p>Critical decisions logged with model version hash, policy rules evaluated, guardrail outcomes.</p>
      <h2>Reporting & Escalation</h2>
      <p>Ethics concerns: ethics@cyberdyne.example; triage SLA 2 business days.</p>
    </PolicyLayout>
  );
}
