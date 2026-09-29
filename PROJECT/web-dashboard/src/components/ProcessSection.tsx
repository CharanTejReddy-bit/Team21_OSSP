'use client';

import React, { useState } from 'react';
import { Search, RefreshCw, X, ShieldAlert, CheckCircle2, ChevronRight } from 'lucide-react';
import { ProcessItem } from '../data/linuxMonitorData';

interface ProcessSectionProps {
  processes: ProcessItem[];
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ processes: initialProcesses }) => {
  const [processesList, setProcessesList] = useState<ProcessItem[]>(initialProcesses);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'cpu' | 'mem' | 'pid'>('cpu');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedPid, setSelectedPid] = useState<number | null>(initialProcesses[0]?.pid || null);

  // Confirmation Modal
  const [confirmModal, setConfirmModal] = useState<{ pid: number; command: string; signal: 'SIGTERM' | 'SIGKILL' } | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync initialProcesses when parent updates
  React.useEffect(() => {
    setProcessesList(initialProcesses);
  }, [initialProcesses]);

  const handleSort = (field: 'cpu' | 'mem' | 'pid') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const filteredProcesses = processesList
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

  const selectedProcess = processesList.find((p) => p.pid === selectedPid) || filteredProcesses[0] || null;

  const handleConfirmSignal = () => {
    if (!confirmModal) return;
    const { pid, command, signal } = confirmModal;

    setProcessesList((prev) => prev.filter((p) => p.pid !== pid));
    if (selectedPid === pid) {
      setSelectedPid(null);
    }
    setConfirmModal(null);
    setToastMessage(`Signal ${signal} sent to process ${pid} (${command})`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="sys-panel" style={{ padding: '16px' }}>
      
      {/* Toast Feedback */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          background: 'var(--bg-panel)',
          border: '1px solid var(--accent-primary)',
          color: 'var(--text-white)',
          padding: '8px 14px',
          borderRadius: 'var(--radius-sm)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
        }}>
          <CheckCircle2 size={14} color="var(--accent-success)" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Tool Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        marginBottom: '12px',
        paddingBottom: '8px',
        borderBottom: '1px solid var(--border-muted)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h2 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            ACTIVE PROCESSES
          </h2>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            ({filteredProcesses.length} scanned)
          </span>
        </div>

        {/* Filter and Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {/* Search Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--bg-app)',
            border: '1px solid var(--border-app)',
            borderRadius: 'var(--radius-sm)',
            padding: '3px 8px',
            width: '180px',
          }}>
            <Search size={12} color="var(--text-muted)" />
            <input
              type="text"
              placeholder="Search command, PID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontSize: '12px',
                outline: 'none',
                width: '100%',
              }}
            />
          </div>

          {/* Quick Sort Controls */}
          <button
            onClick={() => handleSort('cpu')}
            className={`btn ${sortBy === 'cpu' ? 'btn-primary' : 'btn-default'}`}
            style={{ padding: '3px 8px', fontSize: '11px' }}
          >
            CPU {sortBy === 'cpu' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          <button
            onClick={() => handleSort('mem')}
            className={`btn ${sortBy === 'mem' ? 'btn-primary' : 'btn-default'}`}
            style={{ padding: '3px 8px', fontSize: '11px' }}
          >
            MEM {sortBy === 'mem' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
          <button
            onClick={() => handleSort('pid')}
            className={`btn ${sortBy === 'pid' ? 'btn-primary' : 'btn-default'}`}
            style={{ padding: '3px 8px', fontSize: '11px' }}
          >
            PID {sortBy === 'pid' && (sortOrder === 'desc' ? '↓' : '↑')}
          </button>
        </div>
      </div>

      {/* Main Table Layout + Selected Process Inspector */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedProcess ? '1fr 280px' : '1fr', gap: '14px' }}>
        
        {/* Dense Table */}
        <div style={{ overflowX: 'auto', border: '1px solid var(--border-app)', borderRadius: 'var(--radius-sm)', maxHeight: '380px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-surface)' }}>
              <tr style={{ borderBottom: '1px solid var(--border-app)' }}>
                <th style={{ padding: '7px 10px', color: 'var(--text-muted)', fontWeight: 600 }}>PID</th>
                <th style={{ padding: '7px 10px', color: 'var(--text-muted)', fontWeight: 600 }}>USER</th>
                <th style={{ padding: '7px 10px', color: 'var(--text-muted)', fontWeight: 600 }}>CPU %</th>
                <th style={{ padding: '7px 10px', color: 'var(--text-muted)', fontWeight: 600 }}>MEM %</th>
                <th style={{ padding: '7px 10px', color: 'var(--text-muted)', fontWeight: 600 }}>STATE</th>
                <th style={{ padding: '7px 10px', color: 'var(--text-muted)', fontWeight: 600 }}>COMMAND</th>
              </tr>
            </thead>
            <tbody>
              {filteredProcesses.map((proc, index) => {
                const isSelected = selectedPid === proc.pid;
                const stateColor = proc.state === 'R' ? 'var(--accent-success)' : proc.state === 'Z' ? 'var(--accent-danger)' : 'var(--text-muted)';
                const rowBg = isSelected ? 'var(--accent-blue-subtle)' : index % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-panel)';

                return (
                  <tr
                    key={proc.pid}
                    onClick={() => setSelectedPid(proc.pid)}
                    style={{
                      background: rowBg,
                      borderBottom: '1px solid var(--border-muted)',
                      cursor: 'pointer',
                      transition: 'background 0.1s ease',
                    }}
                  >
                    <td style={{ padding: '7px 10px', fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)', fontWeight: 500 }}>
                      {proc.pid}
                    </td>
                    <td style={{ padding: '7px 10px', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>
                      {proc.user}
                    </td>
                    <td style={{ padding: '7px 10px', fontFamily: 'var(--font-mono)', color: proc.cpu > 15 ? 'var(--accent-warning)' : 'var(--text-white)' }}>
                      {proc.cpu.toFixed(1)}
                    </td>
                    <td style={{ padding: '7px 10px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                      {proc.mem.toFixed(1)}
                    </td>
                    <td style={{ padding: '7px 10px' }}>
                      <span style={{
                        padding: '1px 4px',
                        borderRadius: '2px',
                        border: `1px solid ${stateColor}`,
                        color: stateColor,
                        fontSize: '10px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 600,
                      }}>
                        {proc.state}
                      </span>
                    </td>
                    <td style={{ padding: '7px 10px', fontFamily: 'var(--font-mono)', color: 'var(--text-white)', fontWeight: 500 }}>
                      {proc.command}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Selected Process Inspector Panel */}
        {selectedProcess && (
          <div style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-app)',
            borderRadius: 'var(--radius-sm)',
            padding: '12px 14px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', paddingBottom: '6px', borderBottom: '1px solid var(--border-muted)' }}>
                <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  PROCESS DETAILS
                </span>
                <span className="mono" style={{ fontSize: '11px', color: 'var(--accent-primary)', fontWeight: 600 }}>
                  PID {selectedProcess.pid}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
                <div className="data-row">
                  <span style={{ color: 'var(--text-muted)' }}>Name</span>
                  <span className="mono" style={{ color: 'var(--text-white)', fontWeight: 500 }}>{selectedProcess.command}</span>
                </div>
                <div className="data-row">
                  <span style={{ color: 'var(--text-muted)' }}>User</span>
                  <span className="mono" style={{ color: 'var(--text-secondary)' }}>{selectedProcess.user}</span>
                </div>
                <div className="data-row">
                  <span style={{ color: 'var(--text-muted)' }}>State</span>
                  <span className="mono" style={{ color: selectedProcess.state === 'R' ? 'var(--accent-success)' : 'var(--text-secondary)' }}>
                    {selectedProcess.state === 'R' ? 'Running' : selectedProcess.state === 'S' ? 'Sleeping' : selectedProcess.state === 'Z' ? 'Zombie' : selectedProcess.state}
                  </span>
                </div>
                <div className="data-row">
                  <span style={{ color: 'var(--text-muted)' }}>CPU %</span>
                  <span className="mono" style={{ color: 'var(--text-white)' }}>{selectedProcess.cpu.toFixed(1)}%</span>
                </div>
                <div className="data-row">
                  <span style={{ color: 'var(--text-muted)' }}>Memory %</span>
                  <span className="mono" style={{ color: 'var(--text-white)' }}>{selectedProcess.mem.toFixed(1)}%</span>
                </div>
                <div className="data-row">
                  <span style={{ color: 'var(--text-muted)' }}>RSS</span>
                  <span className="mono" style={{ color: 'var(--accent-success)' }}>{selectedProcess.rssMb} MiB</span>
                </div>
                <div className="data-row">
                  <span style={{ color: 'var(--text-muted)' }}>Virtual Mem</span>
                  <span className="mono" style={{ color: 'var(--text-secondary)' }}>{selectedProcess.vmsizeMb} MiB</span>
                </div>
                <div className="data-row">
                  <span style={{ color: 'var(--text-muted)' }}>Command</span>
                  <span className="mono" style={{ color: 'var(--text-muted)', fontSize: '11px', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    /usr/bin/{selectedProcess.command}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Controls */}
            <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid var(--border-muted)', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <button
                  onClick={() => setConfirmModal({ pid: selectedProcess.pid, command: selectedProcess.command, signal: 'SIGTERM' })}
                  className="btn btn-default"
                  style={{ fontSize: '11px', color: 'var(--accent-warning)', borderColor: 'rgba(245, 158, 11, 0.3)' }}
                >
                  Send SIGTERM
                </button>
                <button
                  onClick={() => setConfirmModal({ pid: selectedProcess.pid, command: selectedProcess.command, signal: 'SIGKILL' })}
                  className="btn btn-danger"
                  style={{ fontSize: '11px' }}
                >
                  Send SIGKILL
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Confirmation Modal */}
      {confirmModal && (
        <div className="modal-overlay">
          <div style={{
            width: '100%',
            maxWidth: '420px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-app)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <ShieldAlert size={18} color={confirmModal.signal === 'SIGKILL' ? 'var(--accent-danger)' : 'var(--accent-warning)'} />
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-white)' }}>
                {confirmModal.signal === 'SIGKILL'
                  ? `Send SIGKILL to PID ${confirmModal.pid}?`
                  : `Terminate PID ${confirmModal.pid}?`}
              </h3>
            </div>

            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '18px' }}>
              {confirmModal.signal === 'SIGKILL'
                ? `Send uncatchable SIGKILL (Signal 9) to '${confirmModal.command}'. Process will terminate immediately.`
                : `Send graceful SIGTERM (Signal 15) to '${confirmModal.command}'.`}
            </p>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <button onClick={() => setConfirmModal(null)} className="btn btn-default">
                Cancel
              </button>
              <button
                onClick={handleConfirmSignal}
                className={confirmModal.signal === 'SIGKILL' ? 'btn btn-danger' : 'btn btn-primary'}
              >
                {confirmModal.signal === 'SIGKILL' ? 'Confirm Kill' : 'Send SIGTERM'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
