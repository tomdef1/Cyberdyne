import Section from '../ui/Section.jsx';
import Panel from '../ui/Panel.jsx';
import EventStream from '../components/EventStream.jsx';

export default function Neuromorphic(){
  return (
    <>
      <Section heading="Neuromorphic Lab" eyebrow="Program">
        Research into adaptive low‑latency spike fabrics, synapse plasticity modulation, and resilient on‑die learning constraints.
      </Section>
      <Panel title="Focus Threads" variant="grid">
        <ul className="spec-list">
          <li><strong>Adaptive Synapses:</strong> Bounded plasticity windows.</li>
          <li><strong>Thermal Throttling:</strong> Feedback tuned spike gating.</li>
          <li><strong>Noise Harnessing:</strong> Entropy shaping for exploration.</li>
          <li><strong>Security Hardening:</strong> Side‑channel attenuation layers.</li>
          <li><strong>Formal Models:</strong> Verifiable convergence envelopes.</li>
        </ul>
      </Panel>
      <Section heading="Lab Events" eyebrow="Live">
        <EventStream compact rate={260} lifetimeMs={26000} retention={160} />
      </Section>
    </>
  );
}
