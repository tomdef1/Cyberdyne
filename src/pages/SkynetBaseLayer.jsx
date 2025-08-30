import PolicyLayout from '../ui/PolicyLayout.jsx';
import { Link } from 'react-router-dom';

export default function SkynetBaseLayer(){
  return (
    <PolicyLayout title="Skynet Base Layer Boot Image" updated="2025-08-30" disclaimer="Proprietary binary image – distribution restricted. This page is informational; usage requires executed license & hardware attestation.">
      <h2>Purpose</h2>
      <p>The CDY Boot Image provisions a minimal, hardened substrate ("Base Layer") required to interface on-premise accelerator clusters with the Skynet coordination mesh. It establishes secure enclave roots, attests node integrity, and negotiates ephemeral session keys for telemetry and command channels.</p>
      <h2>File Integrity</h2>
      <ul>
        <li>Filename: <code>CDY_boot_0.12.03384.cdy</code></li>
        <li>Location: <code>/baselayer/CDY_boot_0.12.03384.cdy</code></li>
  <li>SHA-256: <code>a372cfd2b67217aac25fd859f16f0fb136e02bed5b8c1f13c79adecfad661a39</code></li>
        <li>Size: ~42 MB (compressed proprietary container)</li>
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
        <li>Bootloader validates signed Base Layer image (ECDSA P‑256, detached manifest).</li>
        <li>Kernel initializes minimal userspace, mounts sealed config volume (LUKS2, Argon2id KDF).</li>
        <li>TPM quote produced (PCR 0,2,4,7) → sent to Skynet Attestation Endpoint for verification.</li>
        <li>On success, ephemeral session keypair derived (X25519) and short-lived access token issued.</li>
        <li>Telemetry channels established with forward-secure key ratcheting (Double Ratchet variant).</li>
      </ol>
      <h2>Installation</h2>
      <ol>
        <li>Download the image: <a href="/baselayer/CDY_boot_0.12.03384.cdy" download>CDY_boot_0.12.03384.cdy</a></li>
        <li>Verify SHA-256 hash and signature (contact support for public key bundle).</li>
        <li>Write to bootable medium (e.g., <code>dd if=CDY_boot_0.12.03384.cdy of=/dev/nvme0n1 bs=8M status=progress</code>).</li>
        <li>Reboot target node; ensure network egress ports are permitted.</li>
        <li>Complete license & cluster registration handshake via console prompt.</li>
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
