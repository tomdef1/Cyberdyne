import PolicyLayout from '../ui/PolicyLayout.jsx';
import { Link } from 'react-router-dom';

export default function SkynetBaseLayer(){
  return (
  <PolicyLayout title="Skynet Node Initialization Capsule" updated="2025-08-30" disclaimer="Proprietary signed initialization capsule – distribution restricted. This page is informational; use requires executed license & hardware attestation.">
      <div className="capsule-callout" role="note" aria-label="Capsule Download">
        <strong>Download Capsule:</strong> <a href="/baselayer/SKY_init_capsule_0.12.03384.caps" download>SKY_init_capsule_0.12.03384.caps</a>
        <span className="hash-label">SHA-256:</span>
        <code className="hash">a372cfd2b67217aac25fd859f16f0fb136e02bed5b8c1f13c79adecfad661a39</code>
      </div>
      <h2>Purpose</h2>
      <p>The Skynet Initialization Capsule provisions a minimal, cryptographically confined substrate establishing enclave roots, verified telemetry pipelines, and ephemeral session keys prior to mesh admission. It replaces the earlier “boot image” terminology with a unified, multi-stage capsule (loader + sealed payload + manifest).</p>
      <h2>File Integrity</h2>
      <ul>
        <li>Filename: <code>SKY_init_capsule_0.12.03384.caps</code></li>
        <li>Location: <code>/baselayer/SKY_init_capsule_0.12.03384.caps</code></li>
        <li>SHA-256: <code>a372cfd2b67217aac25fd859f16f0fb136e02bed5b8c1f13c79adecfad661a39</code></li>
        <li>Size: ~2.5 MB (LZMA-compressed, envelope-encrypted multi‑segment payload)</li>
      </ul>
      <h2>Supported Hardware (Minimum)</h2>
      <ul>
        <li>CPU: x86_64 with AVX2 + AES-NI; 8 cores (16 preferred)</li>
        <li>Memory: 32 GB RAM (64 GB recommended for live telemetry)</li>
  <li>Accelerators: 2× PCIe Gen4 GPUs or NPUs with &gt;16 TFLOPS FP16 each</li>
        <li>TPM 2.0 or HSM module for key sealing</li>
        <li>UEFI Secure Boot enabled</li>
        <li>Outbound network: 443/TCP + 7841/TCP (mesh QUIC control) + 7842/UDP (telemetry bursts)</li>
      </ul>
      <h2>Secure Boot & Attestation Flow</h2>
      <ol>
        <li>Stage‑0 loader verifies capsule manifest (ECDSA P‑256 + detached CMS signature).</li>
        <li>Decryption of sealed Stage‑1 payload using envelope key (XChaCha20-Poly1305) unwrapped via TPM sealed blob.</li>
        <li>Minimal kernel/userspace pivot; sealed config volume (LUKS2, Argon2id) mounted read-only.</li>
        <li>TPM quote (PCR 0,2,4,7) & module measurements transmitted to Skynet Attestation Endpoint.</li>
        <li>On validation, X25519 ephemeral keypair + short-lived access token provisioned.</li>
        <li>Forward-secure telemetry & command channels established (ED25519 identity + symmetric ratchet).</li>
      </ol>
      <h2>Installation</h2>
      <ol>
        <li>Download capsule: <a href="/baselayer/SKY_init_capsule_0.12.03384.caps" download>SKY_init_capsule_0.12.03384.caps</a></li>
        <li>Verify hash & signature (request public key bundle if not provisioned).</li>
        <li>Deploy to media: <code>dd if=SKY_init_capsule_0.12.03384.caps of=/dev/nvme0n1 bs=4M status=progress conv=fsync</code></li>
        <li>Boot target; network egress 443/TCP, 7841/TCP, 7842/UDP must be allowed.</li>
        <li>Complete license + cluster registration interactive prompt.</li>
      </ol>
      <h2>Operational Notes</h2>
      <ul>
        <li>Image auto-rotates host telemetry certificates every 24h.</li>
        <li>No package manager – immutable root FS; updates via signed delta bundles.</li>
        <li>Persistent logs exported; local retention capped at 2h.</li>
        <li>Fails closed: any attestation mismatch halts mesh join.</li>
      </ul>
      <h2>Support & Licensing</h2>
      <p>Access beyond evaluation requires an executed Enterprise Skynet Interface Agreement. Contact sales@cyberdyne.example. Report boot issues to support@cyberdyne.example including hardware manifest and attestation log.</p>
      <p>See <Link to="/security-policy">Security Policy</Link> for hardening overview and <Link to="/acceptable-use">Acceptable Use</Link> for operational constraints.</p>
    </PolicyLayout>
  );
}
