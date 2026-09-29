'use client';

import React from 'react';
import { ArrowRight, Server, Terminal, FileCode } from 'lucide-react';

export const ProcArchitecturePanel: React.FC = () => {
  const mappings = [
    { source: '/proc/stat', target: 'CPU Metrics', detail: 'user, sys, idle, iowait delta jiffies' },
    { source: '/proc/meminfo', target: 'Memory Metrics', detail: 'MemTotal, MemAvailable, Buffers, Cached, Swap' },
    { source: '/proc/uptime', target: 'System Uptime', detail: 'system total uptime seconds & idle time' },
    { source: '/proc/[PID]/stat', target: 'Process Metrics', detail: 'state flags (R/S/Z), CPU ticks, thread count' },
  ];

  return (
    <div className="sys-panel" style={{ padding: '16px' }}>
      {/* Panel Header */}
      <div className="sys-panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Server size={14} color="var(--accent-primary)" />
          <h2 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            KERNEL TELEMETRY
          </h2>
        </div>
        <span className="mono" style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          /proc Virtual Filesystem
        </span>
      </div>

      {/* Technical Pipeline Flow */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        background: 'var(--bg-surface)',
        borderRadius: 'var(--radius-sm)',
        marginBottom: '12px',
        fontSize: '11px',
        overflowX: 'auto',
        gap: '8px',
      }}>
        <div className="mono" style={{ color: 'var(--text-white)', fontWeight: 600 }}>Linux Kernel</div>
        <ArrowRight size={12} color="var(--text-muted)" />
        <div className="mono" style={{ color: 'var(--accent-primary)' }}>/proc Filesystem</div>
        <ArrowRight size={12} color="var(--text-muted)" />
        <div className="mono" style={{ color: 'var(--text-white)' }}>Metric Parsers</div>
        <ArrowRight size={12} color="var(--text-muted)" />
        <div className="mono" style={{ color: 'var(--accent-success)' }}>Monitoring Engine</div>
        <ArrowRight size={12} color="var(--text-muted)" />
        <div className="mono" style={{ color: 'var(--text-secondary)' }}>Terminal / UI</div>
      </div>

      {/* Mapping Rows */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '8px' }}>
        {mappings.map((m, i) => (
          <div
            key={i}
            style={{
              padding: '8px 10px',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-muted)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2px' }}>
              <span className="mono" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-primary)' }}>
                {m.source}
              </span>
              <span style={{ fontSize: '11px', fontWeight: 500, color: 'var(--text-white)' }}>
                {m.target}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              {m.detail}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
