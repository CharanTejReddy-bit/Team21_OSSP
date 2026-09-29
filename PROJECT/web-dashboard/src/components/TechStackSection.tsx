'use client';

import React from 'react';
import { Layers } from 'lucide-react';
import { TECH_STACK } from '../data/linuxMonitorData';

export const TechStackSection: React.FC = () => {
  return (
    <div className="sys-card" style={{ padding: '22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f0f6fc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          TECH STACK
        </h3>
        <span className="badge badge-grey">Zero External Dependencies</span>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {TECH_STACK.map((tech, index) => (
          <div
            key={index}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              background: '#0d1117',
              border: '1px solid #30363d',
              color: '#f0f6fc',
              fontSize: '0.82rem',
              fontWeight: 700,
              fontFamily: 'var(--font-mono)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span style={{ color: '#58a6ff' }}>#</span>
            <span>{tech}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
