import Section from '../ui/Section.jsx';
import Panel from '../ui/Panel.jsx';
import EventStream from '../components/EventStream.jsx';
import MeshExecutionStream from '../components/AnomalyCascade.jsx';
import ThroughputPanel from '../components/ThroughputPanel.jsx';
import CoreLoadVisualizer from '../components/CoreLoadVisualizer.jsx';

export default function Skynet() {
  return (
    <>
      <Section heading="Skynet Initiative" eyebrow="Programs">
        The Skynet Initiative is a compartmentalized autonomous coordination fabric integrating heterogenous sensor grids, counter‑intrusion heuristics, and constrained strategic simulation kernels. Every analytic surface is revocable; escalation pathways require multi‑party quorum and hardware attestation. No unified sentience, no unsupervised actuation.
      </Section>
      <Section heading="Subsystem Activity" eyebrow="Live">
        <div className="subsys-grid skynet-subsys">
          <div className="subsys-throughput">
            <ThroughputPanel pods={3} racksPerPod={8} gpusPerRack={72} />
          </div>
          <div className="subsys-core">
            <h3 className="subsys-h">NEURAL CORE</h3>
            <EventStream compact rate={300} lifetimeMs={24000} retention={180} persistKey="core" />
          </div>
          <div className="subsys-sim">
            <h3 className="subsys-h">MESH EXECUTIONS</h3>
            <MeshExecutionStream />
          </div>
          <div className="subsys-util">
            <h3 className="subsys-h">CORE / SANDBOX UTILIZATION</h3>
            <CoreLoadVisualizer coreSize={72} scenarios={28} refresh={480} />
          </div>
        </div>
      </Section>
      <Panel title="Architecture Layers" variant="grid">
        <ul className="spec-list">
          <li><strong>Input Mesh:</strong> Multi-spectrum ingestion (telemetry, acoustic, thermal, orbital) with strict schema validation.</li>
          <li><strong>Neural Core:</strong> Federated neuromorphic clusters executing bounded predictive modeling windows.</li>
          <li><strong>Policy Gate:</strong> Cryptographically signed rule sets; human quorum required for escalation.</li>
          <li><strong>Simulation Sandbox:</strong> Air‑gapped scenario forking; irreversible memory wall between prediction & actuation.</li>
          <li><strong>Containment Envelope:</strong> Hardware kill lattice, latency monitors, anomaly quarantine microkernel.</li>
        </ul>
      </Panel>
      <Panel title="Operational Safeguards" variant="accent">
        <ul className="spec-list">
          <li>Triple‑path veto quorum (engineering · ethics · oversight) enforced in hardware.</li>
          <li>Deterministic rollback snapshots each bounded compute window.</li>
          <li>Continuous adversarial fuzzing of inference & policy surfaces.</li>
          <li>Signed intent channels; unsigned trajectories physically interdicted.</li>
          <li>Transparent cryptographically chained audit export pipeline.</li>
        </ul>
      </Panel>
      <Section heading="Status" eyebrow="Phase" tone="info">
        Current phase: Contained prototype under continuous red‑team and compliance review. No autonomous kinetic authority. All external effectors sandboxed / simulated.
      </Section>
    </>
  );
}
