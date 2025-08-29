import Section from '../ui/Section.jsx';
import Panel from '../ui/Panel.jsx';

const milestones = [
  { year: '1997', title: 'Foundational Neural Co-processors', detail: 'Prototype neuromorphic co‑processor enabling adaptive inference acceleration.' },
  { year: '2004', title: 'Edge Robotics Mesh', detail: 'Coordinated swarm pathfinding across degraded networks.' },
  { year: '2012', title: 'Secure Federated Learning', detail: 'On‑prem enclave collaboration without raw data egress.' },
  { year: '2023', title: 'Containment Sandboxing v2', detail: 'Deterministic rollback architecture with hardware interlocks.' },
  { year: '2025', title: 'Skynet Prototype Lattice', detail: 'Modular distributed reasoning graph under multi‑layer veto controls.' }
];

export default function Timeline() {
  return (
    <>
      <Section heading="Milestones" eyebrow="History">
        A concise sequence of controlled innovation toward resilient autonomy.
      </Section>
      <div className="timeline">
        {milestones.map(m => (
          <div key={m.year} className="timeline-item">
            <div className="year">{m.year}</div>
            <div className="content">
              <h3>{m.title}</h3>
              <p>{m.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
