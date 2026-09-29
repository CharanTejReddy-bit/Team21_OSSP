'use client';

import React, { useState } from 'react';
import { Network, Plus, Check, ChevronDown, Server, Activity, X } from 'lucide-react';
import { RemoteNode } from '../data/remoteNodesData';

interface HostSwitcherProps {
  nodes: RemoteNode[];
  activeHostIp: string;
  onSelectHost: (ip: string) => void;
  onAddCustomNode: (newNode: RemoteNode) => void;
}

export const HostSwitcher: React.FC<HostSwitcherProps> = ({
  nodes,
  activeHostIp,
  onSelectHost,
  onAddCustomNode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  
  // New Node Form State
  const [newIp, setNewIp] = useState('');
  const [newPort, setNewPort] = useState('8080');
  const [newHostname, setNewHostname] = useState('');
  const [newRole, setNewRole] = useState('Linux Server Node');

  const activeNode = nodes.find(n => n.ip === activeHostIp) || nodes[0];

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
      cpu: { utilization: 38.4, cores: 8, user: 24.1, system: 14.3, idle: 61.6, iowait: 0.8 },
      memory: { totalGib: 16.0, usedGib: 8.2, availableGib: 7.8, percentage: 51 },
      processes: { total: 160, running: 4, sleeping: 156, zombie: 0 },
      uptime: '18:42:00',
      uptimeSeconds: 67320,
      loadAverage: [0.85, 0.72, 0.64],
      role: newRole,
    };

    onAddCustomNode(customNode);
    onSelectHost(customNode.ip);
    setShowAddModal(false);
    setIsOpen(false);
    setNewIp('');
    setNewHostname('');
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'var(--bg-app)',
          border: '1px solid var(--border-app)',
          borderRadius: 'var(--radius-sm)',
          padding: '4px 10px',
          color: 'var(--text-primary)',
          fontSize: '12px',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
        title="Switch Host or Connect Remote System IP"
      >
        <Network size={13} color="var(--accent-primary)" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="mono" style={{ fontWeight: 600, color: 'var(--text-white)' }}>
            {activeNode.ip}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
            ({activeNode.hostname})
          </span>
        </div>
        <ChevronDown size={12} color="var(--text-muted)" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          <div
            onClick={() => setIsOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 60 }}
          />

          <div style={{
            position: 'absolute',
            top: '36px',
            left: 0,
            width: '320px',
            background: 'var(--bg-panel)',
            border: '1px solid var(--border-app)',
            borderRadius: 'var(--radius-md)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
            padding: '6px',
            zIndex: 70,
          }}>
            <div style={{ padding: '6px 8px', fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', borderBottom: '1px solid var(--border-muted)', marginBottom: '4px' }}>
              TARGET LINUX SYSTEMS
            </div>

            <div style={{ maxHeight: '220px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {nodes.map((node) => {
                const isSelected = node.ip === activeHostIp;
                return (
                  <button
                    key={node.id}
                    onClick={() => {
                      onSelectHost(node.ip);
                      setIsOpen(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '8px 10px',
                      background: isSelected ? 'var(--accent-blue-subtle)' : 'transparent',
                      border: 'none',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      width: '100%',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span className="mono" style={{ fontSize: '12px', fontWeight: 600, color: isSelected ? 'var(--accent-primary)' : 'var(--text-white)' }}>
                          {node.ip}
                        </span>
                        {node.ip === '127.0.0.1' && (
                          <span style={{ fontSize: '10px', background: 'var(--bg-surface)', padding: '1px 4px', borderRadius: '2px', color: 'var(--text-muted)' }}>
                            LOCAL
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {node.hostname} • {node.role}
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '10px', color: 'var(--accent-success)', fontFamily: 'var(--font-mono)' }}>
                        {node.pingMs === 0 ? '0ms' : `${node.pingMs}ms`}
                      </div>
                      {isSelected && <Check size={12} color="var(--accent-primary)" style={{ marginTop: '2px' }} />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Add Custom Host by IP Button */}
            <div style={{ borderTop: '1px solid var(--border-muted)', marginTop: '4px', paddingTop: '4px' }}>
              <button
                onClick={() => {
                  setShowAddModal(true);
                  setIsOpen(false);
                }}
                className="btn btn-default"
                style={{ width: '100%', padding: '6px', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Plus size={12} /> Connect Remote System by IP
              </button>
            </div>
          </div>
        </>
      )}

      {/* Connect Remote Host by IP Modal */}
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
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid var(--border-muted)', paddingBottom: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Server size={14} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-white)' }}>
                  CONNECT REMOTE LINUX HOST
                </h3>
              </div>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={15} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Target IP Address (IPv4 / IPv6) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 192.168.1.150 or 10.0.0.8"
                  value={newIp}
                  onChange={(e) => setNewIp(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-app)',
                    border: '1px solid var(--border-app)',
                    color: 'var(--text-white)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Port
                  </label>
                  <input
                    type="number"
                    value={newPort}
                    onChange={(e) => setNewPort(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-app)',
                      border: '1px solid var(--border-app)',
                      color: 'var(--text-white)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Hostname Alias (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. staging-server-01"
                    value={newHostname}
                    onChange={(e) => setNewHostname(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '7px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-app)',
                      border: '1px solid var(--border-app)',
                      color: 'var(--text-white)',
                      fontSize: '12px',
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Node Role / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Production Web Worker / GPU Node"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-app)',
                    border: '1px solid var(--border-app)',
                    color: 'var(--text-white)',
                    fontSize: '12px',
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-default">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Connect & Inspect
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
