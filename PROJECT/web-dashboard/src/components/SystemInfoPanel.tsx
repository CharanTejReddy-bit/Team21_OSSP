'use client';

import React from 'react';
import { Info } from 'lucide-react';
import { SystemOverview } from '../data/linuxMonitorData';

interface SystemInfoPanelProps {
  systemInfo: SystemOverview;
}

export const SystemInfoPanel: React.FC<SystemInfoPanelProps> = ({ systemInfo }) => {
  return (
    <div className="sys-panel" style={{ padding: '16px' }}>
      <div className="sys-panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Info size={14} color="var(--accent-primary)" />
          <h2 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            SYSTEM INFORMATION
          </h2>
        </div>
        <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          POSIX uname
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
        <div className="data-row" style={{ padding: '8px 12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)' }}>
          <span style={{ color: 'var(--text-muted)' }}>HOSTNAME</span>
          <span className="mono" style={{ color: 'var(--accent-primary)', fontWeight: 500 }}>{systemInfo.hostname}</span>
        </div>

        <div className="data-row" style={{ padding: '8px 12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)' }}>
          <span style={{ color: 'var(--text-muted)' }}>OS</span>
          <span className="mono" style={{ color: 'var(--text-white)' }}>Ubuntu Linux</span>
        </div>

        <div className="data-row" style={{ padding: '8px 12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)' }}>
          <span style={{ color: 'var(--text-muted)' }}>KERNEL</span>
          <span className="mono" style={{ color: 'var(--text-white)' }}>{systemInfo.kernel.split(' ')[0] || '6.8.0-generic'}</span>
        </div>

        <div className="data-row" style={{ padding: '8px 12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)' }}>
          <span style={{ color: 'var(--text-muted)' }}>ARCHITECTURE</span>
          <span className="mono" style={{ color: 'var(--text-secondary)' }}>x86_64</span>
        </div>

        <div className="data-row" style={{ padding: '8px 12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)' }}>
          <span style={{ color: 'var(--text-muted)' }}>CPU CORES</span>
          <span className="mono" style={{ color: 'var(--text-white)' }}>{systemInfo.cpuCores} Cores</span>
        </div>

        <div className="data-row" style={{ padding: '8px 12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)' }}>
          <span style={{ color: 'var(--text-muted)' }}>UPTIME</span>
          <span className="mono" style={{ color: 'var(--accent-success)' }}>{systemInfo.uptime}</span>
        </div>

        <div className="data-row" style={{ padding: '8px 12px', background: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)', gridColumn: 'span 2' }}>
          <span style={{ color: 'var(--text-muted)' }}>LOAD AVERAGE</span>
          <span className="mono" style={{ color: 'var(--text-white)', fontWeight: 500 }}>
            {systemInfo.loadAverage[0].toFixed(2)} / {systemInfo.loadAverage[1].toFixed(2)} / {systemInfo.loadAverage[2].toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
