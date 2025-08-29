import Section from '../ui/Section.jsx';
import Panel from '../ui/Panel.jsx';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Modal from '../components/Modal.jsx';

const roles = [
  { title: 'Senior Neuromorphic Architect', tags: ['hardware', 'ml'], blurb: 'Design scalable spike‑based learning substrates.' },
  { title: 'Robotics Safety Engineer', tags: ['robotics', 'safety'], blurb: 'Embed deterministic safeguards in adaptive motion stacks.' },
  { title: 'Secure Systems Engineer', tags: ['systems', 'security'], blurb: 'Fortify air‑gapped enclaves & telemetry attestations.' },
  { title: 'Simulation Scientist', tags: ['modeling', 'ai'], blurb: 'Construct probabilistic scenario engines.' }
];

export default function Careers() {
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [roleTitle, setRoleTitle] = useState('');
  function handleApply(title){
    setRoleTitle(title);
    setOpen(true);
  }
  return (
    <>
      <Section heading="Careers" eyebrow="Join">
        Help architect contained, interpretable autonomous systems. We value clarity, resilience thinking, and principled constraints.
      </Section>
      <div className="cards">
        {roles.map(r => (
          <div key={r.title} className="card" role="group" aria-label={r.title}>
            <h3>{r.title}</h3>
            <p>{r.blurb}</p>
            <div className="tags">{r.tags.map(t => <span key={t}>{t}</span>)}</div>
            <button className="apply" onClick={()=>handleApply(r.title)} aria-haspopup="dialog" aria-controls="apply-modal" aria-label={`Apply for ${r.title}`}>Apply</button>
          </div>
        ))}
      </div>
      <Panel title="Values" variant="accent">
        <ul className="spec-list">
          <li>Transparent risk articulation.</li>
          <li>Defense‑in‑depth mindset.</li>
          <li>Cross‑disciplinary empathy.</li>
          <li>Operational humility.</li>
        </ul>
      </Panel>
      <Modal open={open} onClose={()=>setOpen(false)} title="Application Guidance">
        <p><strong>{roleTitle}</strong></p>
        <p>For security‑sensitive roles, direct submissions are not accepted via this site.</p>
        <p>Please apply exclusively through the relevant government defence procurement / cleared talent portal. Reference current requisition frameworks and include validated clearance identifiers where applicable.</p>
        <p className="small dim">Unsolicited or unvetted CV data is routinely purged.</p>
      </Modal>
    </>
  );
}
