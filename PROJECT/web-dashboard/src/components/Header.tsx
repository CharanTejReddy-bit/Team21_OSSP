'use client';

import React from 'react';
import { RefreshCw, Clock, Settings, Network } from 'lucide-react';
import { HostSwitcher } from './HostSwitcher';
import { RemoteNode } from '../data/remoteNodesData';

interface HeaderProps {
  uptime: string;
  refreshInterval: number;
  setRefreshInterval: (interval: number) => void;
  onOpenSettings: () => void;
  nodes: RemoteNode[];
  activeHostIp: string;
  onSelectHost: (ip: string) => void;
  onAddCustomNode: (node: RemoteNode) => void;
}

export const Header: React.FC<HeaderProps> = ({
  uptime,
  refreshInterval,
  setRefreshInterval,
  onOpenSettings,
  nodes,
  activeHostIp,
  onSelectHost,
  onAddCustomNode,
}) => {
  return (
    <header style={{
      height: '50px',
      borderBottom: '1px solid var(--border-app)',
      background: 'var(--bg-surface)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 24px',
    }}>
      {/* Left Application Identity & Host IP Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
          <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-white)' }}>
            Linux System Monitor
          </span>
        </div>

        {/* Target Host IP Switcher */}
        <HostSwitcher
          nodes={nodes}
          activeHostIp={activeHostIp}
          onSelectHost={onSelectHost}
          onAddCustomNode={onAddCustomNode}
        />
      </div>

      {/* Right Controls HUD */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* LIVE Indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', fontWeight: 600, color: 'var(--accent-success)' }}>
          <span className="status-indicator status-online" />
          <span>LIVE</span>
        </div>

        <div style={{ width: '1px', height: '14px', background: 'var(--border-app)' }} />

        {/* Refresh Interval Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <RefreshCw size={12} color="var(--text-muted)" />
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Refresh:</span>
          <select
            value={refreshInterval}
            onChange={(e) => setRefreshInterval(parseFloat(e.target.value))}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              fontWeight: 500,
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="0.5" style={{ background: '#111720', color: '#E6EDF3' }}>0.5s</option>
            <option value="1" style={{ background: '#111720', color: '#E6EDF3' }}>1s</option>
            <option value="2" style={{ background: '#111720', color: '#E6EDF3' }}>2s</option>
            <option value="5" style={{ background: '#111720', color: '#E6EDF3' }}>5s</option>
          </select>
        </div>

        <div style={{ width: '1px', height: '14px', background: 'var(--border-app)' }} />

        {/* System Uptime */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--text-secondary)' }}>
          <Clock size={12} color="var(--text-muted)" />
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Uptime:</span>
          <span className="mono" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{uptime}</span>
        </div>

        <div style={{ width: '1px', height: '14px', background: 'var(--border-app)' }} />

        {/* Settings Icon */}
        <button
          onClick={onOpenSettings}
          className="btn btn-default"
          style={{ padding: '4px 6px', height: '26px' }}
          title="Settings"
        >
          <Settings size={13} color="var(--text-secondary)" />
        </button>
      </div>
    </header>
  );
};
