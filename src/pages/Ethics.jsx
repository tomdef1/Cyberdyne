import Section from '../ui/Section.jsx';
import Panel from '../ui/Panel.jsx';

export default function Ethics(){
  return (
    <>
      <Section heading="Ethics Oversight" eyebrow="Compliance">
        Multidisciplinary governance board establishing escalation vetoes, audit transparency and bounded autonomy criteria.
      </Section>
      <Panel title="Mechanisms" variant="accent">
        <ul className="spec-list">
          <li>Tri‑chamber veto quorum (engineering / ethics / security).</li>
          <li>Signed intent channels & enforced cooling intervals.</li>
          <li>Model interpretability scoring gates.</li>
          <li>Continuous red‑team adversarial drills.</li>
          <li>Immutable audit ledger export cadence (5m).</li>
        </ul>
      </Panel>
    </>
  );
}
