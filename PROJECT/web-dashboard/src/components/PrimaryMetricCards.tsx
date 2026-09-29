'use client';

import React from 'react';
import { Cpu, HardDrive, ListTree } from 'lucide-react';
import { CpuMetrics, MemoryMetrics, ProcessMetrics } from '../data/linuxMonitorData';

interface MetricCardsProps {
  cpu: CpuMetrics;
  memory: MemoryMetrics;
  processes: ProcessMetrics;
}

export const PrimaryMetricCards: React.FC<MetricCardsProps> = ({ cpu, memory, processes }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '16px',
    }}>
      
      {/* CARD 1: CPU UTILIZATION */}
      <div className="sys-card" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            CPU Utilization
          </span>
          <Cpu size={15} color="var(--text-muted)" />
        </div>

        {/* Big Metric Display */}
        <div style={{ fontSize: '1.9rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
          {cpu.utilization.toFixed(1)}%
        </div>

        {/* Horizontal Progress Bar */}
        <div className="progress-track" style={{ marginBottom: '12px' }}>
          <div className="progress-fill-blue" style={{ width: `${Math.min(100, Math.max(0, cpu.utilization))}%` }} />
        </div>

        {/* Sub Metrics Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
          <div>User: <span className="mono" style={{ color: 'var(--text-primary)' }}>{cpu.user.toFixed(1)}%</span></div>
          <div>System: <span className="mono" style={{ color: 'var(--text-primary)' }}>{cpu.system.toFixed(1)}%</span></div>
          <div>Idle: <span className="mono" style={{ color: 'var(--text-primary)' }}>{cpu.idle.toFixed(1)}%</span></div>
          <div>I/O Wait: <span className="mono" style={{ color: 'var(--text-primary)' }}>{cpu.iowait.toFixed(1)}%</span></div>
        </div>

        {/* Source */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '6px', fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {cpu.source}
        </div>
      </div>

      {/* CARD 2: MEMORY UTILIZATION */}
      <div className="sys-card" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Memory Utilization
          </span>
          <HardDrive size={15} color="var(--text-muted)" />
        </div>

        {/* Big Metric Display */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginBottom: '8px' }}>
          <span style={{ fontSize: '1.9rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
            {memory.usedGib.toFixed(1)} / {memory.totalGib.toFixed(1)} GiB
          </span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
            ({memory.percentage}%)
          </span>
        </div>

        {/* Horizontal Progress Bar */}
        <div className="progress-track" style={{ marginBottom: '12px' }}>
          <div className="progress-fill-emerald" style={{ width: `${Math.min(100, Math.max(0, memory.percentage))}%` }} />
        </div>

        {/* Sub Metrics Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
          <div>Used: <span className="mono" style={{ color: 'var(--text-primary)' }}>{memory.usedGib.toFixed(1)} GiB</span></div>
          <div>Available: <span className="mono" style={{ color: 'var(--text-primary)' }}>{memory.availableGib.toFixed(1)} GiB</span></div>
        </div>

        {/* Source */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '6px', fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {memory.source}
        </div>
      </div>

      {/* CARD 3: ACTIVE PROCESSES */}
      <div className="sys-card" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Processes
          </span>
          <ListTree size={15} color="var(--text-muted)" />
        </div>

        {/* Big Metric Display */}
        <div style={{ fontSize: '1.9rem', fontWeight: 700, color: '#ffffff', fontFamily: 'var(--font-mono)', marginBottom: '8px' }}>
          {processes.total}
        </div>

        {/* State Bar */}
        <div style={{ display: 'flex', height: '5px', borderRadius: '3px', overflow: 'hidden', background: 'var(--border-subtle)', marginBottom: '12px' }}>
          <div style={{ width: `${(processes.running / processes.total) * 100}%`, background: 'var(--accent-emerald)' }} />
          <div style={{ width: `${(processes.sleeping / processes.total) * 100}%`, background: 'var(--accent-blue)' }} />
          <div style={{ width: `${(processes.stopped / processes.total) * 100}%`, background: 'var(--accent-amber)' }} />
          <div style={{ width: `${(processes.zombie / processes.total) * 100}%`, background: 'var(--accent-rose)' }} />
        </div>

        {/* Sub Metrics Breakdown */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '0.74rem', color: 'var(--text-muted)', marginBottom: '10px' }}>
          <div>Running: <span className="mono" style={{ color: 'var(--accent-emerald)' }}>{processes.running}</span></div>
          <div>Sleeping: <span className="mono" style={{ color: 'var(--text-primary)' }}>{processes.sleeping}</span></div>
          <div>Stopped: <span className="mono" style={{ color: 'var(--text-muted)' }}>{processes.stopped}</span></div>
          <div>Zombie: <span className="mono" style={{ color: 'var(--accent-rose)' }}>{processes.zombie}</span></div>
        </div>

        {/* Source */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '6px', fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {processes.source}
        </div>
      </div>

    </div>
  );
};
