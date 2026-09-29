'use client';

import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  UserCheck, 
  Award, 
  BookOpen, 
  Terminal, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  ArrowUpRight, 
  ChevronRight, 
  Sparkles, 
  Calendar as CalendarIcon, 
  Plus, 
  Trash2,
  TrendingUp,
  Cpu,
  Layers,
  Zap
} from 'lucide-react';
import { STUDENT_PROFILE, COURSES, ASSIGNMENTS, TIMETABLE, PROJECT_DETAILS } from '../data/academicData';

interface DashboardViewProps {
  setActiveTab: (tab: string) => void;
  setSelectedCourse?: (courseId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ setActiveTab }) => {
  const [quickNotes, setQuickNotes] = useState<string[]>([
    "Review /proc/stat CPU jiffies formula before Friday's OSSP presentation.",
    "Solve 3 Dynamic Programming LCS variations for DAA midterm.",
    "Test Wireshark packet filter syntax for Networks lab evaluation.",
  ]);
  const [newNote, setNewNote] = useState('');

  const addNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (newNote.trim()) {
      setQuickNotes([...quickNotes, newNote.trim()]);
      setNewNote('');
    }
  };

  const removeNote = (index: number) => {
    setQuickNotes(quickNotes.filter((_, i) => i !== index));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Top Banner: Academic Welcome & Status HUD */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(14, 23, 42, 0.9) 0%, rgba(15, 23, 42, 0.6) 50%, rgba(0, 242, 254, 0.08) 100%)',
        border: '1px solid var(--border-glow)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 32px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-glow-cyan)',
      }}>
        {/* Ambient background glow ring */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 242, 254, 0.25) 0%, transparent 70%)',
          filter: 'blur(30px)',
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-cyan">
                <Sparkles size={12} /> Student Academic Command Hub
              </span>
              <span className="badge badge-emerald">
                System Health: Nominal (100%)
              </span>
            </div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Welcome back, <span className="gradient-text">{STUDENT_PROFILE.name}</span>
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '0.92rem', lineHeight: 1.5 }}>
              You are currently on track with <strong style={{ color: '#ffffff' }}>9.42 CGPA (Rank #4)</strong> in {STUDENT_PROFILE.program}. All 6 core subjects are in the safe attendance zone (&gt;85%).
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button 
              onClick={() => setActiveTab('linux-project')} 
              className="btn btn-primary"
              style={{ padding: '12px 20px', fontSize: '0.9rem' }}
            >
              <Terminal size={18} /> Launch Linux Monitor Lab
            </button>
            <button 
              onClick={() => setActiveTab('tools')} 
              className="btn btn-outline"
              style={{ padding: '12px 20px', fontSize: '0.9rem' }}
            >
              <TrendingUp size={18} /> GPA & Bunk Simulator
            </button>
          </div>
        </div>
      </div>

      {/* 4 Quick Stat Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
        
        {/* CGPA Card */}
        <div className="glass-panel" style={{ padding: '22px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Cumulative GPA
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(0, 242, 254, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GraduationCap size={20} color="var(--accent-cyan)" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#ffffff' }}>
              {STUDENT_PROFILE.cgpa}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>/ 10.00</span>
          </div>
          <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--accent-emerald)' }}>
            <TrendingUp size={14} />
            <span>Target SGPA: {STUDENT_PROFILE.sgpaTarget} (On Track)</span>
          </div>
          <div style={{ marginTop: '10px', width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: '94.2%', height: '100%', background: 'var(--grad-cyan-blue)', borderRadius: '3px' }} />
          </div>
        </div>

        {/* Attendance Card */}
        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Overall Attendance
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UserCheck size={20} color="var(--accent-emerald)" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#ffffff' }}>
              {STUDENT_PROFILE.overallAttendance}%
            </span>
            <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>Safe &gt;75%</span>
          </div>
          <div style={{ marginTop: '12px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            Total 175 attended / 188 held
          </div>
          <div style={{ marginTop: '10px', width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: '92.4%', height: '100%', background: 'var(--grad-emerald)', borderRadius: '3px' }} />
          </div>
        </div>

        {/* Academic Credits */}
        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Enrolled Credits
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(121, 40, 202, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <BookOpen size={20} color="var(--accent-purple)" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#ffffff' }}>
              {STUDENT_PROFILE.totalCredits}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Credits (6 Courses)</span>
          </div>
          <div style={{ marginTop: '12px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
            18 Theory + 4 Practical Lab Credits
          </div>
          <div style={{ marginTop: '10px', width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: '81.8%', height: '100%', background: 'var(--grad-purple-pink)', borderRadius: '3px' }} />
          </div>
        </div>

        {/* Class Rank & Standing */}
        <div className="glass-panel" style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Cohort Rank
            </span>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(245, 158, 11, 0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Award size={20} color="var(--accent-amber)" />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#ffffff' }}>
              #{STUDENT_PROFILE.academicRank}
            </span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>of 240 Students</span>
          </div>
          <div style={{ marginTop: '12px', fontSize: '0.78rem', color: 'var(--accent-amber)' }}>
            Top 1.6% Percentile Dean's List
          </div>
          <div style={{ marginTop: '10px', width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: '98.4%', height: '100%', background: 'linear-gradient(90deg, #f59e0b, #ec4899)', borderRadius: '3px' }} />
          </div>
        </div>

      </div>

      {/* Spotlight Project Section: Linux System Information & Resource Monitor */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 24, 44, 0.95) 0%, rgba(8, 12, 22, 0.98) 100%)',
        border: '1px solid var(--border-glow)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 28px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge badge-purple">
                <Terminal size={12} /> Flagship Course Project
              </span>
              <span className="badge badge-cyan">
                {PROJECT_DETAILS.course}
              </span>
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginTop: '8px', color: '#ffffff' }}>
              {PROJECT_DETAILS.title}
            </h3>
          </div>
          
          <button 
            onClick={() => setActiveTab('linux-project')}
            className="btn btn-primary"
            style={{ fontSize: '0.85rem' }}
          >
            Explore Interactive Project Hub <ChevronRight size={16} />
          </button>
        </div>

        {/* Quick Grid inside Spotlight */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
          
          {/* Team Members List */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
              Project Team
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {PROJECT_DETAILS.team.map((member, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '6px', background: 'rgba(0, 242, 254, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                      0{i+1}
                    </div>
                    <div>
                      <strong style={{ color: '#ffffff' }}>{member.name}</strong>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{member.role}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>
                    {member.rollNo}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Core Technical Highlights */}
          <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
              Kernel /proc Parsing Pipeline
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
              {PROJECT_DETAILS.techStack.map((tech, i) => (
                <span key={i} style={{ fontSize: '0.75rem', padding: '3px 8px', borderRadius: '6px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-subtle)', color: 'var(--text-primary)' }}>
                  {tech}
                </span>
              ))}
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Parses <code className="mono" style={{ color: 'var(--accent-cyan)' }}>/proc/stat</code>, <code className="mono" style={{ color: 'var(--accent-cyan)' }}>/proc/meminfo</code>, and <code className="mono" style={{ color: 'var(--accent-cyan)' }}>/proc/[pid]/stat</code> in microsecond intervals with zero external runtime dependencies.
            </p>
          </div>

        </div>
      </div>

      {/* 2-Column Split: Active Courses & Upcoming Tasks */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '24px' }}>
        
        {/* Semester 4 Courses Progress */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Layers size={18} color="var(--accent-cyan)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Active Courses Syllabus</h3>
            </div>
            <button 
              onClick={() => setActiveTab('courses')} 
              style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              View All <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {COURSES.slice(0, 4).map((course) => (
              <div 
                key={course.id}
                onClick={() => setActiveTab('courses')}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '2px 6px', borderRadius: '4px', background: 'rgba(0, 242, 254, 0.1)', color: course.color, fontFamily: 'var(--font-mono)' }}>
                      {course.code}
                    </span>
                    <strong style={{ fontSize: '0.88rem', color: '#ffffff' }}>{course.name}</strong>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    {course.progress}%
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                  <span>{course.instructor} • {course.room}</span>
                  <span>Attn: {course.attendance}%</span>
                </div>

                <div style={{ width: '100%', height: '5px', background: 'rgba(255, 255, 255, 0.06)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${course.progress}%`, height: '100%', background: course.gradient, borderRadius: '3px' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines & Submission Tracker */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Clock size={18} color="var(--accent-amber)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Deliverables & Lab Deadlines</h3>
            </div>
            <button 
              onClick={() => setActiveTab('assignments')} 
              style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Manage <ArrowUpRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {ASSIGNMENTS.slice(0, 4).map((asg) => (
              <div 
                key={asg.id}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  background: asg.status === 'submitted' ? 'rgba(16, 185, 129, 0.04)' : 'rgba(255, 255, 255, 0.02)',
                  border: asg.status === 'submitted' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                      {asg.courseCode}
                    </span>
                    <span className={`badge ${asg.priority === 'urgent' ? 'badge-rose' : asg.priority === 'high' ? 'badge-amber' : 'badge-cyan'}`} style={{ fontSize: '0.65rem' }}>
                      {asg.priority}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {asg.title}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Due: {asg.dueDate} • {asg.weightage}
                  </div>
                </div>

                <div>
                  {asg.status === 'submitted' ? (
                    <span className="badge badge-emerald" style={{ fontSize: '0.72rem' }}>
                      <CheckCircle size={12} /> {asg.grade ? `${asg.grade} (${asg.score}/${asg.maxScore})` : 'Submitted'}
                    </span>
                  ) : (
                    <button 
                      onClick={() => setActiveTab('assignments')}
                      className="btn btn-outline" 
                      style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                    >
                      Submit
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Scratchpad Quick Notes */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Zap size={18} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Quick Study Notes & Scratchpad</h3>
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {quickNotes.length} Active Notes
          </span>
        </div>

        <form onSubmit={addNote} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
          <input
            type="text"
            placeholder="Type a quick study reminder or formula (e.g. Inode direct blocks pointer math)..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 16px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              color: '#ffffff',
              fontSize: '0.85rem',
              outline: 'none',
            }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '10px 18px' }}>
            <Plus size={16} /> Add Note
          </button>
        </form>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {quickNotes.map((note, index) => (
            <div 
              key={index}
              style={{
                padding: '12px 14px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '10px',
              }}
            >
              <span style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
                {note}
              </span>
              <button 
                onClick={() => removeNote(index)}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
                title="Delete note"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
