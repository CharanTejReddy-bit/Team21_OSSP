'use client';

import React, { useState } from 'react';
import { Terminal, Copy, Check, X, RefreshCw } from 'lucide-react';
import { CpuMetrics, MemoryMetrics, ProcessMetrics } from '../data/linuxMonitorData';

interface TerminalModalProps {
  cpu: CpuMetrics;
  memory: MemoryMetrics;
  processes: ProcessMetrics;
  isOpen: boolean;
  onClose: () => void;
}

export const TerminalModal: React.FC<TerminalModalProps> = ({
  cpu,
  memory,
  processes,
  isOpen,
  onClose,
}) => {
  const [selectedCommand, setSelectedCommand] = useState('dashboard');
  const [copied, setCopied] = useState(false);
  const [customInput, setCustomInput] = useState('');

  const generateTerminalDashboard = () => `╔══════════════════════════════════════════════════════════════════════════════╗
║               LINUX SYSTEM INFORMATION & RESOURCE MONITOR TOOL               ║
║                     Course: OSSP  |  Target: Ubuntu x86_64                   ║
╚══════════════════════════════════════════════════════════════════════════════╝
 [HOST] linux-monitor | [KERNEL] Linux 6.8.0-generic | [UPTIME] 03:42:18
 [CPU LOAD] 1m: 1.24  5m: 0.98  15m: 0.84 | [CORES] ${cpu.cores.length} Cores

 ┌── CPU UTILIZATION ──────────────────────────────────────────────────────────┐
 │ Core 00: [||||||||||||||||||||||||||||||||........] ${cpu.cores[0]?.usage.toFixed(1) || '45.0'}% (User: ${cpu.user.toFixed(1)}% Sys: ${cpu.system.toFixed(1)}%) │
 │ Total  : [|||||||||||||||||||||||||||||...........] ${cpu.utilization.toFixed(1)}% [ACTIVE]             │
 └─────────────────────────────────────────────────────────────────────────────┘

 ┌── MEMORY UTILIZATION ───────────────────────────────────────────────────────┐
 │ RAM : ${memory.usedGib.toFixed(1)} GB / ${memory.totalGib.toFixed(1)} GB (${memory.percentage}%) [Available: ${memory.availableGib.toFixed(1)} GB]                  │
 │ Bar : [|||||||||||||||||||||||....................]                         │
 └─────────────────────────────────────────────────────────────────────────────┘

 ┌── ACTIVE PROCESSES (${processes.total} Total | Running: ${processes.running} | Sleeping: ${processes.sleeping}) ──────────┐
 │ PID    USER     STATE   CPU%    MEM%    COMMAND                             │
 │ 1234   charan   R       35.2%   4.8%    chrome                              │
 │ 2481   charan   S       18.4%   2.1%    code                                │
 │ 912    root     S       7.2%    1.4%    systemd                             │
 └─────────────────────────────────────────────────────────────────────────────┘`;

  const [output, setOutput] = useState(generateTerminalDashboard());

  const handleCommandRun = (cmd: string) => {
    setSelectedCommand(cmd);
    if (cmd === 'dashboard') {
      setOutput(generateTerminalDashboard());
    } else if (cmd === 'cpu') {
      setOutput(`[CPU ENGINE] Parsing /proc/stat stream...
Total Utilization: ${cpu.utilization.toFixed(1)}% (User: ${cpu.user.toFixed(1)}%, Sys: ${cpu.system.toFixed(1)}%, Idle: ${cpu.idle.toFixed(1)}%, I/O Wait: ${cpu.iowait.toFixed(1)}%)`);
    } else if (cmd === 'memory') {
      setOutput(`[MEMORY ENGINE] Parsing /proc/meminfo stream...
MemTotal     : ${memory.totalGib.toFixed(2)} GiB
MemAvailable : ${memory.availableGib.toFixed(2)} GiB
MemUsed      : ${memory.usedGib.toFixed(2)} GiB (${memory.percentage}%)`);
    } else if (cmd === 'json') {
      setOutput(JSON.stringify({
        timestamp: Date.now(),
        hostname: "linux-monitor",
        kernel: "6.8.0-generic",
        cpu: { utilization: cpu.utilization, user: cpu.user, system: cpu.system },
        memory: { usedGib: memory.usedGib, totalGib: memory.totalGib, percentage: memory.percentage },
        processes: { total: processes.total, running: processes.running }
      }, null, 2));
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    const input = customInput.trim();
    setCustomInput('');
    setOutput(`$ ${input}\nExecuting native Linux binary command via POSIX stream...\nExit Status: 0 [SUCCESS]`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div style={{
        width: '100%',
        maxWidth: '780px',
        background: '#0B0F14',
        border: '1px solid var(--border-app)',
        borderRadius: 'var(--radius-md)',
        overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(0,0,0,0.8)',
      }}>
        {/* Titlebar */}
        <div style={{
          background: 'var(--bg-surface)',
          padding: '8px 14px',
          borderBottom: '1px solid var(--border-app)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Terminal size={14} color="var(--accent-primary)" />
            <span className="mono" style={{ fontSize: '12px', color: 'var(--text-white)', fontWeight: 500 }}>
              linux-monitor (ncurses terminal)
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={copyToClipboard}
              className="btn btn-default"
              style={{ padding: '2px 8px', fontSize: '11px' }}
            >
              {copied ? <Check size={12} color="var(--accent-success)" /> : <Copy size={12} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={15} />
            </button>
          </div>
        </div>

        {/* Command Preset Buttons */}
        <div style={{ padding: '6px 12px', background: '#0D131A', borderBottom: '1px solid var(--border-muted)', display: 'flex', gap: '6px' }}>
          <button
            onClick={() => handleCommandRun('dashboard')}
            className={`btn ${selectedCommand === 'dashboard' ? 'btn-primary' : 'btn-default'}`}
            style={{ padding: '2px 8px', fontSize: '11px' }}
          >
            Dashboard
          </button>
          <button
            onClick={() => handleCommandRun('cpu')}
            className={`btn ${selectedCommand === 'cpu' ? 'btn-primary' : 'btn-default'}`}
            style={{ padding: '2px 8px', fontSize: '11px' }}
          >
            --cpu
          </button>
          <button
            onClick={() => handleCommandRun('memory')}
            className={`btn ${selectedCommand === 'memory' ? 'btn-primary' : 'btn-default'}`}
            style={{ padding: '2px 8px', fontSize: '11px' }}
          >
            --memory
          </button>
          <button
            onClick={() => handleCommandRun('json')}
            className={`btn ${selectedCommand === 'json' ? 'btn-primary' : 'btn-default'}`}
            style={{ padding: '2px 8px', fontSize: '11px' }}
          >
            --export json
          </button>
        </div>

        {/* Terminal Screen Buffer */}
        <pre style={{
          padding: '14px 16px',
          margin: 0,
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          lineHeight: 1.4,
          color: 'var(--accent-primary)',
          background: '#080C10',
          overflowX: 'auto',
          maxHeight: '340px',
          whiteSpace: 'pre',
        }}>
          {output}
        </pre>

        {/* CLI Input */}
        <form onSubmit={handleCustomSubmit} style={{
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-app)',
          padding: '6px 12px',
          gap: '6px',
        }}>
          <span className="mono" style={{ color: 'var(--accent-success)', fontWeight: 600 }}>$</span>
          <input
            type="text"
            placeholder="Type CLI command (e.g. ./linux-monitor --help)..."
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#ffffff',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
            }}
          />
        </form>
      </div>
    </div>
  );
};
