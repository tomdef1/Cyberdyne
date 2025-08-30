import Section from '../ui/Section.jsx';
import Panel from '../ui/Panel.jsx';
import EventStream from '../components/EventStream.jsx';
import { useState } from 'react';

export default function EdgeRobotics(){
  const [show,setShow]=useState(false);
  return (
    <>
      <Section heading="Edge Robotics" eyebrow="Program">
        Coordinated autonomous actuation under degraded comms using predictive local policy caches and self‑diagnosing servo clusters.
      </Section>
      <Panel title="Stack" variant="grid">
        <ul className="spec-list">
          <li><strong>Mesh Control:</strong> Latency tolerant consensus pathing.</li>
          <li><strong>Health Core:</strong> Real‑time actuator degradation scoring.</li>
          <li><strong>Failsafe Loop:</strong> Deterministic freeze + safe pose cascade.</li>
          <li><strong>Edge Planner:</strong> On‑device rapid occupancy diffusion.</li>
          <li><strong>Recovery Agent:</strong> Opportunistic link reconstitution.</li>
        </ul>
      </Panel>
      <Section heading="Fleet Telemetry" eyebrow="Live">
        <button className="es-btn" aria-pressed={show} onClick={()=>setShow(s=>!s)}>{show?'Hide':'Show'} Stream</button>
        {show && <EventStream compact rate={320} lifetimeMs={22000} retention={150} />}
      </Section>
    </>
  );
}
