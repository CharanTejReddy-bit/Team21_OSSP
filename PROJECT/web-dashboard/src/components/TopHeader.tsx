'use client';

import React from 'react';
import { Clock, RefreshCw } from 'lucide-react';

interface TopHeaderProps {
  uptime: string;
  refreshInterval: number;
  setRefreshInterval: (interval: number) => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ uptime, refreshInterval, setRefreshInterval }) => {
  return (
    <header style={{
      height: '64px',
      borderBottom: '1px solid var(--border-subtle)',
      background: 'var(--bg-secondary)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
    }}>
      {/* Title & Subtitle */}
      <div>
        <h1 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
          Linux System Command Center
        </h1>
        <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
          Real-time kernel metrics & process manager
        </p>
      </div>

      {/* Right Telemetry Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* LIVE Indicator Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          padding: '4px 8px',
          borderRadius: '4px',
        }}>
          <span className="live-dot" />
          <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-emerald)', letterSpacing: '0.04em' }}>
            LIVE
          </span>
        </div>

        {/* Refresh Interval Selector */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border-subtle)',
          padding: '3px 8px',
          borderRadius: '4px',
        }}>
          <RefreshCw size={12} color="var(--text-muted)" />
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Rate:</span>
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(parseFloat(e.target.value))}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.74rem',
              fontWeight: 600,
              outline: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <option value="0.5" style={{ background: '#11131a', color: '#ffffff' }}>0.5s</option>
            <option value="1" style={{ background: '#11131a', color: '#ffffff' }}>1.0s</option>
            <option value="2" style={{ background: '#11131a', color: '#ffffff' }}>2.0s</option>
            <option value="5" style={{ background: '#11131a', color: '#ffffff' }}>5.0s</option>
          </select>
        </div>

        {/* System Uptime */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.74rem',
          color: 'var(--text-secondary)',
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border-subtle)',
          padding: '4px 10px',
          borderRadius: '4px',
        }}>
          <Clock size={13} color="var(--text-muted)" />
          <span>Uptime: <strong className="mono" style={{ color: '#ffffff' }}>{uptime}</strong></span>
        </div>
      </div>
    </header>
  );
};
