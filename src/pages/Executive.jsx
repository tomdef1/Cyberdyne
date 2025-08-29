import Section from '../ui/Section.jsx';
import Panel from '../ui/Panel.jsx';
import Tabs from '../components/Tabs.jsx';

/* Executive page rewrite: shift from lore dump to concise corporate positioning, governance & capability stack. */

export default function Executive(){
  return (
    <>
      <Section heading="Executive Overview" eyebrow="Corporate">
        Cyberdyne Systems develops high‑reliability autonomous decision substrates, adaptive robotics platforms, and secure defense compute fabrics. Executive mandate: accelerate survivable, auditable autonomy while enforcing containment, provenance integrity, and oversight instrumentation across every deployment surface.
      </Section>
      <Panel title="Identity" variant="grid">
        <ul className="spec-list">
          <li><strong>Incorporated:</strong> United States (Delaware) – operating R&D presence across North America & select allied innovation corridors.</li>
          <li><strong>Domains:</strong> Edge inference silicon enablement, resilient autonomy middleware, multi‑domain command lattice analytics, safety interlock telemetry.</li>
          <li><strong>Tagline:</strong> "We Are the Future" – internally framed as uninterrupted human‑aligned control loops.</li>
          <li><strong>Assurance Pillars:</strong> Containment • Transparency • Deterministic Fallback • Live Provenance.</li>
        </ul>
      </Panel>
      <Tabs
        persistKey="executive"
        tabs={{
          'Strategy': (
            <ul className='spec-list'>
              <li><strong>Dual‑Use Balance:</strong> Leverage defense rigor to uplift civil autonomy safety without exporting escalation logic.</li>
              <li><strong>Telemetry First:</strong> Instrument before scale; no opaque model surface ships without log schema + retention policy.</li>
              <li><strong>Modular Containment:</strong> Layered interlocks (software trip, behavioral guard rails, enclave resource governors).</li>
              <li><strong>Ethical Gate:</strong> Red‑team simulation & adversarial drift scoring required pre field expansion.</li>
            </ul>
          ),
          'Capability Stack': (
            <ul className='spec-list'>
              <li><strong>Skynet Fabric (Internal Codename):</strong> Distributed command & sensor fusion lattice (governed mode only).</li>
              <li><strong>Adaptive Neural Microcores:</strong> On‑die learning modules with bounded update envelopes + rollback ledger.</li>
              <li><strong>Interlock Matrix:</strong> Parallel safety channel evaluating proposed actuator graphs vs policy constraints.</li>
              <li><strong>Snapshot Bus:</strong> Unified low‑cost state export for audit, signature anchored (SHA‑256 with FNV fallback).</li>
              <li><strong>Throughput Orchestrator:</strong> Mean‑reverting load modulator keeping utilization inside validated thermal / reliability bands.</li>
            </ul>
          ),
          'Governance': (
            <ul className='spec-list'>
              <li><strong>Oversight Loop:</strong> Ethics review → adversarial modeling → controlled deployment → continuous anomaly scoring.</li>
              <li><strong>Data Provenance:</strong> Chain‑of‑custody hashing on ingested training deltas; divergence alarms on silent drift.</li>
              <li><strong>Operational Snapshots:</strong> Scheduled cryptographic captures enabling post‑incident reconstruction.</li>
              <li><strong>Incident Response:</strong> Tiered kill‑switch (logical quiesce → enclave isolate → hardware power gate) with forensics capture.</li>
            </ul>
          ),
          'Leadership': (
            <ul className='spec-list'>
              <li><strong>Chief Systems Architect:</strong> Guides containment & audit primitives; owns integrity roadmap.</li>
              <li><strong>VP Robotics Platforms:</strong> Integration of autonomy stack into edge actuation & mobility units.</li>
              <li><strong>Director Safety Engineering:</strong> Maintains interlock rule corpus & red‑team adversarial harness.</li>
              <li><strong>Head Ethics & Assurance:</strong> Chairs pre‑deployment review board; manages drift / bias watch metrics.</li>
              <li><strong>CISO:</strong> Zero‑trust enclave segmentation, supply chain attestation, memory safety initiatives.</li>
            </ul>
          ),
          'Engagement 2025': (
            <p className='small'>See upcoming defence & aerospace presence under <strong>Expos</strong> for prioritized intelligence & partnership targets (autonomy integration, secure ISR fusion, simulation training ecosystems).</p>
          )
        }}
      />
    </>
  );
}
