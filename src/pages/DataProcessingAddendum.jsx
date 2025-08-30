import PolicyLayout from '../ui/PolicyLayout.jsx';

export default function DataProcessingAddendum(){
  return (
    <PolicyLayout title="Data Processing Addendum" updated="2025-08-30" disclaimer="Template summary – for binding effect execute a signed DPA.">
      <h2>Definitions</h2>
      <p>“Controller”, “Processor”, “Data Subject”, “Personal Data”, “Processing” follow GDPR Art. 4 definitions. Customer is Controller; Cyberdyne may act as Processor (or Sub-processor) for personal data submitted via the Services.</p>
      <h2>Scope & Roles</h2>
      <p>Cyberdyne Processes Personal Data solely per documented instructions, the Agreement, this DPA, and lawful requests.</p>
      <h2>Security Measures</h2>
      <p>Annex 2 summarizes technical and organizational measures (encryption, access control, logging, resilience, vulnerability management, incident response).</p>
      <h2>Sub-Processors</h2>
      <p>We maintain a public list of authorized Sub-processors with location, purpose, and data categories. Customer may subscribe to change notifications and object to materially different Processing.</p>
      <h2>International Transfers</h2>
      <p>Transfers executed under SCC Module 2 (Controller→Processor) with supplementary encryption and access controls.</p>
      <h2>Data Subject Requests</h2>
      <p>We assist with DSARs (access, correction, deletion, restriction, portability) by providing administrative and technical tooling.</p>
      <h2>Audits</h2>
      <p>We provide SOC / ISO reports or summaries. On-site audits limited to once annually with reasonable notice and confidentiality binding.</p>
      <h2>Incident Notification</h2>
      <p>We will notify without undue delay (target &lt; 48h) after confirmation of a Personal Data breach impacting Customer Data, with details on scope, root cause, mitigation.</p>
      <h2>Return & Deletion</h2>
      <p>Upon termination and written request we either delete or return Customer Personal Data unless retention required by law.</p>
      <h2>Liability</h2>
      <p>Liability and limitations governed by the primary Agreement except where prohibited by applicable Data Protection Law.</p>
    </PolicyLayout>
  );
}
