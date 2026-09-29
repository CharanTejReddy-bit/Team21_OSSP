'use client';

import React, { useState } from 'react';
import { FileText, RefreshCw, Download } from 'lucide-react';

export const LogsView: React.FC = () => {
  const [logs] = useState<string[]>([
    "[08:00:12] [KERNEL] /proc/stat stream opened. Delta calculation initialized.",
    "[08:00:13] [MEMORY] MemTotal: 16148070 kB, MemAvailable: 4829104 kB. State: HEALTHY.",
    "[08:00:14] [PROCESS] Process table scan complete. Total entries: 144, Running: 2.",
    "[08:00:15] [THREADS] pthread_create() background telemetry worker thread ID: 0x7f8841a0.",
    "[08:00:16] [MUTEX] pthread_mutex_lock() acquisition delta: 0.04 ms. Zero contention.",
    "[08:00:17] [POLL] Telemetry snapshot serialized (2.8 KB payload) for client dispatch.",
    "[08:00:18] [SYSTEM] Load averages [0.42, 0.38, 0.25] within nominal thresholds.",
  ]);

  return (
    <div className="sys-panel" style={{ padding: '16px' }}>
      <div className="sys-panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileText size={14} color="var(--accent-primary)" />
          <h2 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            SYSTEM MONITOR LOGS
          </h2>
        </div>
        <span className="mono" style={{ fontSize: '11px', color: 'var(--accent-success)' }}>
          ● LIVE STREAM
        </span>
      </div>

      <pre style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-app)',
        borderRadius: 'var(--radius-sm)',
        padding: '12px 14px',
        fontFamily: 'var(--font-mono)',
        fontSize: '12px',
        lineHeight: 1.6,
        color: 'var(--text-secondary)',
        overflowX: 'auto',
        maxHeight: '440px',
      }}>
        {logs.map((log, i) => (
          <div key={i} style={{ color: log.includes('ERROR') ? 'var(--accent-danger)' : log.includes('HEALTHY') ? 'var(--accent-success)' : 'var(--text-secondary)' }}>
            {log}
          </div>
        ))}
      </pre>
    </div>
  );
};
