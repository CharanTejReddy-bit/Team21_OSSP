'use client';

import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Sparkles, 
  CheckCircle2,
  Layers,
  Download
} from 'lucide-react';
import { TIMETABLE, TimetableSlot } from '../data/academicData';

export const TimetableView: React.FC = () => {
  const [selectedDay, setSelectedDay] = useState<string>('Monday');
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'All Days'];

  const filteredSlots = selectedDay === 'All Days'
    ? TIMETABLE
    : TIMETABLE.filter((slot) => slot.day === selectedDay);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Day Selector Pill Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255, 255, 255, 0.03)', padding: '6px', borderRadius: '10px', border: '1px solid var(--border-subtle)', overflowX: 'auto' }}>
          {days.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              style={{
                padding: '8px 18px',
                borderRadius: '8px',
                border: 'none',
                background: selectedDay === day ? 'var(--grad-cyan-blue)' : 'transparent',
                color: selectedDay === day ? '#030712' : 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
            >
              {day}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge badge-emerald">
            <span className="live-indicator" style={{ width: '6px', height: '6px' }} /> Regular Semester Cycle
          </span>
        </div>
      </div>

      {/* Schedule Timeline Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filteredSlots.map((slot) => (
          <div
            key={slot.id}
            className="glass-panel"
            style={{
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              borderLeft: `4px solid ${slot.color}`,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', minWidth: '240px' }}>
              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                padding: '10px 14px',
                borderRadius: '10px',
                textAlign: 'center',
                minWidth: '130px',
              }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                  {slot.time}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {slot.day}
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px', background: 'rgba(0, 242, 254, 0.1)', color: slot.color, fontFamily: 'var(--font-mono)' }}>
                    {slot.courseCode}
                  </span>
                  <span className={`badge ${slot.type === 'Lab' ? 'badge-purple' : 'badge-cyan'}`} style={{ fontSize: '0.65rem' }}>
                    {slot.type}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginTop: '4px' }}>
                  {slot.courseName}
                </h3>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <MapPin size={15} color="var(--accent-cyan)" />
                <span>Room: <strong style={{ color: '#ffffff' }}>{slot.room}</strong></span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                <User size={15} color="var(--accent-purple)" />
                <span>{slot.instructor}</span>
              </div>

              <div style={{
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)'
              }}>
                Scheduled (50 Min)
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
