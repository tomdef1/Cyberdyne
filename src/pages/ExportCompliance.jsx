import PolicyLayout from '../ui/PolicyLayout.jsx';

export default function ExportCompliance(){
  return (
    <PolicyLayout title="Export & Sanctions Compliance" updated="2025-08-30" disclaimer="High-level controls; customers remain responsible for own compliance.">
      <h2>Regimes</h2>
      <p>We comply with EAR, OFAC, UK, and EU sanctions regimes. Access from embargoed jurisdictions is blocked.</p>
      <h2>Screening</h2>
      <p>Automated screening of users and customers against consolidated lists at onboarding and periodic intervals.</p>
      <h2>Technology Classification</h2>
      <p>Core software may fall under EAR99 or specified ECCNs; classification matrix available under NDA.</p>
      <h2>Restricted End Uses</h2>
      <p>Prohibited: development of WMDs, military end-use in embargoed countries, mass surveillance contravening human rights.</p>
      <h2>Customer Responsibilities</h2>
      <p>Do not export or provide the Services to sanctioned entities or prohibited destinations. Maintain accurate user location/organization data.</p>
    </PolicyLayout>
  );
}
