'use client';

import React, { useState } from 'react';
import { Settings, RefreshCw, Terminal, Sliders, CheckCircle2 } from 'lucide-react';

interface SettingsViewProps {
  refreshInterval: number;
  setRefreshInterval: (val: number) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ refreshInterval, setRefreshInterval }) => {
  const [ansiColor, setAnsiColor] = useState(true);
  const [confirmKill, setConfirmKill] = useState(true);
  const [autoSort, setAutoSort] = useState(true);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxWidth: '800px' }}>
      
      {savedToast && (
        <div style={{
          padding: '12px 18px',
          background: 'rgba(63, 185, 80, 0.15)',
          border: '1px solid var(--accent-emerald)',
          borderRadius: '8px',
          color: '#ffffff',
          fontSize: '0.84rem',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}>
          <CheckCircle2 size={16} color="var(--accent-emerald)" />
          <span>Monitoring settings updated successfully.</span>
        </div>
      )}

      {/* Refresh Interval Card */}
      <div className="sys-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f0f6fc', textTransform: 'uppercase', marginBottom: '8px' }}>
          TELEMETRY REFRESH INTERVAL
        </h3>
        <p style={{ fontSize: '0.8rem', color: '#8b949e', marginBottom: '16px' }}>
          Configures background pthread polling sleep interval for reading kernel /proc files.
        </p>

        <div style={{ display: 'flex', gap: '10px' }}>
          {[0.5, 1, 2, 5].map((interval) => (
            <button
              key={interval}
              onClick={() => setRefreshInterval(interval)}
              className={`btn ${refreshInterval === interval ? 'btn-primary' : 'btn-outline'}`}
              style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
            >
              {interval} sec {refreshInterval === interval && '(Active)'}
            </button>
          ))}
        </div>
      </div>

      {/* Terminal & Process Preferences */}
      <div className="sys-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f0f6fc', textTransform: 'uppercase', marginBottom: '16px' }}>
          TERMINAL & PROCESS PREFERENCES
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#0d1117', borderRadius: '6px', border: '1px solid #21262d', cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#f0f6fc' }}>ANSI 24-bit TrueColor Output</div>
              <div style={{ fontSize: '0.74rem', color: '#8b949e' }}>Enable colored utilization threshold bars in terminal</div>
            </div>
            <input
              type="checkbox"
              checked={ansiColor}
              onChange={(e) => setAnsiColor(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#388bfd' }}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#0d1117', borderRadius: '6px', border: '1px solid #21262d', cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#f0f6fc' }}>SIGKILL Confirmation Guard</div>
              <div style={{ fontSize: '0.74rem', color: '#8b949e' }}>Require explicit confirmation before sending Signal 9 to process</div>
            </div>
            <input
              type="checkbox"
              checked={confirmKill}
              onChange={(e) => setConfirmKill(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#388bfd' }}
            />
          </label>

          <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: '#0d1117', borderRadius: '6px', border: '1px solid #21262d', cursor: 'pointer' }}>
            <div>
              <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#f0f6fc' }}>Auto-Sort Top CPU Processes</div>
              <div style={{ fontSize: '0.74rem', color: '#8b949e' }}>Automatically keep highest CPU-consuming processes at the top</div>
            </div>
            <input
              type="checkbox"
              checked={autoSort}
              onChange={(e) => setAutoSort(e.target.checked)}
              style={{ width: '18px', height: '18px', accentColor: '#388bfd' }}
            />
          </label>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={handleSave} className="btn btn-primary" style={{ padding: '10px 20px' }}>
            Save Preferences
          </button>
        </div>
      </div>

    </div>
  );
};
