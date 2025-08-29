import Section from '../ui/Section.jsx';
import Panel from '../ui/Panel.jsx';
import TransparencyFeed from '../components/TransparencyFeed.jsx';

export default function Transparency(){
  return (
    <>
      <Section heading="Transparency Logs" eyebrow="Compliance">
        Aggregated signed operational events exported for third‑party review, anomaly escalation traces, veto invocation metadata and model snapshot fingerprints.
      </Section>
      <Panel title="Export Surface" variant="accent">
        <ul className="spec-list">
          <li>Hash chain anchored log segments.</li>
          <li>Redacted sensitive enclave pointers.</li>
          <li>Deterministic snapshot indices.</li>
          <li>Escalation veto decision bundles.</li>
          <li>Latency distribution histograms.</li>
        </ul>
      </Panel>
      <Section heading="Live Export Activity" eyebrow="Stream" tone="info">
        <TransparencyFeed />
      </Section>
    </>
  );
}
