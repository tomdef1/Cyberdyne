import PolicyLayout from '../ui/PolicyLayout.jsx';

export default function CodeOfConduct(){
  return (
    <PolicyLayout title="Community Code of Conduct" updated="2025-08-30" disclaimer="Applies to forums, events, and collaborative spaces.">
      <h2>Expectations</h2>
      <ul>
        <li>Respectful, professional interactions</li>
        <li>Use inclusive language; avoid derogatory remarks</li>
        <li>Assume good intent; escalate issues privately</li>
      </ul>
      <h2>Unacceptable Behavior</h2>
      <ul>
        <li>Harassment, threats, stalking</li>
        <li>Discriminatory jokes or slurs</li>
        <li>Sharing others’ private information (doxxing)</li>
      </ul>
      <h2>Reporting</h2>
      <p>Conduct@cyberdyne.example – include context, participants, timestamps.</p>
      <h2>Enforcement</h2>
      <p>Actions: warning → temporary ban → permanent removal. Severe misconduct may result in immediate expulsion.</p>
    </PolicyLayout>
  );
}
