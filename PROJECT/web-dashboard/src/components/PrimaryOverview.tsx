'use client';

import React from 'react';
import { Cpu, HardDrive, ListTree } from 'lucide-react';
import { CpuMetrics, MemoryMetrics, ProcessMetrics } from '../data/linuxMonitorData';

interface PrimaryOverviewProps {
  cpu: CpuMetrics;
  memory: MemoryMetrics;
  processes: ProcessMetrics;
}

export const PrimaryOverview: React.FC<PrimaryOverviewProps> = ({ cpu, memory, processes }) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      {/* Section Header */}
      <div style={{ marginBottom: '14px' }}>
        <h1 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-white)' }}>
          System Overview
        </h1>
        <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
          Real-time Linux resource utilization
        </p>
      </div>

      {/* 3 Compact Metrics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '12px',
      }}>
        
        {/* Metric 1: CPU */}
        <div className="sys-panel" style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              CPU
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {cpu.cores.length} cores
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
            <span className="mono" style={{ fontSize: '26px', fontWeight: 600, color: 'var(--text-white)' }}>
              {cpu.utilization.toFixed(1)}%
            </span>
          </div>

          <div className="meter-track" style={{ marginBottom: '8px' }}>
            <div className="meter-fill" style={{ width: `${Math.min(100, Math.max(0, cpu.utilization))}%`, background: 'var(--accent-primary)' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            <span>User {cpu.user.toFixed(1)}%</span>
            <span>Sys {cpu.system.toFixed(1)}%</span>
            <span>Source: {cpu.source.includes('/proc') ? '/proc/stat' : '/proc/stat'}</span>
          </div>
        </div>

        {/* Metric 2: Memory */}
        <div className="sys-panel" style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Memory
            </span>
            <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {memory.percentage}%
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '6px' }}>
            <span className="mono" style={{ fontSize: '26px', fontWeight: 600, color: 'var(--text-white)' }}>
              {memory.usedGib.toFixed(1)} <span style={{ fontSize: '14px', color: 'var(--text-muted)', fontWeight: 400 }}>/ {memory.totalGib.toFixed(1)} GiB</span>
            </span>
          </div>

          <div className="meter-track" style={{ marginBottom: '8px' }}>
            <div className="meter-fill" style={{ width: `${Math.min(100, Math.max(0, memory.percentage))}%`, background: 'var(--accent-success)' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            <span>Avail {memory.availableGib.toFixed(1)} GiB</span>
            <span>Cached {memory.cachedGib.toFixed(1)} GiB</span>
            <span>Source: /proc/meminfo</span>
          </div>
        </div>

        {/* Metric 3: Processes */}
        <div className="sys-panel" style={{ padding: '14px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Processes
            </span>
            <span style={{ fontSize: '11px', color: 'var(--accent-success)' }}>
              {processes.running} running
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '6px' }}>
            <span className="mono" style={{ fontSize: '26px', fontWeight: 600, color: 'var(--text-white)' }}>
              {processes.total}
            </span>
          </div>

          <div className="meter-track" style={{ marginBottom: '8px', display: 'flex' }}>
            <div style={{ width: `${(processes.running / processes.total) * 100}%`, background: 'var(--accent-success)' }} />
            <div style={{ width: `${(processes.sleeping / processes.total) * 100}%`, background: 'var(--accent-primary)' }} />
            <div style={{ width: `${(processes.stopped / processes.total) * 100}%`, background: 'var(--accent-warning)' }} />
            <div style={{ width: `${(processes.zombie / processes.total) * 100}%`, background: 'var(--accent-danger)' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            <span>Sleep {processes.sleeping}</span>
            <span>Zombie {processes.zombie}</span>
            <span>Source: /proc</span>
          </div>
        </div>

      </div>
    </div>
  );
};
