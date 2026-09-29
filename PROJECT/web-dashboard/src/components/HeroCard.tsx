'use client';

import React from 'react';
import { Terminal, ListTree } from 'lucide-react';

interface HeroCardProps {
  onOpenMonitor: () => void;
  onViewProcesses: () => void;
}

export const HeroCard: React.FC<HeroCardProps> = ({ onOpenMonitor, onViewProcesses }) => {
  return (
    <div className="sys-card" style={{ padding: '20px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          {/* Badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
            <span className="badge badge-blue">
              OSSP
            </span>
            <span className="badge badge-emerald">
              /proc telemetry
            </span>
          </div>

          {/* Heading */}
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
            Linux System Information & Resource Monitoring Tool
          </h2>

          {/* Description */}
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', marginTop: '4px' }}>
            Native systems programming monitor parsing Linux <code className="mono" style={{ color: 'var(--accent-cyan)' }}>/proc</code> and POSIX APIs.
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={onOpenMonitor}
            className="btn btn-primary"
            style={{ padding: '7px 14px' }}
          >
            <Terminal size={14} /> Open Monitor
          </button>
          <button
            onClick={onViewProcesses}
            className="btn btn-outline"
            style={{ padding: '7px 14px' }}
          >
            <ListTree size={14} /> View Processes
          </button>
        </div>
      </div>
    </div>
  );
};
