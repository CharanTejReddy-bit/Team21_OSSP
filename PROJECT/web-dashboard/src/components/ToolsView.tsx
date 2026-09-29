'use client';

import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  UserCheck, 
  Clock, 
  Flame, 
  Sparkles, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  TrendingUp,
  AlertTriangle,
  Layers,
  ChevronRight
} from 'lucide-react';
import { STUDENT_PROFILE, COURSES } from '../data/academicData';

export const ToolsView: React.FC = () => {
  // SGPA Simulator State
  const gradePoints: { [key: string]: number } = {
    'O (10)': 10,
    'A+ (9)': 9,
    'A (8)': 8,
    'B+ (7)': 7,
    'B (6)': 6,
    'C (5)': 5,
  };

  const [courseGrades, setCourseGrades] = useState<{ [key: string]: string }>({
    CS401: 'A+ (9)',
    CS402: 'A (8)',
    CS403: 'A+ (9)',
    CS404: 'A (8)',
    MA401: 'A (8)',
    CS405: 'A+ (9)',
  });

  // Calculate simulated SGPA
  let totalCredits = 0;
  let totalWeightedPoints = 0;
  COURSES.forEach((c) => {
    const pts = gradePoints[courseGrades[c.code] || 'A+ (9)'] || 9;
    totalCredits += c.credits;
    totalWeightedPoints += pts * c.credits;
  });
  const simulatedSGPA = totalCredits > 0 ? (totalWeightedPoints / totalCredits).toFixed(2) : '9.00';
  
  // Previous 3 Semesters (e.g. 60 credits @ 9.42 CGPA)
  const prevCredits = 60;
  const prevPoints = 60 * STUDENT_PROFILE.cgpa;
  const simulatedCGPA = ((prevPoints + totalWeightedPoints) / (prevCredits + totalCredits)).toFixed(2);

  // Attendance Calculator State
  const [targetAttnPct, setTargetAttnPct] = useState(75);
  const [totalClassesInput, setTotalClassesInput] = useState(35);
  const [attendedClassesInput, setAttendedClassesInput] = useState(32);

  const currentAttnPct = totalClassesInput > 0 ? ((attendedClassesInput / totalClassesInput) * 100).toFixed(1) : '0';
  
  // Safe bunk calculation
  // (attended) / (total + x) >= target/100  =>  attended >= (total + x) * target/100
  // x <= (attended * 100 / target) - total
  const maxSafeBunks = Math.max(0, Math.floor((attendedClassesInput * 100) / targetAttnPct - totalClassesInput));
  // Required consecutive attendance to reach target:
  // (attended + y) / (total + y) >= target/100 => y * (1 - target/100) >= target/100 * total - attended
  const neededClasses = parseFloat(currentAttnPct) < targetAttnPct 
    ? Math.ceil((targetAttnPct * totalClassesInput - 100 * attendedClassesInput) / (100 - targetAttnPct))
    : 0;

  // Cyber Pomodoro State
  const [pomoMode, setPomoMode] = useState<'focus' | 'short' | 'long'>('focus');
  const [pomoSecondsLeft, setPomoSecondsLeft] = useState(25 * 60);
  const [pomoActive, setPomoActive] = useState(false);
  const [pomoSessions, setPomoSessions] = useState(3);

  useEffect(() => {
    let timer: any = null;
    if (pomoActive && pomoSecondsLeft > 0) {
      timer = setInterval(() => {
        setPomoSecondsLeft((prev) => prev - 1);
      }, 1000);
    } else if (pomoSecondsLeft === 0 && pomoActive) {
      setPomoActive(false);
      if (pomoMode === 'focus') {
        setPomoSessions((prev) => prev + 1);
      }
    }
    return () => clearInterval(timer);
  }, [pomoActive, pomoSecondsLeft, pomoMode]);

  const switchPomoMode = (mode: 'focus' | 'short' | 'long') => {
    setPomoActive(false);
    setPomoMode(mode);
    if (mode === 'focus') setPomoSecondsLeft(25 * 60);
    else if (mode === 'short') setPomoSecondsLeft(5 * 60);
    else setPomoSecondsLeft(15 * 60);
  };

  const formatPomoTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* 2-Column Suite: GPA Simulator & Attendance Forecaster */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '24px' }}>
        
        {/* Dynamic SGPA & CGPA Simulator */}
        <div className="glass-panel" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calculator size={18} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Dynamic SGPA / CGPA Simulator</h3>
            </div>
            <span className="badge badge-cyan">Sem-4 Live</span>
          </div>

          <div style={{
            background: 'rgba(0, 242, 254, 0.05)',
            border: '1px solid rgba(0, 242, 254, 0.2)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            marginBottom: '20px',
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Simulated SGPA
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                {simulatedSGPA}
              </div>
            </div>

            <div style={{ width: '1px', height: '40px', background: 'var(--border-subtle)' }} />

            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>
                Projected CGPA
              </div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#ffffff' }}>
                {simulatedCGPA}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {COURSES.map((course) => (
              <div
                key={course.id}
                style={{
                  padding: '10px 14px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '10px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: course.color, fontFamily: 'var(--font-mono)' }}>
                      {course.code}
                    </span>
                    <strong style={{ fontSize: '0.84rem', color: '#ffffff' }}>{course.name}</strong>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {course.credits} Credits
                  </div>
                </div>

                <select
                  value={courseGrades[course.code] || 'A+ (9)'}
                  onChange={(e) => setCourseGrades({ ...courseGrades, [course.code]: e.target.value })}
                  style={{
                    background: '#0a101d',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--accent-cyan)',
                    fontWeight: 700,
                    padding: '6px 10px',
                    borderRadius: '6px',
                    outline: 'none',
                    fontSize: '0.8rem',
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  {Object.keys(gradePoints).map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Forecaster & Bunk Safety Meter */}
        <div className="glass-panel" style={{ padding: '26px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <UserCheck size={18} color="var(--accent-emerald)" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Attendance Bunk & Safety Forecaster</h3>
            </div>
            <span className="badge badge-emerald">Safe Zone</span>
          </div>

          {/* Form controls */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Attended Classes
              </label>
              <input
                type="number"
                value={attendedClassesInput}
                onChange={(e) => setAttendedClassesInput(Math.max(0, parseInt(e.target.value) || 0))}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-subtle)', color: '#ffffff', outline: 'none', fontFamily: 'var(--font-mono)' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Total Classes Held
              </label>
              <input
                type="number"
                value={totalClassesInput}
                onChange={(e) => setTotalClassesInput(Math.max(1, parseInt(e.target.value) || 1))}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-subtle)', color: '#ffffff', outline: 'none', fontFamily: 'var(--font-mono)' }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '6px' }}>
              Target Attendance Threshold: <strong style={{ color: 'var(--accent-cyan)' }}>{targetAttnPct}%</strong>
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[75, 80, 85, 90].map((pct) => (
                <button
                  key={pct}
                  onClick={() => setTargetAttnPct(pct)}
                  style={{
                    flex: 1,
                    padding: '6px',
                    borderRadius: '6px',
                    border: targetAttnPct === pct ? '1px solid var(--accent-emerald)' : '1px solid var(--border-subtle)',
                    background: targetAttnPct === pct ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    color: targetAttnPct === pct ? 'var(--accent-emerald)' : 'var(--text-secondary)',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* Result HUD */}
          <div style={{
            background: parseFloat(currentAttnPct) >= targetAttnPct ? 'rgba(16, 185, 129, 0.08)' : 'rgba(244, 63, 94, 0.08)',
            border: parseFloat(currentAttnPct) >= targetAttnPct ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
              Current Attendance Rate
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: parseFloat(currentAttnPct) >= targetAttnPct ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
              {currentAttnPct}%
            </div>

            <div style={{ marginTop: '10px', fontSize: '0.85rem', color: '#ffffff', fontWeight: 600 }}>
              {parseFloat(currentAttnPct) >= targetAttnPct ? (
                <span>
                  🎉 You can safely bunk <strong style={{ color: 'var(--accent-cyan)' }}>{maxSafeBunks} more classes</strong> without falling below {targetAttnPct}%.
                </span>
              ) : (
                <span>
                  ⚠️ You must attend <strong style={{ color: 'var(--accent-rose)' }}>{neededClasses} consecutive classes</strong> to reach {targetAttnPct}%.
                </span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Cyber Focus Pomodoro Timer */}
      <div className="glass-panel" style={{ padding: '28px', textAlign: 'center', maxWidth: '640px', margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
          <Flame size={20} color="var(--accent-amber)" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Deep Work Cyber Focus Timer</h3>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
          25-minute focused study sprints for high retention and problem solving.
        </p>

        {/* Mode Tabs */}
        <div style={{ display: 'inline-flex', gap: '8px', background: 'rgba(255, 255, 255, 0.03)', padding: '6px', borderRadius: '10px', border: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
          <button
            onClick={() => switchPomoMode('focus')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: pomoMode === 'focus' ? 'var(--grad-purple-pink)' : 'transparent', color: '#ffffff', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
          >
            25m Focus
          </button>
          <button
            onClick={() => switchPomoMode('short')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: pomoMode === 'short' ? 'var(--grad-cyan-blue)' : 'transparent', color: pomoMode === 'short' ? '#030712' : '#ffffff', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
          >
            5m Short Break
          </button>
          <button
            onClick={() => switchPomoMode('long')}
            style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: pomoMode === 'long' ? 'var(--grad-emerald)' : 'transparent', color: '#ffffff', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
          >
            15m Long Break
          </button>
        </div>

        {/* Big Digital Display */}
        <div style={{
          fontSize: '4.5rem',
          fontWeight: 800,
          fontFamily: 'var(--font-mono)',
          letterSpacing: '0.04em',
          color: pomoActive ? 'var(--accent-cyan)' : '#ffffff',
          textShadow: pomoActive ? '0 0 25px rgba(0, 242, 254, 0.4)' : 'none',
          marginBottom: '20px',
        }}>
          {formatPomoTime(pomoSecondsLeft)}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
          <button
            onClick={() => setPomoActive(!pomoActive)}
            className="btn btn-primary"
            style={{ padding: '12px 28px', fontSize: '0.95rem' }}
          >
            {pomoActive ? <Pause size={18} /> : <Play size={18} />}
            {pomoActive ? 'Pause Session' : 'Start Focus'}
          </button>
          <button
            onClick={() => switchPomoMode(pomoMode)}
            className="btn btn-outline"
            style={{ padding: '12px 18px' }}
            title="Reset"
          >
            <RotateCcw size={18} />
          </button>
        </div>

        <div style={{ marginTop: '20px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Completed Today: <strong style={{ color: 'var(--accent-amber)' }}>{pomoSessions} sessions</strong> (1.25 Hours Pure Focus)
        </div>
      </div>

    </div>
  );
};
