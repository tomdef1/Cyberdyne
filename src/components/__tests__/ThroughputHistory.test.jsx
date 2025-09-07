import { render, screen } from '@testing-library/react';
import ThroughputHistory from '../ThroughputHistory.jsx';
import { describe, it, expect } from 'vitest';

describe('ThroughputHistory', () => {
  it('renders header and legend', () => {
    render(<ThroughputHistory />);
    expect(screen.getByText(/24h FP4 Throughput/i)).toBeTruthy();
    const matches = screen.getAllByText(/FP4/i);
    expect(matches.length).toBeGreaterThanOrEqual(1);
  });
});
