'use client';

import React from 'react';
import { Server, Terminal, Cpu, Clock, Activity, ShieldCheck, HardDrive } from 'lucide-react';
import { SystemOverview } from '../../data/linuxMonitorData';

interface SystemInfoViewProps {
  systemInfo: SystemOverview;
}

export const SystemInfoView: React.FC<SystemInfoViewProps> = ({ systemInfo }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* OS & Kernel Specification */}
      <div className="sys-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <span className="badge badge-blue">Host Environment</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginTop: '6px' }}>
              System Information & POSIX Environment
            </h2>
          </div>
          <span className="badge badge-emerald">uname -a Verified</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          
          <div style={{ background: '#0d1117', border: '1px solid #21262d', padding: '16px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.72rem', color: '#8b949e', textTransform: 'uppercase', marginBottom: '4px' }}>
              HOSTNAME (sys/utsname.h)
            </div>
            <div className="mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#58a6ff' }}>
              {systemInfo.hostname}
            </div>
          </div>

          <div style={{ background: '#0d1117', border: '1px solid #21262d', padding: '16px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.72rem', color: '#8b949e', textTransform: 'uppercase', marginBottom: '4px' }}>
              OPERATING SYSTEM
            </div>
            <div className="mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f0f6fc' }}>
              {systemInfo.os}
            </div>
          </div>

          <div style={{ background: '#0d1117', border: '1px solid #21262d', padding: '16px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.72rem', color: '#8b949e', textTransform: 'uppercase', marginBottom: '4px' }}>
              LINUX KERNEL RELEASE
            </div>
            <div className="mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#3fb950' }}>
              {systemInfo.kernel}
            </div>
          </div>

          <div style={{ background: '#0d1117', border: '1px solid #21262d', padding: '16px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.72rem', color: '#8b949e', textTransform: 'uppercase', marginBottom: '4px' }}>
              PROCESSOR ARCHITECTURE
            </div>
            <div className="mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f0f6fc' }}>
              {systemInfo.architecture}
            </div>
          </div>

        </div>
      </div>

      {/* Hardware & Scheduler Limits */}
      <div className="sys-card" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f0f6fc', textTransform: 'uppercase', marginBottom: '16px' }}>
          CPU ARCHITECTURE & SCHEDULER LOAD
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          
          <div style={{ background: '#0d1117', border: '1px solid #21262d', padding: '16px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.72rem', color: '#8b949e', textTransform: 'uppercase', marginBottom: '4px' }}>
              CPU MODEL
            </div>
            <div className="mono" style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f0f6fc' }}>
              {systemInfo.cpuModel}
            </div>
          </div>

          <div style={{ background: '#0d1117', border: '1px solid #21262d', padding: '16px', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.72rem', color: '#8b949e', textTransform: 'uppercase', marginBottom: '4px' }}>
              LOAD AVERAGE (/proc/loadavg)
            </div>
            <div className="mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: '#58a6ff' }}>
              1m: {systemInfo.loadAverage[0].toFixed(2)} | 5m: {systemInfo.loadAverage[1].toFixed(2)} | 15m: {systemInfo.loadAverage[2].toFixed(2)}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
