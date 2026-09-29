'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  FileText, 
  Download, 
  User, 
  Mail, 
  MapPin, 
  Award, 
  Sparkles, 
  ChevronRight, 
  Layers, 
  X,
  ExternalLink
} from 'lucide-react';
import { COURSES, Course } from '../data/academicData';

export const CoursesView: React.FC = () => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(COURSES[0]);
  const [courseList, setCourseList] = useState<Course[]>(COURSES);
  const [downloadToast, setDownloadToast] = useState<string | null>(null);

  const toggleSyllabusItem = (courseId: string, itemIndex: number) => {
    setCourseList((prev) =>
      prev.map((c) => {
        if (c.id !== courseId) return c;
        const updatedSyllabus = [...c.syllabus];
        updatedSyllabus[itemIndex].completed = !updatedSyllabus[itemIndex].completed;
        const completedCount = updatedSyllabus.filter((s) => s.completed).length;
        const newProgress = Math.round((completedCount / updatedSyllabus.length) * 100);
        return { ...c, syllabus: updatedSyllabus, progress: newProgress };
      })
    );

    if (selectedCourse && selectedCourse.id === courseId) {
      setSelectedCourse((prev) => {
        if (!prev) return null;
        const updatedSyllabus = [...prev.syllabus];
        updatedSyllabus[itemIndex].completed = !updatedSyllabus[itemIndex].completed;
        const completedCount = updatedSyllabus.filter((s) => s.completed).length;
        return { ...prev, syllabus: updatedSyllabus, progress: Math.round((completedCount / updatedSyllabus.length) * 100) };
      });
    }
  };

  const handleDownload = (materialTitle: string) => {
    setDownloadToast(`Downloaded: ${materialTitle}`);
    setTimeout(() => setDownloadToast(null), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Toast Notification */}
      {downloadToast && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--accent-emerald)',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '10px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.8)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}>
          <CheckCircle2 size={18} color="var(--accent-emerald)" />
          <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{downloadToast}</span>
        </div>
      )}

      {/* Course Grid Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {courseList.map((course) => {
          const isSelected = selectedCourse?.id === course.id;
          return (
            <div
              key={course.id}
              onClick={() => setSelectedCourse(course)}
              className="glass-panel"
              style={{
                padding: '24px',
                cursor: 'pointer',
                border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                boxShadow: isSelected ? '0 0 25px rgba(0, 242, 254, 0.2)' : 'none',
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '3px 8px',
                    borderRadius: '4px',
                    background: 'rgba(0, 242, 254, 0.1)',
                    color: course.color,
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {course.code}
                  </span>
                  <span className="badge badge-emerald" style={{ fontSize: '0.7rem' }}>
                    Est. {course.gradeEstimated}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                  {course.name}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                  <User size={14} color="var(--text-muted)" />
                  <span>{course.instructor}</span>
                </div>

                {/* Progress bar */}
                <div style={{ marginBottom: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Syllabus Completion</span>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{course.progress}%</span>
                  </div>
                  <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${course.progress}%`, height: '100%', background: course.gradient, borderRadius: '3px' }} />
                  </div>
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-subtle)',
                fontSize: '0.75rem',
                color: 'var(--text-muted)'
              }}>
                <span>{course.credits} Credits • {course.attendance}% Attendance</span>
                <span style={{ color: 'var(--accent-cyan)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '2px' }}>
                  Inspect <ChevronRight size={14} />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Course Deep-Dive Drawer / Panel */}
      {selectedCourse && (
        <div className="glass-panel" style={{ padding: '32px', border: '1px solid var(--border-glow)', position: 'relative' }}>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, padding: '4px 10px', borderRadius: '6px', background: 'rgba(0, 242, 254, 0.15)', color: selectedCourse.color, fontFamily: 'var(--font-mono)' }}>
                  {selectedCourse.code}
                </span>
                <span className="badge badge-purple">{selectedCourse.credits} Academic Credits</span>
                <span className="badge badge-cyan">{selectedCourse.room}</span>
              </div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>
                {selectedCourse.name}
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid var(--border-subtle)', padding: '10px 16px', borderRadius: '10px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Instructor Contact</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                  <Mail size={14} color="var(--accent-cyan)" /> {selectedCourse.instructorEmail}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            
            {/* Interactive Syllabus Checklist */}
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Layers size={16} color="var(--accent-cyan)" /> Interactive Syllabus Tracker
                </h4>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                  {selectedCourse.syllabus.filter(s => s.completed).length} / {selectedCourse.syllabus.length} Completed
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedCourse.syllabus.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => toggleSyllabusItem(selectedCourse.id, index)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: item.completed ? 'rgba(0, 242, 254, 0.04)' : 'rgba(255, 255, 255, 0.02)',
                      border: item.completed ? '1px solid rgba(0, 242, 254, 0.2)' : '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {item.completed ? (
                      <CheckCircle2 size={16} color="var(--accent-cyan)" />
                    ) : (
                      <Circle size={16} color="var(--text-muted)" />
                    )}
                    <span style={{ fontSize: '0.82rem', color: item.completed ? '#ffffff' : 'var(--text-secondary)', textDecoration: item.completed ? 'none' : 'none' }}>
                      {item.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Handouts & Lab Materials */}
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-subtle)', borderRadius: '12px', padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <FileText size={16} color="var(--accent-purple)" /> Handouts & Lab Code
                </h4>
                <span className="badge badge-purple">{selectedCourse.materials.length} Files</span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {selectedCourse.materials.map((mat, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-subtle)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                      <FileText size={16} color="var(--accent-cyan)" />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#ffffff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {mat.title}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                          Format: {mat.type.toUpperCase()} • {mat.size}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDownload(mat.title)}
                      className="btn btn-outline"
                      style={{ padding: '6px 10px', fontSize: '0.75rem', flexShrink: 0 }}
                    >
                      <Download size={13} /> Get
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
