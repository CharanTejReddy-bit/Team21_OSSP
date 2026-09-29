'use client';

import React, { useState } from 'react';
import { Search, CheckCircle, ShieldAlert, X } from 'lucide-react';
import { ProcessItem } from '../data/linuxMonitorData';

interface ProcessTableProps {
  processes: ProcessItem[];
}

export const ProcessTable: React.FC<ProcessTableProps> = ({ processes: initialProcesses }) => {
  const [processes, setProcesses] = useState<ProcessItem[]>(initialProcesses);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'cpu' | 'mem' | 'pid'>('cpu');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Modals
  const [confirmModal, setConfirmModal] = useState<{ pid: number; command: string; signal: 'SIGTERM' | 'SIGKILL' } | null>(null);
  const [viewProcess, setViewProcess] = useState<ProcessItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleSort = (field: 'cpu' | 'mem' | 'pid') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const filteredProcesses = processes
    .filter((p) => {
      const q = searchQuery.toLowerCase();
      return (
        p.command.toLowerCase().includes(q) ||
        p.user.toLowerCase().includes(q) ||
        p.pid.toString().includes(q)
      );
    })
    .sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (sortOrder === 'asc') return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });

  const handleSendSignal = () => {
    if (!confirmModal) return;
    const { pid, command, signal } = confirmModal;

    setProcesses((prev) => prev.filter((p) => p.pid !== pid));
    setConfirmModal(null);
    setToastMessage(`Sent ${signal} to PID ${pid} [${command}]`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="sys-card" style={{ padding: '18px 20px' }}>
      
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          color: '#ffffff',
          padding: '10px 16px',
          borderRadius: '6px',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.8rem',
        }}>
          <CheckCircle size={15} color="var(--accent-emerald)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
        <div>
          <h3 style={{ fontSize: '0.86rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Processes
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Search Input */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '4px',
            padding: '4px 8px',
            width: '180px',
          }}>
            <Search size={13} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Filter processes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ffffff',
                fontSize: '0.74rem',
                outline: 'none',
                width: '100%',
              }}
            />
          </div>

          {/* Sort Buttons */}
          <button
            onClick={() => handleSort('cpu')}
            className={`btn ${sortBy === 'cpu' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '4px 8px', fontSize: '0.72rem' }}
          >
            CPU {sortBy === 'cpu' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          <button
            onClick={() => handleSort('mem')}
            className={`btn ${sortBy === 'mem' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '4px 8px', fontSize: '0.72rem' }}
          >
            MEM {sortBy === 'mem' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          <button
            onClick={() => handleSort('pid')}
            className={`btn ${sortBy === 'pid' ? 'btn-primary' : 'btn-outline'}`}
            style={{ padding: '4px 8px', fontSize: '0.72rem' }}
          >
            PID {sortBy === 'pid' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: '6px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.78rem' }}>
          <thead>
            <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-subtle)' }}>
              <th style={{ padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>PID</th>
              <th style={{ padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>USER</th>
              <th style={{ padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>CPU %</th>
              <th style={{ padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>MEM %</th>
              <th style={{ padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>STATE</th>
              <th style={{ padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>COMMAND</th>
              <th style={{ padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'right' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredProcesses.map((proc) => {
              const stateColor = proc.state === 'R' ? 'var(--accent-emerald)' : proc.state === 'Z' ? 'var(--accent-rose)' : 'var(--text-muted)';
              return (
                <tr key={proc.pid} style={{ borderBottom: '1px solid var(--border-muted)' }}>
                  <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                    {proc.pid}
                  </td>
                  <td style={{ padding: '8px 12px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {proc.user}
                  </td>
                  <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: '#ffffff' }}>
                    {proc.cpu.toFixed(1)}%
                  </td>
                  <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                    {proc.mem.toFixed(1)}%
                  </td>
                  <td style={{ padding: '8px 12px' }}>
                    <span style={{
                      padding: '1px 5px',
                      borderRadius: '3px',
                      border: `1px solid ${stateColor}`,
                      color: stateColor,
                      fontSize: '0.68rem',
                      fontFamily: 'var(--font-mono)',
                    }}>
                      {proc.state}
                    </span>
                  </td>
                  <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: '#ffffff' }}>
                    {proc.command}
                  </td>
                  <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '4px' }}>
                      <button
                        onClick={() => setViewProcess(proc)}
                        className="btn btn-outline"
                        style={{ padding: '3px 6px', fontSize: '0.68rem' }}
                      >
                        VIEW
                      </button>
                      <button
                        onClick={() => setConfirmModal({ pid: proc.pid, command: proc.command, signal: 'SIGTERM' })}
                        className="btn btn-outline"
                        style={{ padding: '3px 6px', fontSize: '0.68rem' }}
                      >
                        TERM
                      </button>
                      <button
                        onClick={() => setConfirmModal({ pid: proc.pid, command: proc.command, signal: 'SIGKILL' })}
                        className="btn btn-danger"
                        style={{ padding: '3px 6px', fontSize: '0.68rem' }}
                      >
                        KILL
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="modal-backdrop">
          <div style={{
            width: '100%',
            maxWidth: '400px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '20px',
          }}>
            <h3 style={{ fontSize: '0.98rem', fontWeight: 600, color: '#ffffff', marginBottom: '8px' }}>
              {confirmModal.signal === 'SIGKILL' ? `Kill PID ${confirmModal.pid}?` : `Terminate PID ${confirmModal.pid}?`}
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Send {confirmModal.signal} to process '{confirmModal.command}'.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={() => setConfirmModal(null)} className="btn btn-outline">Cancel</button>
              <button onClick={handleSendSignal} className={confirmModal.signal === 'SIGKILL' ? 'btn btn-danger' : 'btn btn-primary'}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {viewProcess && (
        <div className="modal-backdrop">
          <div style={{
            width: '100%',
            maxWidth: '420px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>PID {viewProcess.pid} Details</h3>
              <button onClick={() => setViewProcess(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', fontSize: '0.76rem', marginBottom: '16px' }}>
              <div style={{ background: 'var(--bg-tertiary)', padding: '8px', borderRadius: '4px' }}>
                <div style={{ color: 'var(--text-muted)' }}>COMMAND</div>
                <div className="mono" style={{ color: '#ffffff' }}>{viewProcess.command}</div>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '8px', borderRadius: '4px' }}>
                <div style={{ color: 'var(--text-muted)' }}>USER</div>
                <div className="mono" style={{ color: '#ffffff' }}>{viewProcess.user}</div>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '8px', borderRadius: '4px' }}>
                <div style={{ color: 'var(--text-muted)' }}>RSS MEMORY</div>
                <div className="mono" style={{ color: 'var(--accent-emerald)' }}>{viewProcess.rssMb} MB</div>
              </div>
              <div style={{ background: 'var(--bg-tertiary)', padding: '8px', borderRadius: '4px' }}>
                <div style={{ color: 'var(--text-muted)' }}>THREADS</div>
                <div className="mono" style={{ color: '#ffffff' }}>{viewProcess.threads}</div>
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setViewProcess(null)} className="btn btn-outline">Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
