import { render, screen } from '@testing-library/react';
import RiskPanel from '../RiskPanel.jsx';
import TransparencyFeed from '../TransparencyFeed.jsx';
import { describe, it, expect } from 'vitest';

describe('RiskPanel & TransparencyFeed', () => {
  it('renders risk indicators heading', () => {
    render(<RiskPanel />);
    expect(screen.getByRole('group', { name: /risk indicators/i })).toBeInTheDocument();
  });
  it('renders transparency feed log', () => {
    render(<TransparencyFeed rate={5} max={5} />);
    expect(screen.getByRole('log', { name: /export log feed/i })).toBeInTheDocument();
  });
});
