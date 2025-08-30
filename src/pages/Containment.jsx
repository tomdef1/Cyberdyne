import Section from '../ui/Section.jsx';
import Panel from '../ui/Panel.jsx';
import EventStream from '../components/EventStream.jsx';
import { useState } from 'react';

export default function Containment(){
  const [show,setShow]=useState(false);
  return (
    <>
      <Section heading="Containment Sandbox" eyebrow="Program">
        Multi‑layer isolation environment enforcing deterministic rollback, memory walling and hardware‑interlock kill paths for high‑risk cognitive modules under evaluation.
      </Section>
      <Panel title="Isolation Layers" variant="grid">
        <ul className="spec-list">
          <li><strong>Ingress Gate:</strong> Strict schema & capability attach negotiation.</li>
          <li><strong>Memory Wall:</strong> Unidirectional snapshot replication barrier.</li>
          <li><strong>Determinism Ring:</strong> Timeboxed pseudo‑random schedule seeding.</li>
          <li><strong>Rollback Slices:</strong> Rotating immutable state slabs (90s cadence).</li>
          <li><strong>Kill Mesh:</strong> FPGA enforced power + bus tri‑state lattice.</li>
        </ul>
      </Panel>
      <Section heading="Current Activity" eyebrow="Live">
        <button className="es-btn" aria-pressed={show} onClick={()=>setShow(s=>!s)}>{show?'Hide':'Show'} Stream</button>
        {show && <EventStream compact rate={280} lifetimeMs={25000} retention={140} />}
      </Section>
    </>
  );
}
