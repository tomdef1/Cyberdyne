import Section from '../ui/Section.jsx';
import Panel from '../ui/Panel.jsx';
import LatencyHistogram from '../components/LatencyHistogram.jsx';
import InterlockMatrix from '../components/InterlockMatrix.jsx';

export default function Security(){
  return (
    <>
      <Section heading="Security Audits" eyebrow="Compliance">
        Layered assessment: supply chain provenance, enclave hardening, anomaly kill latency validation, exploit simulation and rollback integrity verification.
      </Section>
      <Panel title="Audit Cadence" variant="grid">
        <ul className="spec-list">
          <li>Weekly enclave diff attestation.</li>
          <li>Daily memory wall breach simulation.</li>
          <li>Continuous fuzz injection surface mapping.</li>
          <li>Quarterly hardware interlock timing assay.</li>
          <li>24h anomaly rollback restore drills.</li>
        </ul>
      </Panel>
      <Section heading="Rollback Performance" eyebrow="Metrics" tone="info">
        <LatencyHistogram />
      </Section>
      <Section heading="Interlock Status" eyebrow="Safeties" tone="warning">
        <InterlockMatrix />
      </Section>
    </>
  );
}
