import Section from '../ui/Section.jsx';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <Section heading="404" eyebrow="Error" tone="warning">
      <p>Route not found. Return to <Link to="/">home</Link>.</p>
    </Section>
  );
}
