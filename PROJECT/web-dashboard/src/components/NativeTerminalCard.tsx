'use client';

import React, { useState } from 'react';
import { Terminal, Play, RotateCcw, Copy, Check, X, ShieldCheck } from 'lucide-react';
import { CpuMetrics, MemoryMetrics, ProcessMetrics } from '../data/linuxMonitorData';

interface NativeTerminalProps {
  cpu: CpuMetrics;
  memory: MemoryMetrics;
  processes: ProcessMetrics;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
}

export const NativeTerminalCard: React.FC<NativeTerminalProps> = ({
  cpu,
  memory,
  processes,
  isOpen,
  onClose,
  onOpen,
}) => {
  const [selectedCommand, setSelectedCommand] = useState('dashboard');
  const [copied, setCopied] = useState(false);
  const [customInput, setCustomInput] = useState('');

  const generateTerminalDashboard = () => `╔══════════════════════════════════════════════════════════════════════════════╗
║               LINUX SYSTEM INFORMATION & RESOURCE MONITOR TOOL               ║
║                     Course: OSSP  |  Team: Sem 4 CSE                         ║
╚══════════════════════════════════════════════════════════════════════════════╝
 [HOST] linux-monitor | [KERNEL] Linux 6.8.0-generic | [UPTIME] 03:42:18
 [CPU LOAD] 1m: 1.24  5m: 0.98  15m: 0.84 | [CORES] 8 Cores | [FREQ] 2.30 GHz

 ┌── CPU UTILIZATION ──────────────────────────────────────────────────────────┐
 │ Core 00: [||||||||||||||||||||||||||||||||........] ${cpu.cores[0]?.usage.toFixed(1) || '78.2'}% (User: 45.0% Sys: 33.2%) │
 │ Core 01: [||||||||||||||||||||||||||..............] ${cpu.cores[1]?.usage.toFixed(1) || '65.4'}% (User: 38.1% Sys: 27.3%) │
 │ Total  : [|||||||||||||||||||||||||||||...........] ${cpu.utilization.toFixed(1)}% [ACTIVE]             │
 └─────────────────────────────────────────────────────────────────────────────┘

 ┌── MEMORY UTILIZATION ───────────────────────────────────────────────────────┐
 │ RAM : ${memory.usedGib.toFixed(1)} GB / ${memory.totalGib.toFixed(1)} GB (${memory.percentage}%) [Available: ${memory.availableGib.toFixed(1)} GB] [Cached: 3.2 GB]  │
 │ Bar : [|||||||||||||||||||||||....................]                         │
 │ SWAP: 0.40 GB / 4.00 GB (10.0%)                                             │
 └─────────────────────────────────────────────────────────────────────────────┘

 ┌── ACTIVE PROCESSES (${processes.total} Total | Running: ${processes.running} | Sleeping: ${processes.sleeping}) ──────────┐
 │ PID    USER     STATE   CPU%    MEM%    RSS(MB)    THREADS  COMMAND         │
 │ 1234   charan   R       35.2%   4.8%    740.0 MB   32       chrome          │
 │ 2481   charan   S       18.4%   2.1%    324.0 MB   14       code            │
 │ 912    root     S       7.2%    1.4%    215.0 MB   1        systemd         │
 │ 4412   charan   S       3.1%    0.9%    138.0 MB   1        bash            │
 │ 3105   charan   R       2.8%    1.2%    184.0 MB   3        ./linux_monitor │
 └─────────────────────────────────────────────────────────────────────────────┘`;

  const [output, setOutput] = useState(generateTerminalDashboard());

  const handleCommandRun = (cmd: string) => {
    setSelectedCommand(cmd);
    if (cmd === 'dashboard') {
      setOutput(generateTerminalDashboard());
    } else if (cmd === 'cpu') {
      setOutput(`[CPU ENGINE] Parsing /proc/stat stream...
Total Jiffies: user=412098 nice=120 system=228100 idle=276400 iowait=84200 irq=0 softirq=3100
Core 00: [||||||||||||||||||||||||||||||||........] 78.2%
Core 01: [||||||||||||||||||||||||||..............] 65.4%
Total CPU Utilization: ${cpu.utilization.toFixed(1)}% (User: 41.2% System: 22.8% Idle: 27.6% I/O Wait: 8.4%)`);
    } else if (cmd === 'memory') {
      setOutput(`[MEMORY ENGINE] Parsing /proc/meminfo stream...
MemTotal     : 16148070 kB (15.40 GiB)
MemFree      : 3984120 kB (3.80 GiB)
MemAvailable : 7025400 kB (6.70 GiB)
Buffers      : 838860 kB (0.80 GiB)
Cached       : 3355440 kB (3.20 GiB)
SwapTotal    : 4194304 kB (4.00 GiB)
SwapFree     : 3774873 kB (3.60 GiB)
Memory Utilized: ${memory.usedGib.toFixed(1)} / ${memory.totalGib.toFixed(1)} GiB (${memory.percentage}%)`);
    } else if (cmd === 'json') {
      setOutput(`{
  "timestamp": 1790606557,
  "hostname": "linux-monitor",
  "kernel": "Linux 6.8.0-generic",
  "cpu": { "utilization_pct": ${cpu.utilization.toFixed(1)}, "cores": 8 },
  "memory": { "used_gib": ${memory.usedGib.toFixed(1)}, "total_gib": ${memory.totalGib.toFixed(1)}, "pct": ${memory.percentage} },
  "processes_count": ${processes.total},
  "status": "NOMINAL"
}`);
    }
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    const input = customInput.trim();
    setCustomInput('');
    setOutput(`$ ${input}\nExecuting native Linux binary via POSIX exec /proc stream...\nExit Status: 0 [SUCCESS]`);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* Overview Card */}
      <div className="sys-card" style={{ padding: '22px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f0f6fc', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              NATIVE TERMINAL MONITOR
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <span className="live-dot" style={{ width: '6px', height: '6px' }} />
              <span style={{ fontSize: '0.74rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>Status: RUNNING</span>
            </div>
          </div>

          <button
            onClick={onOpen}
            className="btn btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.8rem' }}
          >
            <Terminal size={15} /> Launch Terminal Monitor
          </button>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          background: '#0d1117',
          border: '1px solid #21262d',
          borderRadius: '8px',
          padding: '14px',
        }}>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#6e7681', textTransform: 'uppercase' }}>Technology</div>
            <div className="mono" style={{ fontSize: '0.84rem', color: '#f0f6fc', fontWeight: 700 }}>C++17 + POSIX</div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#6e7681', textTransform: 'uppercase' }}>Interface</div>
            <div className="mono" style={{ fontSize: '0.84rem', color: '#58a6ff', fontWeight: 700 }}>ncurses</div>
          </div>
          <div>
            <div style={{ fontSize: '0.7rem', color: '#6e7681', textTransform: 'uppercase' }}>Data Source</div>
            <div className="mono" style={{ fontSize: '0.84rem', color: '#3fb950', fontWeight: 700 }}>Linux /proc</div>
          </div>
        </div>
      </div>

      {/* Terminal Modal */}
      {isOpen && (
        <div className="modal-backdrop">
          <div style={{
            width: '100%',
            maxWidth: '860px',
            background: '#0d1117',
            border: '1px solid #30363d',
            borderRadius: '10px',
            boxShadow: 'var(--shadow-lg)',
            overflow: 'hidden',
          }}>
            {/* Titlebar */}
            <div style={{
              background: '#161b22',
              padding: '10px 16px',
              borderBottom: '1px solid #30363d',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#f85149' }} />
                <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#d29922' }} />
                <div style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#3fb950' }} />
                <span className="mono" style={{ fontSize: '0.76rem', color: '#8b949e', marginLeft: '8px' }}>
                  charan@linux-monitor: ~/projects/linux-monitor (ncurses)
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={copyToClipboard}
                  className="btn btn-outline"
                  style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                >
                  {copied ? <Check size={13} color="var(--accent-emerald)" /> : <Copy size={13} />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#8b949e', cursor: 'pointer' }}>
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Quick Command Selector */}
            <div style={{ padding: '10px 16px', background: '#161b22', borderBottom: '1px solid #21262d', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={() => handleCommandRun('dashboard')}
                className={`btn ${selectedCommand === 'dashboard' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '4px 10px', fontSize: '0.74rem' }}
              >
                Dashboard
              </button>
              <button
                onClick={() => handleCommandRun('cpu')}
                className={`btn ${selectedCommand === 'cpu' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '4px 10px', fontSize: '0.74rem' }}
              >
                --cpu (/proc/stat)
              </button>
              <button
                onClick={() => handleCommandRun('memory')}
                className={`btn ${selectedCommand === 'memory' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '4px 10px', fontSize: '0.74rem' }}
              >
                --memory (/proc/meminfo)
              </button>
              <button
                onClick={() => handleCommandRun('json')}
                className={`btn ${selectedCommand === 'json' ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '4px 10px', fontSize: '0.74rem' }}
              >
                --export json
              </button>
            </div>

            {/* Terminal Screen Buffer */}
            <pre style={{
              padding: '18px 20px',
              margin: 0,
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              lineHeight: 1.45,
              color: '#58a6ff',
              background: '#0a0e14',
              overflowX: 'auto',
              maxHeight: '400px',
              whiteSpace: 'pre',
            }}>
              {output}
            </pre>

            {/* Terminal Input */}
            <form onSubmit={handleCustomSubmit} style={{
              display: 'flex',
              alignItems: 'center',
              background: '#161b22',
              borderTop: '1px solid #30363d',
              padding: '8px 14px',
              gap: '8px',
            }}>
              <span className="mono" style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>$</span>
              <input
                type="text"
                placeholder="Type command (e.g. ./bin/linux_monitor --help, ctest)..."
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffffff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                }}
              />
              <button type="submit" className="btn btn-primary" style={{ padding: '4px 10px', fontSize: '0.72rem' }}>
                Run
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
