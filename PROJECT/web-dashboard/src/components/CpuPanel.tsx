'use client';

import React from 'react';
import { Cpu } from 'lucide-react';
import { CpuMetrics } from '../data/linuxMonitorData';

interface CpuPanelProps {
  cpu: CpuMetrics;
  history: number[]; // Array of last 30 to 60 readings
}

export const CpuPanel: React.FC<CpuPanelProps> = ({ cpu, history }) => {
  // SVG Chart Dimensions
  const height = 90;
  const width = 500;

  // Generate SVG path for line chart
  const points = history.map((val, idx) => {
    const x = (idx / Math.max(1, history.length - 1)) * width;
    const y = height - (val / 100) * height;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });

  const polylineStr = points.join(' ');
  const areaPath = points.length > 0 ? `M 0,${height} L ${polylineStr} L ${width},${height} Z` : '';

  return (
    <div className="sys-panel" style={{ padding: '16px' }}>
      {/* Panel Header */}
      <div className="sys-panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={14} color="var(--accent-primary)" />
          <h2 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            CPU UTILIZATION
          </h2>
        </div>

        <span className="mono" style={{ fontSize: '18px', fontWeight: 600, color: 'var(--text-white)' }}>
          {cpu.utilization.toFixed(1)}%
        </span>
      </div>

      {/* Breakdown Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '8px',
        padding: '8px 12px',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-sm)',
        marginBottom: '14px',
        fontSize: '11px',
      }}>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>User</span>
          <div className="mono" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
            {cpu.user.toFixed(1)}%
          </div>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>System</span>
          <div className="mono" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-primary)', marginTop: '2px' }}>
            {cpu.system.toFixed(1)}%
          </div>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>I/O Wait</span>
          <div className="mono" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-warning)', marginTop: '2px' }}>
            {cpu.iowait.toFixed(1)}%
          </div>
        </div>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Idle</span>
          <div className="mono" style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-success)', marginTop: '2px' }}>
            {cpu.idle.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* 60-Second Real-Time Sparkline History Graph */}
      <div style={{ marginBottom: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px' }}>
          <span>Utilization (Last 60s)</span>
          <span className="mono">{cpu.utilization.toFixed(1)}% current</span>
        </div>

        <div style={{
          position: 'relative',
          width: '100%',
          height: `${height}px`,
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-app)',
          borderRadius: 'var(--radius-sm)',
          overflow: 'hidden',
        }}>
          {/* Subtle Grid lines */}
          <div style={{ position: 'absolute', top: '25%', left: 0, right: 0, height: '1px', background: 'rgba(38, 50, 65, 0.4)' }} />
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'rgba(38, 50, 65, 0.4)' }} />
          <div style={{ position: 'absolute', top: '75%', left: 0, right: 0, height: '1px', background: 'rgba(38, 50, 65, 0.4)' }} />

          {/* SVG Line Chart */}
          <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" style={{ display: 'block' }}>
            {/* Area Fill */}
            {areaPath && (
              <path d={areaPath} fill="rgba(56, 189, 248, 0.08)" />
            )}
            {/* Stroke Line */}
            {points.length > 0 && (
              <polyline
                fill="none"
                stroke="var(--accent-primary)"
                strokeWidth="1.75"
                points={polylineStr}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </svg>
        </div>
      </div>

      {/* Source Footer */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
        Source: /proc/stat
      </div>
    </div>
  );
};
