import { render, screen } from '@testing-library/react';
import TelemetryTicker from '../TelemetryTicker.jsx';
import { describe, it, expect } from 'vitest';

describe('TelemetryTicker', () => {
  it('renders telemetry rows', () => {
    render(<TelemetryTicker />);
    expect(screen.getByRole('log', { name: /live telemetry/i })).toBeInTheDocument();
  });
});
