'use client';

import React from 'react';
import { Users, User, CheckCircle2 } from 'lucide-react';
import { TEAM_MEMBERS } from '../data/linuxMonitorData';

export const TeamSection: React.FC = () => {
  return (
    <div className="sys-card" style={{ padding: '22px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f0f6fc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          PROJECT TEAM
        </h3>
        <span className="badge badge-grey">Sem 4 CSE</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
      }}>
        {TEAM_MEMBERS.map((member) => (
          <div
            key={member.memberNumber}
            style={{
              background: '#0d1117',
              border: '1px solid #21262d',
              borderRadius: '8px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              {/* Member Tag & Number */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span className="badge badge-blue">
                  Member {member.memberNumber}
                </span>
                <span className="mono" style={{ fontSize: '0.78rem', color: '#58a6ff', fontWeight: 700 }}>
                  {member.rollNo}
                </span>
              </div>

              {/* Name */}
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
                {member.name}
              </h4>

              {/* Role */}
              <div style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '12px' }}>
                {member.role}
              </div>
            </div>

            {/* Responsibilities list */}
            <div style={{ borderTop: '1px solid #21262d', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {member.responsibilities.map((resp, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.74rem', color: '#8b949e' }}>
                  <span style={{ color: '#58a6ff' }}>•</span>
                  <code className="mono" style={{ color: '#f0f6fc' }}>{resp}</code>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
