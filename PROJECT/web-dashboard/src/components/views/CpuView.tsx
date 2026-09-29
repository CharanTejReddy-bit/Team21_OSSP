'use client';

import React from 'react';
import { CpuPanel } from '../CpuPanel';
import { CpuMetrics } from '../../data/linuxMonitorData';

interface CpuViewProps {
  cpu: CpuMetrics;
  history: number[];
}

export const CpuView: React.FC<CpuViewProps> = ({ cpu, history }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <CpuPanel cpu={cpu} history={history} />

      {/* Per Core Breakdown Grid */}
      <div className="sys-panel" style={{ padding: '16px' }}>
        <div className="sys-panel-header">
          <h2 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            PER-CORE UTILIZATION ({cpu.cores.length} LOGICAL CORES)
          </h2>
          <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            /proc/stat (cpu0..cpuN)
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '8px' }}>
          {cpu.cores.map((core) => (
            <div
              key={core.id}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-muted)',
                borderRadius: 'var(--radius-sm)',
                padding: '10px 12px',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span className="mono" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-primary)' }}>
                  Core {core.id.toString().padStart(2, '0')}
                </span>
                <span className="mono" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-white)' }}>
                  {core.usage.toFixed(1)}%
                </span>
              </div>

              <div className="meter-track" style={{ marginBottom: '6px' }}>
                <div
                  className="meter-fill"
                  style={{
                    width: `${core.usage}%`,
                    background: core.usage > 80 ? 'var(--accent-danger)' : core.usage > 50 ? 'var(--accent-primary)' : 'var(--accent-success)',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span>User: {core.user.toFixed(1)}%</span>
                <span>Sys: {core.sys.toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
