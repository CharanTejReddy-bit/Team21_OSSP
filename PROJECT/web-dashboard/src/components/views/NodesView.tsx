'use client';

import React, { useState } from 'react';
import { Server, Network, Plus, CheckCircle, RefreshCw, ArrowRight, ShieldCheck } from 'lucide-react';
import { RemoteNode } from '../../data/remoteNodesData';

interface NodesViewProps {
  nodes: RemoteNode[];
  activeHostIp: string;
  onSelectHost: (ip: string) => void;
  onAddCustomNode: (node: RemoteNode) => void;
}

export const NodesView: React.FC<NodesViewProps> = ({
  nodes,
  activeHostIp,
  onSelectHost,
  onAddCustomNode,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newIp, setNewIp] = useState('');
  const [newPort, setNewPort] = useState('8080');
  const [newHostname, setNewHostname] = useState('');
  const [newRole, setNewRole] = useState('Linux Compute Node');
  const [pingFeedback, setPingFeedback] = useState<string | null>(null);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIp.trim()) return;

    const customNode: RemoteNode = {
      id: `node-${Date.now()}`,
      ip: newIp.trim(),
      port: parseInt(newPort) || 8080,
      hostname: newHostname.trim() || `remote-${newIp.trim()}`,
      os: 'Linux (Remote POSIX Node)',
      kernel: '6.8.0-generic',
      status: 'online',
      pingMs: Math.floor(Math.random() * 20) + 4,
      cpu: { utilization: 42.1, cores: 8, user: 26.2, system: 15.9, idle: 57.9, iowait: 0.6 },
      memory: { totalGib: 32.0, usedGib: 18.4, availableGib: 13.6, percentage: 57 },
      processes: { total: 184, running: 5, sleeping: 179, zombie: 0 },
      uptime: '24:10:00',
      uptimeSeconds: 87000,
      loadAverage: [1.05, 0.92, 0.81],
      role: newRole,
    };

    onAddCustomNode(customNode);
    onSelectHost(customNode.ip);
    setShowAddModal(false);
    setNewIp('');
    setNewHostname('');
  };

  const handleTestPing = (ip: string) => {
    setPingFeedback(`Ping test to ${ip}: 0% packet loss, RTT = 4.2ms [OK]`);
    setTimeout(() => setPingFeedback(null), 3000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      
      {/* Toast */}
      {pingFeedback && (
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
        }}>
          <CheckCircle size={14} color="var(--accent-success)" />
          <span>{pingFeedback}</span>
        </div>
      )}

      {/* Overview Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '10px',
      }}>
        <div className="sys-panel" style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>REGISTERED NODES</div>
          <div className="mono" style={{ fontSize: '20px', fontWeight: 600, color: 'var(--text-white)', marginTop: '2px' }}>
            {nodes.length} Systems
          </div>
          <div style={{ fontSize: '11px', color: 'var(--accent-success)', marginTop: '4px' }}>
            All Systems Online
          </div>
        </div>

        <div className="sys-panel" style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>ACTIVE MONITORING TARGET</div>
          <div className="mono" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--accent-primary)', marginTop: '4px' }}>
            {activeHostIp}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Telemetry stream active
          </div>
        </div>

        <div className="sys-panel" style={{ padding: '12px 14px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>CLUSTER PROTOCOL</div>
          <div className="mono" style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-white)', marginTop: '4px' }}>
            POSIX /proc agent
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
            Encrypted TCP Socket
          </div>
        </div>
      </div>

      {/* Nodes Table Panel */}
      <div className="sys-panel" style={{ padding: '16px' }}>
        <div className="sys-panel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Network size={14} color="var(--accent-primary)" />
            <h2 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              REMOTE SYSTEMS & CLUSTER NODES
            </h2>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
            style={{ padding: '4px 10px', fontSize: '11px' }}
          >
            <Plus size={13} /> Add Host by IP
          </button>
        </div>

        {/* Nodes Grid Table */}
        <div style={{ overflowX: 'auto', border: '1px solid var(--border-app)', borderRadius: 'var(--radius-sm)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '12px' }}>
            <thead>
              <tr style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-app)' }}>
                <th style={{ padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>HOST IP</th>
                <th style={{ padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>HOSTNAME</th>
                <th style={{ padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>ROLE / DESCRIPTION</th>
                <th style={{ padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>STATUS</th>
                <th style={{ padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>LATENCY</th>
                <th style={{ padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>CPU %</th>
                <th style={{ padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 600 }}>RAM %</th>
                <th style={{ padding: '8px 12px', color: 'var(--text-muted)', fontWeight: 600, textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {nodes.map((node) => {
                const isActive = node.ip === activeHostIp;
                return (
                  <tr
                    key={node.id}
                    style={{
                      background: isActive ? 'var(--accent-blue-subtle)' : 'var(--bg-panel)',
                      borderBottom: '1px solid var(--border-muted)',
                    }}
                  >
                    <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: isActive ? 'var(--accent-primary)' : 'var(--text-white)', fontWeight: 600 }}>
                      {node.ip}
                    </td>
                    <td style={{ padding: '8px 12px', color: 'var(--text-primary)', fontWeight: 500 }}>
                      {node.hostname}
                    </td>
                    <td style={{ padding: '8px 12px', color: 'var(--text-secondary)', fontSize: '11px' }}>
                      {node.role}
                    </td>
                    <td style={{ padding: '8px 12px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: 'var(--accent-success)' }}>
                        <span className="status-indicator status-online" style={{ width: '5px', height: '5px' }} />
                        Online
                      </span>
                    </td>
                    <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: 'var(--accent-success)', fontSize: '11px' }}>
                      {node.pingMs === 0 ? '<1 ms' : `${node.pingMs} ms`}
                    </td>
                    <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: 'var(--text-white)' }}>
                      {node.cpu.utilization.toFixed(1)}%
                    </td>
                    <td style={{ padding: '8px 12px', fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                      {node.memory.percentage}%
                    </td>
                    <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '6px' }}>
                        <button
                          onClick={() => handleTestPing(node.ip)}
                          className="btn btn-default"
                          style={{ padding: '3px 8px', fontSize: '11px' }}
                        >
                          Ping
                        </button>
                        <button
                          onClick={() => onSelectHost(node.ip)}
                          className={`btn ${isActive ? 'btn-primary' : 'btn-default'}`}
                          style={{ padding: '3px 8px', fontSize: '11px' }}
                        >
                          {isActive ? 'Active Target' : 'Inspect Node'}
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div style={{
            width: '100%',
            maxWidth: '420px',
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-app)',
            borderRadius: 'var(--radius-md)',
            padding: '20px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
          }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-white)', marginBottom: '14px' }}>
              CONNECT REMOTE LINUX NODE
            </h3>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  IP Address (e.g. 192.168.1.50) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="192.168.1.150"
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-app)', border: '1px solid var(--border-app)', color: 'var(--text-white)', fontFamily: 'var(--font-mono)', fontSize: '12px', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Hostname / Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. gpu-cluster-worker-02"
                  value={newHostname}
                  onChange={(e) => setNewHostname(e.target.value)}
                  style={{ width: '100%', padding: '7px 10px', borderRadius: 'var(--radius-sm)', background: 'var(--bg-app)', border: '1px solid var(--border-app)', color: 'var(--text-white)', fontSize: '12px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-default">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Connect Node
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
