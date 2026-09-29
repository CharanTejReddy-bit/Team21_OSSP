'use client';

import React from 'react';
import { Server, Cpu, Clock, Terminal, Activity, Layers } from 'lucide-react';
import { SystemOverview } from '../data/linuxMonitorData';

interface SystemOverviewProps {
  systemInfo: SystemOverview;
}

export const SystemOverviewCard: React.FC<SystemOverviewProps> = ({ systemInfo }) => {
  const infoFields = [
    { label: 'Hostname', value: systemInfo.hostname },
    { label: 'OS', value: systemInfo.os },
    { label: 'Kernel', value: systemInfo.kernel },
    { label: 'CPU Cores', value: `${systemInfo.cpuCores} Cores` },
    { label: 'Uptime', value: systemInfo.uptime },
    { label: 'Load Average', value: `${systemInfo.loadAverage[0].toFixed(2)} ${systemInfo.loadAverage[1].toFixed(2)} ${systemInfo.loadAverage[2].toFixed(2)}` },
  ];

  return (
    <div className="sys-card" style={{ padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <h3 style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          System Overview
        </h3>
        <span className="badge badge-grey">x86_64</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '10px',
      }}>
        {infoFields.map((field, i) => (
          <div
            key={i}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '10px 12px',
            }}
          >
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '2px' }}>
              {field.label}
            </div>
            <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
              {field.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
