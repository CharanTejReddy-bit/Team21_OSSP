'use client';

import React from 'react';
import { 
  LayoutGrid, 
  Cpu, 
  HardDrive, 
  ListTree, 
  Info, 
  Settings, 
  Terminal,
  Server
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  refreshInterval: number;
}

export const NavigationSidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, refreshInterval }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutGrid, symbol: '▦' },
    { id: 'cpu', label: 'CPU Monitor', icon: Cpu, symbol: '▣' },
    { id: 'memory', label: 'Memory Monitor', icon: HardDrive, symbol: '▤' },
    { id: 'processes', label: 'Process Monitor', icon: ListTree, symbol: '▥' },
    { id: 'system-info', label: 'System Information', icon: Info, symbol: '◉' },
    { id: 'settings', label: 'Settings', icon: Settings, symbol: '⚙' },
  ];

  return (
    <aside style={{
      width: '240px',
      minWidth: '240px',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '20px 12px',
    }}>
      {/* Brand Header */}
      <div style={{ padding: '0 8px 16px 8px', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '6px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-cyan)',
          }}>
            <Terminal size={16} />
          </div>
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
              LINUX MONITOR
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              Resource Telemetry
            </div>
          </div>
        </div>

        {/* Minimalist Live Pill */}
        <div style={{
          marginTop: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.72rem',
          color: 'var(--accent-emerald)',
          fontWeight: 600,
        }}>
          <span className="live-dot" />
          <span>System Online</span>
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '14px 0', display: 'flex', flexDirection: 'column', gap: '3px' }}>
        <div style={{ padding: '0 8px 6px 8px', fontSize: '0.65rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.08em', fontWeight: 600 }}>
          Navigation
        </div>
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '9px',
                width: '100%',
                padding: '8px 10px',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: isActive ? 'var(--border-subtle)' : 'transparent',
                background: isActive ? 'var(--bg-tertiary)' : 'transparent',
                color: isActive ? '#ffffff' : 'var(--text-secondary)',
                fontSize: '0.82rem',
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.1s ease',
              }}
            >
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                {item.symbol}
              </span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom Status Card */}
      <div style={{
        marginTop: 'auto',
        background: 'var(--bg-tertiary)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '6px',
        padding: '10px 12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-primary)' }}>Ubuntu Linux</span>
          <span className="live-dot" />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
          <span>Polling Rate</span>
          <span className="mono" style={{ color: 'var(--accent-cyan)' }}>{refreshInterval}s</span>
        </div>
      </div>
    </aside>
  );
};
