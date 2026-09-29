'use client';

import React from 'react';
import { BookOpen } from 'lucide-react';
import { OS_CONCEPTS } from '../data/linuxMonitorData';

export const OsConceptsSection: React.FC = () => {
  return (
    <div className="sys-card" style={{ padding: '22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f0f6fc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          OPERATING SYSTEM CONCEPTS
        </h3>
        <span className="badge badge-grey">8 Core Disciplines</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '12px',
      }}>
        {OS_CONCEPTS.map((concept, index) => (
          <div
            key={index}
            style={{
              background: '#0d1117',
              border: '1px solid #21262d',
              borderRadius: '8px',
              padding: '14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h4 style={{ fontSize: '0.86rem', fontWeight: 700, color: '#ffffff' }}>
                {concept.title}
              </h4>
              <span className="badge badge-blue" style={{ fontSize: '0.65rem' }}>
                {concept.tag}
              </span>
            </div>
            <p style={{ fontSize: '0.76rem', color: '#8b949e', lineHeight: 1.45 }}>
              {concept.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
