'use client';

import React from 'react';
import { Cpu, Activity, Clock, Layers } from 'lucide-react';
import { CpuMetrics } from '../../data/linuxMonitorData';

interface CpuMonitorViewProps {
  cpu: CpuMetrics;
}

export const CpuMonitorView: React.FC<CpuMonitorViewProps> = ({ cpu }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header Metric Banner */}
      <div className="sys-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <span className="badge badge-blue">Kernel Telemetry</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginTop: '6px' }}>
              CPU Monitor & Core Telemetry
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#8b949e', marginTop: '2px' }}>
              Real-time delta-based calculation of user, system, idle, and iowait jiffies from <code className="mono" style={{ color: '#58a6ff' }}>/proc/stat</code>.
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.74rem', color: '#8b949e', textTransform: 'uppercase' }}>Overall Utilization</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
              {cpu.utilization.toFixed(1)}%
            </div>
          </div>
        </div>

        <div className="progress-track" style={{ height: '9px', marginBottom: '16px' }}>
          <div className="progress-fill-blue" style={{ width: `${cpu.utilization}%` }} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: '12px',
          background: '#0d1117',
          padding: '14px',
          borderRadius: '8px',
          border: '1px solid #21262d',
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#6e7681' }}>USER TIME</div>
            <div className="mono" style={{ fontSize: '1rem', color: '#f0f6fc', fontWeight: 700 }}>{cpu.user.toFixed(1)}%</div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#6e7681' }}>SYSTEM TIME</div>
            <div className="mono" style={{ fontSize: '1rem', color: '#58a6ff', fontWeight: 700 }}>{cpu.system.toFixed(1)}%</div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#6e7681' }}>IDLE TIME</div>
            <div className="mono" style={{ fontSize: '1rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>{cpu.idle.toFixed(1)}%</div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#6e7681' }}>I/O WAIT</div>
            <div className="mono" style={{ fontSize: '1rem', color: 'var(--accent-amber)', fontWeight: 700 }}>{cpu.iowait.toFixed(1)}%</div>
          </div>
        </div>
      </div>

      {/* Per-Core Breakdown Grid */}
      <div className="sys-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f0f6fc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            PER-CORE BREAKDOWN (8 LOGICAL CORES)
          </h3>
          <span className="badge badge-grey">sysconf(_SC_NPROCESSORS_ONLN)</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          {cpu.cores.map((core) => (
            <div
              key={core.id}
              style={{
                background: '#0d1117',
                border: '1px solid #21262d',
                borderRadius: '8px',
                padding: '14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span className="mono" style={{ fontSize: '0.82rem', fontWeight: 700, color: '#58a6ff' }}>
                  CPU Core {core.id.toString().padStart(2, '0')}
                </span>
                <span className="mono" style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff' }}>
                  {core.usage.toFixed(1)}%
                </span>
              </div>

              <div className="progress-track" style={{ marginBottom: '8px' }}>
                <div
                  className="progress-fill-blue"
                  style={{
                    width: `${core.usage}%`,
                    background: core.usage > 80 ? 'var(--accent-rose)' : core.usage > 60 ? 'var(--accent-blue)' : 'var(--accent-emerald)',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#8b949e' }}>
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
