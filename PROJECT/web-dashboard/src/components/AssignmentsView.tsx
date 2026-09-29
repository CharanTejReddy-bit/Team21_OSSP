'use client';

import React, { useState } from 'react';
import { 
  CheckSquare, 
  Clock, 
  UploadCloud, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  FileCheck, 
  Plus, 
  Trash2, 
  Sparkles,
  Award,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ASSIGNMENTS, Assignment } from '../data/academicData';

export const AssignmentsView: React.FC = () => {
  const [assignments, setAssignments] = useState<Assignment[]>(ASSIGNMENTS);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'submitted'>('all');
  const [activeModalAsg, setActiveModalAsg] = useState<Assignment | null>(null);
  const [uploadFileName, setUploadFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New assignment modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCourse, setNewCourse] = useState('CS401');
  const [newDueDate, setNewDueDate] = useState('');
  const [newPriority, setNewPriority] = useState<'urgent' | 'high' | 'medium' | 'low'>('high');

  const filteredAssignments = assignments.filter((a) => {
    if (filter === 'all') return true;
    return a.status === filter;
  });

  const handleOpenSubmitModal = (asg: Assignment) => {
    setActiveModalAsg(asg);
    setUploadFileName('');
  };

  const handleConfirmSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeModalAsg) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setAssignments((prev) =>
        prev.map((a) =>
          a.id === activeModalAsg.id
            ? { ...a, status: 'submitted', grade: 'Under Review', score: undefined }
            : a
        )
      );
      setActiveModalAsg(null);

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00f2fe', '#7928ca', '#10b981', '#ffffff'],
        });
      } catch (err) {
        console.log(err);
      }
    }, 800);
  };

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newAsg: Assignment = {
      id: `custom-${Date.now()}`,
      courseCode: newCourse,
      courseName: newCourse === 'CS401' ? 'Operating Systems' : 'Algorithm Lab',
      title: newTitle.trim(),
      description: 'Custom added academic deliverable or laboratory milestone.',
      dueDate: newDueDate || '2026-10-20',
      priority: newPriority,
      status: 'pending',
      weightage: '10% of Grade',
      maxScore: 50,
    };

    setAssignments([newAsg, ...assignments]);
    setShowAddModal(false);
    setNewTitle('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Top Header & Filter Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255, 255, 255, 0.03)', padding: '6px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
          {(['all', 'pending', 'in_progress', 'submitted'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: filter === tab ? 'var(--grad-cyan-blue)' : 'transparent',
                color: filter === tab ? '#030712' : 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textTransform: 'capitalize',
              }}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        <button 
          onClick={() => setShowAddModal(true)} 
          className="btn btn-primary"
          style={{ padding: '10px 18px', fontSize: '0.85rem' }}
        >
          <Plus size={16} /> Track New Assignment
        </button>
      </div>

      {/* Deliverables Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
        {filteredAssignments.map((asg) => (
          <div
            key={asg.id}
            className="glass-panel"
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              border: asg.status === 'submitted' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '3px 8px', borderRadius: '4px', background: 'rgba(0, 242, 254, 0.1)', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                  {asg.courseCode}
                </span>
                <span className={`badge ${asg.priority === 'urgent' ? 'badge-rose' : asg.priority === 'high' ? 'badge-amber' : 'badge-cyan'}`} style={{ fontSize: '0.68rem' }}>
                  {asg.priority}
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
                {asg.title}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                {asg.description}
              </p>
            </div>

            <div style={{ paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Calendar size={14} /> Due: {asg.dueDate}
                </span>
                <span style={{ color: 'var(--accent-purple)', fontWeight: 600 }}>{asg.weightage}</span>
              </div>

              {asg.status === 'submitted' ? (
                <div style={{
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>
                    <CheckCircle size={15} /> Submitted
                  </div>
                  {asg.score !== undefined && (
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                      Score: {asg.score}/{asg.maxScore} ({asg.grade})
                    </span>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => handleOpenSubmitModal(asg)}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
                >
                  <UploadCloud size={16} /> Submit Deliverable (.zip / .pdf)
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Submission Modal */}
      {activeModalAsg && (
        <div className="modal-overlay">
          <div style={{
            width: '100%',
            maxWidth: '520px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-glow)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px',
            boxShadow: 'var(--shadow-lg), 0 0 30px rgba(0, 242, 254, 0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                  {activeModalAsg.courseCode}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>
                  Submit: {activeModalAsg.title}
                </h3>
              </div>
              <button onClick={() => setActiveModalAsg(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleConfirmSubmission} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Dropzone mockup */}
              <div style={{
                border: '2px dashed rgba(0, 242, 254, 0.4)',
                borderRadius: '12px',
                padding: '28px',
                textAlign: 'center',
                background: 'rgba(0, 242, 254, 0.02)',
                cursor: 'pointer',
              }}
              onClick={() => setUploadFileName(`${activeModalAsg.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_submission.zip`)}
              >
                <UploadCloud size={36} color="var(--accent-cyan)" style={{ margin: '0 auto 8px auto' }} />
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>
                  {uploadFileName ? uploadFileName : 'Click to attach project archive / lab report'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Supports .zip, .tar.gz, .cpp, .pdf (Max 50MB)
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button type="button" onClick={() => setActiveModalAsg(null)} className="btn btn-outline" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ flex: 1 }}>
                  {isSubmitting ? 'Uploading to Server...' : 'Confirm Submission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Assignment Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div style={{
            width: '100%',
            maxWidth: '480px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-glow)',
            borderRadius: 'var(--radius-lg)',
            padding: '28px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                Track New Academic Task
              </h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateAssignment} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Solve DAA Assignment 3 Dynamic Programming"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-subtle)', color: '#ffffff', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    Course Code
                  </label>
                  <select
                    value={newCourse}
                    onChange={(e) => setNewCourse(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#0e131f', border: '1px solid var(--border-subtle)', color: '#ffffff', outline: 'none' }}
                  >
                    <option value="CS401">CS401 (OSSP)</option>
                    <option value="CS402">CS402 (DAA)</option>
                    <option value="CS403">CS403 (DBMS)</option>
                    <option value="CS404">CS404 (CN)</option>
                    <option value="MA401">MA401 (P&S)</option>
                    <option value="CS405">CS405 (FSWT)</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as any)}
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: '#0e131f', border: '1px solid var(--border-subtle)', color: '#ffffff', outline: 'none' }}
                  >
                    <option value="urgent">Urgent</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>
                  Target Due Date
                </label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-subtle)', color: '#ffffff', outline: 'none' }}
                />
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '10px', padding: '12px' }}>
                Save Task
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
