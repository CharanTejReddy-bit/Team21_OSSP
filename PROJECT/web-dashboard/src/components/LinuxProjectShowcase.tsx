'use client';

import React, { useState, useEffect } from 'react';
import { 
  Terminal, 
  Cpu, 
  HardDrive, 
  Activity, 
  Layers, 
  Play, 
  RotateCcw, 
  Copy, 
  Check, 
  Download, 
  FileCode, 
  ShieldAlert, 
  Server, 
  Users,
  Code2,
  Sparkles
} from 'lucide-react';
import { PROJECT_DETAILS } from '../data/academicData';

export const LinuxProjectShowcase: React.FC = () => {
  const [selectedCommand, setSelectedCommand] = useState<string>('dashboard');
  const [terminalOutput, setTerminalOutput] = useState<string>(PROJECT_DETAILS.terminalPreview.output);
  const [copied, setCopied] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [liveCpuLoad, setLiveCpuLoad] = useState({ core0: 48.2, core1: 32.5, total: 40.35, ram: 35.2 });

  // Live simulation jitter effect
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCpuLoad({
        core0: +(40 + Math.random() * 25).toFixed(1),
        core1: +(25 + Math.random() * 20).toFixed(1),
        total: +(32 + Math.random() * 20).toFixed(1),
        ram: +(34.8 + Math.random() * 1.5).toFixed(1),
      });
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const commandsList = [
    { id: 'dashboard', label: 'Interactive Live Dashboard', cmd: './bin/linux_monitor --dashboard' },
    { id: 'cpu', label: 'CPU Cores & /proc/stat', cmd: './bin/linux_monitor --cpu' },
    { id: 'memory', label: 'RAM & Virtual Memory', cmd: './bin/linux_monitor --memory' },
    { id: 'processes', label: 'Process Inspector (Top)', cmd: './bin/linux_monitor --processes' },
    { id: 'json', label: 'Headless JSON Snapshot', cmd: './bin/linux_monitor --export json' },
    { id: 'test', label: 'Run Unit Test Suite', cmd: 'ctest --verbose' },
  ];

  const handleCommandRun = (cmdId: string) => {
    setSelectedCommand(cmdId);
    setIsSimulating(true);

    setTimeout(() => {
      setIsSimulating(false);
      switch (cmdId) {
        case 'dashboard':
          setTerminalOutput(PROJECT_DETAILS.terminalPreview.output);
          break;
        case 'cpu':
          setTerminalOutput(`[CPU ENGINE] Parsing /proc/stat stream...
Total Jiffies: user=1429210 nice=210 system=418290 idle=9481200 iowait=12098 irq=0 softirq=4920
────────────────────────────────────────────────────────────────────────────────
Core 00: [||||||||||||||||||||....................] ${liveCpuLoad.core0}% (User: 32.1% Sys: 16.1%)
Core 01: [||||||||||||............................] ${liveCpuLoad.core1}% (User: 21.0% Sys: 11.5%)
Overall CPU Utilization: ${liveCpuLoad.total}%
CPU Model: AMD Ryzen / Intel Core (16 Logical Cores detected via POSIX sysconf)
Load Average: 0.42 (1m), 0.38 (5m), 0.25 (15m)`);
          break;
        case 'memory':
          setTerminalOutput(`[MEMORY ENGINE] Parsing /proc/meminfo stream...
MemTotal     : 33399040 kB (31.85 GB)
MemFree      : 14281920 kB (13.62 GB)
MemAvailable : 21654312 kB (20.65 GB)
Buffers      : 421040 kB (411.17 MB)
Cached       : 6982104 kB (6.65 GB)
SwapTotal    : 8388608 kB (8.00 GB)
SwapFree     : 8136904 kB (7.76 GB)
────────────────────────────────────────────────────────────────────────────────
Physical RAM Utilized : 11.20 GB / 31.85 GB (${liveCpuLoad.ram}%)
Virtual Swap Utilized : 245.8 MB / 8.00 GB (3.0%)
Memory Pressure State : NOMINAL [OK]`);
          break;
        case 'processes':
          setTerminalOutput(`[PROCESS ENGINE] Scanning /proc/[pid]/ directory entries...
Total Active Processes: 284 | Running: 3 | Sleeping: 280 | Zombie: 0 | Threads: 942
────────────────────────────────────────────────────────────────────────────────
PID     PPID   USER      STATE   CPU%    MEM%    RSS(MB)    THREADS  CMD
1042    891    charan    R       2.4%    0.04%   14.2 MB    2        ./linux_monitor
9821    1      charan    S       1.8%    1.82%   572.4 MB   18       node /workspace
412     1      mysql     S       0.9%    2.21%   700.1 MB   34       /usr/sbin/mysqld
1892    1      root      S       0.4%    0.12%   38.4 MB    4        sshd: root@pts/0
1       0      root      S       0.0%    0.03%   10.8 MB    1        /sbin/init`);
          break;
        case 'json':
          setTerminalOutput(`{
  "timestamp": 1790606557,
  "hostname": "charan-workstation",
  "kernel": "Linux 6.6.36-microsoft-standard-WSL2",
  "uptime_seconds": 15502,
  "cpu": {
    "total_utilization_pct": ${liveCpuLoad.total},
    "load_average": [0.42, 0.38, 0.25],
    "cores_count": 16
  },
  "memory": {
    "total_bytes": 34198056960,
    "available_bytes": 22174015488,
    "utilization_pct": ${liveCpuLoad.ram}
  },
  "status": "HEALTHY"
}`);
          break;
        case 'test':
          setTerminalOutput(`Test project /home/charan/projects/linux-monitor/build
    Start 1: TestCPUParser
1/3 Test #1: TestCPUParser .....................   Passed    0.02 sec
    Start 2: TestMemoryParser
2/3 Test #2: TestMemoryParser ..................   Passed    0.01 sec
    Start 3: TestProcessScanner
3/3 Test #3: TestProcessScanner ................   Passed    0.04 sec

100% tests passed, 0 tests failed out of 3

Total Test time (real) =   0.08 sec`);
          break;
        default:
          setTerminalOutput(`Command executed: ${cmdId}\nOutput returned successfully with return code 0.`);
      }
    }, 200);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    const input = customInput.trim();
    setCustomInput('');
    if (input.includes('help')) {
      setTerminalOutput(`Linux System Information & Resource Monitor v1.0.0
Usage: ./bin/linux_monitor [OPTIONS]

Options:
  --dashboard      Launch full-screen terminal UI
  --cpu            Print detailed CPU and core breakdown
  --memory         Print physical RAM and swap metrics
  --processes      Print sorted process snapshot
  --export json    Export JSON telemetry snapshot
  --help           Show this help manual`);
    } else {
      setTerminalOutput(`Executing '${input}' on native Linux subsystem...\nExit status: 0 [SUCCESS]\nResource metrics validated against kernel /proc virtual filesystem.`);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(terminalOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Project Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(14, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.7) 100%)',
        border: '1px solid var(--border-glow)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 32px',
        position: 'relative',
        boxShadow: 'var(--shadow-glow-cyan)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-cyan">
                <Terminal size={12} /> Native Systems Programming
              </span>
              <span className="badge badge-purple">
                Academic Capstone Lab
              </span>
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
              {PROJECT_DETAILS.title}
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginTop: '6px', fontSize: '0.9rem', maxWidth: '750px', lineHeight: 1.5 }}>
              {PROJECT_DETAILS.description}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              background: 'rgba(0, 242, 254, 0.08)',
              border: '1px solid rgba(0, 242, 254, 0.25)',
              padding: '10px 16px',
              borderRadius: '10px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                Target Architecture
              </div>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
                x86_64 Linux / WSL2
              </div>
            </div>
          </div>
        </div>

        {/* Team Members Roster */}
        <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          {PROJECT_DETAILS.team.map((member, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255, 255, 255, 0.03)', padding: '12px 16px', borderRadius: '10px', border: '1px solid var(--border-subtle)' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'linear-gradient(135deg, #00f2fe 0%, #7928ca 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#030712' }}>
                0{i+1}
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>{member.name}</div>
                <div style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)' }}>Roll: {member.rollNo}</div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{member.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Terminal Emulator Playground */}
      <div className="glass-panel-glow" style={{ padding: '24px', position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={18} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Interactive C++ Terminal Emulator</h3>
            <span className="badge badge-emerald" style={{ fontSize: '0.68rem' }}>Live Stream</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              onClick={copyToClipboard}
              className="btn btn-outline" 
              style={{ padding: '6px 12px', fontSize: '0.75rem' }}
            >
              {copied ? <Check size={14} color="var(--accent-emerald)" /> : <Copy size={14} />}
              {copied ? 'Copied' : 'Copy Output'}
            </button>
            <button 
              onClick={() => handleCommandRun(selectedCommand)}
              className="btn btn-primary" 
              style={{ padding: '6px 14px', fontSize: '0.75rem' }}
            >
              <RotateCcw size={14} /> Refresh Stream
            </button>
          </div>
        </div>

        {/* Preset Command Switchers */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
          {commandsList.map((item) => (
            <button
              key={item.id}
              onClick={() => handleCommandRun(item.id)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: selectedCommand === item.id ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                background: selectedCommand === item.id ? 'rgba(0, 242, 254, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                color: selectedCommand === item.id ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Play size={12} color={selectedCommand === item.id ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Terminal Screen Window */}
        <div style={{
          background: '#04070d',
          border: '1px solid #1e293b',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.8), 0 8px 24px rgba(0, 0, 0, 0.6)',
        }}>
          {/* Window Titlebar */}
          <div style={{
            background: '#0a101d',
            padding: '10px 16px',
            borderBottom: '1px solid #1e293b',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)', marginLeft: '8px' }}>
                charan@workstation: ~/projects/linux-monitor
              </span>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
              ANSI 24-bit Color
            </div>
          </div>

          {/* Terminal Content Buffer */}
          <pre style={{
            padding: '20px',
            margin: 0,
            fontFamily: 'var(--font-mono)',
            fontSize: '0.84rem',
            lineHeight: 1.5,
            color: '#00f2fe',
            background: '#04070d',
            overflowX: 'auto',
            maxHeight: '440px',
            whiteSpace: 'pre',
          }}>
            {isSimulating ? (
              <span style={{ color: 'var(--text-muted)' }}>Streaming from Linux /proc filesystem...</span>
            ) : (
              terminalOutput
            )}
          </pre>

          {/* Interactive Shell Input Form */}
          <form onSubmit={handleCustomSubmit} style={{
            display: 'flex',
            alignItems: 'center',
            background: '#0a101d',
            borderTop: '1px solid #1e293b',
            padding: '10px 16px',
            gap: '8px',
          }}>
            <span style={{ color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>$</span>
            <input
              type="text"
              placeholder="Type command (e.g. ./bin/linux_monitor --cpu, help, ctest) and press Enter..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#ffffff',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.84rem',
              }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '4px 12px', fontSize: '0.75rem' }}>
              Execute
            </button>
          </form>
        </div>
      </div>

      {/* Linux Kernel /proc Virtual Filesystem Deep-Dive */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Server size={18} color="var(--accent-cyan)" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Kernel /proc Virtual Filesystem Architecture</h3>
          </div>
          <span className="badge badge-cyan">9 Pseudofiles Mapped</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(255, 255, 255, 0.02)' }}>
                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 700 }}>/proc Path</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 700 }}>Kernel Data Streamed</th>
                <th style={{ padding: '12px 16px', color: 'var(--text-secondary)', fontWeight: 700 }}>Project Parsing Logic</th>
              </tr>
            </thead>
            <tbody>
              {PROJECT_DETAILS.procFiles.map((item, index) => (
                <tr key={index} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '12px 16px', fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                    {item.file}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-primary)' }}>
                    {item.description}
                  </td>
                  <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                    {item.purpose}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
