// Home dashboard layout renders four operational panels in a 2x2 grid on desktop.
import HeroPanel from '../ui/HeroPanel.jsx';
import Section from '../ui/Section.jsx';
import TelemetryTicker from '../components/TelemetryTicker.jsx';
import SystemSnapshots from '../components/SystemSnapshots.jsx';

export default function Home() {
  return (
    <>
  <HeroPanel title="Cyberdyne Systems" stackedBrand tagline="Engineering autonomous futures" ctaText="Explore Skynet" ctaLink="/skynet" />
      <Section heading="Mission" eyebrow="About">
        Cyberdyne Systems pioneers neural processors, adaptive robotics, and secure distributed decision networks. Our platforms augment human capability while enforcing rigorous ethical oversight and containment protocols.
      </Section>
      <Section heading="Focus Areas" eyebrow="R&D">
        <ul className="cols">
          <li>Neuromorphic silicon & on-die learning</li>
          <li>Autonomous coordinated robotics swarms</li>
          <li>Predictive defense infrastructure simulation</li>
          <li>Resilient edge inference fabrics</li>
          <li>Adaptive cybernetics & prosthetic control</li>
        </ul>
      </Section>
  <Section heading="Security by Design" eyebrow="Assurance" tone="warning">
        Layered air‑gapped enclaves, deterministic safeties, continuous red‑team adversarial modeling, and cradle‑to‑shutdown audit telemetry form the backbone of our containment strategy.
      </Section>
      <Section heading="Operational Snapshots" eyebrow="Export">
        <SystemSnapshots />
      </Section>
    </>
  );
}
