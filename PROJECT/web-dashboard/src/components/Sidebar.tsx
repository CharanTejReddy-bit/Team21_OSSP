'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Cpu, 
  HardDrive, 
  ListTree, 
  Info, 
  Terminal, 
  FileText, 
  Settings,
  Network
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  kernelVersion?: string;
  activeHostIp?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  kernelVersion = '6.8.x',
  activeHostIp = '127.0.0.1',
}) => {
  const overviewItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'cpu', label: 'CPU', icon: Cpu },
    { id: 'memory', label: 'Memory', icon: HardDrive },
    { id: 'processes', label: 'Processes', icon: ListTree },
    { id: 'nodes', label: 'Remote Nodes', icon: Network },
    { id: 'system', label: 'System', icon: Info },
  ];

  const toolsItems = [
    { id: 'terminal', label: 'Terminal Monitor', icon: Terminal },
    { id: 'logs', label: 'Logs', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const renderNavGroup = (title: string, items: typeof overviewItems) => (
    <div style={{ marginBottom: '18px' }}>
      <div style={{
        padding: '0 12px 6px 12px',
        fontSize: '11px',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--text-muted)',
      }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                padding: '7px 12px',
                border: 'none',
                borderLeft: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent',
                background: isActive ? 'var(--accent-blue-subtle)' : 'transparent',
                color: isActive ? 'var(--text-white)' : 'var(--text-secondary)',
                fontSize: '13px',
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                textAlign: 'left',
                borderRadius: '0 4px 4px 0',
                transition: 'all 0.15s ease',
              }}
            >
              <Icon size={15} color={isActive ? 'var(--accent-primary)' : 'var(--text-muted)'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside style={{
      width: '220px',
      minWidth: '220px',
      background: 'var(--bg-sidebar)',
      borderRight: '1px solid var(--border-app)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '16px 0',
    }}>
      {/* Brand Header */}
      <div style={{ padding: '0 16px 16px 16px', borderBottom: '1px solid var(--border-app)', marginBottom: '16px' }}>
        <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-white)', letterSpacing: '0.02em' }}>
          LINUX MONITOR
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
          System Resource Monitor
        </div>
      </div>

      {/* Navigation Groups */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '0 8px' }}>
        {renderNavGroup('OVERVIEW', overviewItems)}
        {renderNavGroup('TOOLS', toolsItems)}
      </nav>

      {/* System Footer Status */}
      <div style={{
        padding: '12px 16px',
        borderTop: '1px solid var(--border-app)',
        background: 'var(--bg-surface)',
        margin: '0 8px',
        borderRadius: 'var(--radius-sm)',
      }}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
          TARGET HOST
        </div>
        <div className="mono" style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-primary)' }}>
          {activeHostIp}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
          <span className="mono">Kernel {kernelVersion}</span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-success)' }}>
            <span className="status-indicator status-online" style={{ width: '5px', height: '5px' }} />
            Online
          </span>
        </div>
      </div>
    </aside>
  );
};
