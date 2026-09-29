'use client';

import React from 'react';
import { HardDrive } from 'lucide-react';
import { MemoryMetrics } from '../data/linuxMonitorData';

interface MemoryPanelProps {
  memory: MemoryMetrics;
}

export const MemoryPanel: React.FC<MemoryPanelProps> = ({ memory }) => {
  return (
    <div className="sys-panel" style={{ padding: '16px' }}>
      {/* Panel Header */}
      <div className="sys-panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <HardDrive size={14} color="var(--accent-success)" />
          <h2 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            MEMORY
          </h2>
        </div>

        <span className="mono" style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-white)' }}>
          {memory.percentage}%
        </span>
      </div>

      {/* Main Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        padding: '8px 12px',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-sm)',
        marginBottom: '14px',
        fontSize: '11px',
      }}>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Used</span>
          <div className="mono" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-white)', marginTop: '2px' }}>
            {memory.usedGib.toFixed(1)} GiB
          </div>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Available</span>
          <div className="mono" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-success)', marginTop: '2px' }}>
            {memory.availableGib.toFixed(1)} GiB
          </div>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Total</span>
          <div className="mono" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginTop: '2px' }}>
            {memory.totalGib.toFixed(1)} GiB
          </div>
        </div>
      </div>

      {/* Physical RAM Meter */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>
          <span>RAM Utilization</span>
          <span className="mono">{memory.percentage}%</span>
        </div>
        <div className="meter-track">
          <div className="meter-fill" style={{ width: `${memory.percentage}%`, background: 'var(--accent-success)' }} />
        </div>
      </div>

      {/* Swap Space Section */}
      <div style={{
        padding: '10px 12px',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-muted)',
        marginBottom: '10px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Swap Space</span>
          <span className="mono" style={{ color: 'var(--text-primary)', fontWeight: 500 }}>
            {memory.swapUsedGib.toFixed(1)} / {memory.swapTotalGib.toFixed(1)} GiB
          </span>
        </div>
        <div className="meter-track">
          <div
            className="meter-fill"
            style={{
              width: `${(memory.swapUsedGib / Math.max(0.1, memory.swapTotalGib)) * 100}%`,
              background: 'var(--accent-warning)',
            }}
          />
        </div>
      </div>

      {/* Source Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
        Source: /proc/meminfo
      </div>
    </div>
  );
};
