'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { PROC_PIPELINE } from '../data/linuxMonitorData';

export const ProcPipelineCard: React.FC = () => {
  return (
    <div className="sys-card" style={{ padding: '18px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <h3 style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Kernel /proc Parsing Pipeline
        </h3>
        <span className="badge badge-grey">POSIX Streams</span>
      </div>

      <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
        Direct kernel telemetry with zero external monitoring commands.
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '10px',
      }}>
        {PROC_PIPELINE.map((item, index) => (
          <div
            key={index}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '6px',
              padding: '12px',
            }}
          >
            <div className="mono" style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--accent-cyan)', marginBottom: '4px' }}>
              {item.source}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.72rem', marginBottom: '4px' }}>
              <ArrowRight size={12} />
              <span style={{ color: '#ffffff', fontWeight: 600 }}>{item.target}</span>
            </div>

            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', lineHeight: 1.35 }}>
              {item.desc}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
