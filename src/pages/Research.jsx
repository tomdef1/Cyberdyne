import Section from '../ui/Section.jsx';
import Panel from '../ui/Panel.jsx';

export default function Research() {
  return (
    <>
      <Section heading="Research Divisions" eyebrow="Labs">
        Our interdisciplinary labs accelerate breakthrough autonomy under rigorous containment and ethical governance.
      </Section>
      <Panel title="Divisions" variant="grid">
        <ul className="spec-list">
          <li><strong>Neural Hardware:</strong> Adaptive synapse arrays, low‑latency spike fabrics.</li>
          <li><strong>Robotics:</strong> Modular actuators, self‑diagnosing servomotor clusters.</li>
          <li><strong>Cybernetics:</strong> Bidirectional neural interface protocols.</li>
          <li><strong>Systems Resilience:</strong> Fault‑predictive orchestration, enclave hardening.</li>
          <li><strong>Simulation:</strong> Probabilistic strategic scenario engines.</li>
        </ul>
      </Panel>
      <Panel title="Publication Themes" variant="accent">
        <ul className="spec-list">
          <li>Low‑power on‑device lifelong learning.</li>
          <li>Formal verification of adaptive control loops.</li>
          <li>Secure federated inference at tactical edge.</li>
          <li>Explainable autonomy under adversarial pressure.</li>
          <li>Biomechatronic signal stability.</li>
        </ul>
      </Panel>
    </>
  );
}
