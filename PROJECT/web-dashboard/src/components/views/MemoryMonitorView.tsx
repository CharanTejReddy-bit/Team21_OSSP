'use client';

import React from 'react';
import { HardDrive, Layers, Server } from 'lucide-react';
import { MemoryMetrics } from '../../data/linuxMonitorData';

interface MemoryMonitorViewProps {
  memory: MemoryMetrics;
}

export const MemoryMonitorView: React.FC<MemoryMonitorViewProps> = ({ memory }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Overview Banner */}
      <div className="sys-card" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <span className="badge badge-emerald">Memory Subsystem</span>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginTop: '6px' }}>
              Physical & Virtual Memory Monitor
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#8b949e', marginTop: '2px' }}>
              Parsed directly from <code className="mono" style={{ color: '#58a6ff' }}>/proc/meminfo</code> using Linux kernel page descriptors.
            </p>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.74rem', color: '#8b949e', textTransform: 'uppercase' }}>RAM Utilized</div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', fontFamily: 'var(--font-mono)' }}>
              {memory.percentage}%
            </div>
          </div>
        </div>

        {/* Stacked Memory Distribution Bar */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', height: '10px', borderRadius: '4px', overflow: 'hidden', background: '#21262d', marginBottom: '8px' }}>
            <div style={{ width: `${(memory.usedGib / memory.totalGib) * 100}%`, background: '#388bfd' }} title="Used RAM" />
            <div style={{ width: `${(memory.cachedGib / memory.totalGib) * 100}%`, background: '#3fb950' }} title="Cached RAM" />
            <div style={{ width: `${(memory.buffersGib / memory.totalGib) * 100}%`, background: '#d29922' }} title="Buffers" />
          </div>

          <div style={{ display: 'flex', gap: '16px', fontSize: '0.74rem', color: '#8b949e', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#388bfd' }} />
              <span>Used: {memory.usedGib.toFixed(1)} GiB</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#3fb950' }} />
              <span>Cached: {memory.cachedGib.toFixed(1)} GiB</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#d29922' }} />
              <span>Buffers: {memory.buffersGib.toFixed(1)} GiB</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#21262d' }} />
              <span>Free: {(memory.totalGib - memory.usedGib).toFixed(1)} GiB</span>
            </div>
          </div>
        </div>
      </div>

      {/* Breakdown Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        
        {/* Physical RAM Table */}
        <div className="sys-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f0f6fc', textTransform: 'uppercase', marginBottom: '14px' }}>
            PHYSICAL RAM METRICS
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#0d1117', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.78rem', color: '#8b949e' }}>MemTotal</span>
              <span className="mono" style={{ fontSize: '0.84rem', color: '#f0f6fc', fontWeight: 700 }}>{memory.totalGib.toFixed(2)} GiB</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#0d1117', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.78rem', color: '#8b949e' }}>MemAvailable</span>
              <span className="mono" style={{ fontSize: '0.84rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>{memory.availableGib.toFixed(2)} GiB</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#0d1117', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.78rem', color: '#8b949e' }}>Buffers</span>
              <span className="mono" style={{ fontSize: '0.84rem', color: '#f0f6fc', fontWeight: 700 }}>{memory.buffersGib.toFixed(2)} GiB</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#0d1117', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.78rem', color: '#8b949e' }}>Cached</span>
              <span className="mono" style={{ fontSize: '0.84rem', color: '#f0f6fc', fontWeight: 700 }}>{memory.cachedGib.toFixed(2)} GiB</span>
            </div>
          </div>
        </div>

        {/* Swap Space Table */}
        <div className="sys-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f0f6fc', textTransform: 'uppercase', marginBottom: '14px' }}>
            SWAP MEMORY METRICS
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#0d1117', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.78rem', color: '#8b949e' }}>SwapTotal</span>
              <span className="mono" style={{ fontSize: '0.84rem', color: '#f0f6fc', fontWeight: 700 }}>{memory.swapTotalGib.toFixed(2)} GiB</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#0d1117', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.78rem', color: '#8b949e' }}>SwapUsed</span>
              <span className="mono" style={{ fontSize: '0.84rem', color: '#58a6ff', fontWeight: 700 }}>{memory.swapUsedGib.toFixed(2)} GiB</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#0d1117', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.78rem', color: '#8b949e' }}>SwapFree</span>
              <span className="mono" style={{ fontSize: '0.84rem', color: 'var(--accent-emerald)', fontWeight: 700 }}>{(memory.swapTotalGib - memory.swapUsedGib).toFixed(2)} GiB</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 10px', background: '#0d1117', borderRadius: '6px' }}>
              <span style={{ fontSize: '0.78rem', color: '#8b949e' }}>Swap Utilization</span>
              <span className="mono" style={{ fontSize: '0.84rem', color: '#f0f6fc', fontWeight: 700 }}>{((memory.swapUsedGib / memory.swapTotalGib) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
