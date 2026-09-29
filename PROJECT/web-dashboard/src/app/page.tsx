'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';
import { PrimaryOverview } from '../components/PrimaryOverview';
import { CpuPanel } from '../components/CpuPanel';
import { MemoryPanel } from '../components/MemoryPanel';
import { ProcessSection } from '../components/ProcessSection';
import { SystemInfoPanel } from '../components/SystemInfoPanel';
import { ProcArchitecturePanel } from '../components/ProcArchitecturePanel';
import { TerminalModal } from '../components/TerminalModal';

import { CpuView } from '../components/views/CpuView';
import { NodesView } from '../components/views/NodesView';
import { LogsView } from '../components/views/LogsView';
import { SettingsView } from '../components/views/SettingsView';

import {
  INITIAL_CPU,
  INITIAL_MEMORY,
  INITIAL_PROCESS_METRICS,
  INITIAL_SYSTEM_INFO,
  INITIAL_PROCESSES,
  CpuMetrics,
  MemoryMetrics,
  ProcessMetrics,
  SystemOverview,
  ProcessItem,
} from '../data/linuxMonitorData';

import { PRESET_NODES, RemoteNode } from '../data/remoteNodesData';

export default function LinuxMonitorSoftware() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [refreshInterval, setRefreshInterval] = useState<number>(1);
  const [isTerminalModalOpen, setIsTerminalModalOpen] = useState<boolean>(false);

  // Multi-Host State
  const [nodesList, setNodesList] = useState<RemoteNode[]>(PRESET_NODES);
  const [activeHostIp, setActiveHostIp] = useState<string>('127.0.0.1');

  // Live Telemetry States
  const [cpu, setCpu] = useState<CpuMetrics>(INITIAL_CPU);
  const [memory, setMemory] = useState<MemoryMetrics>(INITIAL_MEMORY);
  const [processMetrics, setProcessMetrics] = useState<ProcessMetrics>(INITIAL_PROCESS_METRICS);
  const [systemInfo, setSystemInfo] = useState<SystemOverview>(INITIAL_SYSTEM_INFO);
  const [processesList, setProcessesList] = useState<ProcessItem[]>(INITIAL_PROCESSES);

  // 60-Second CPU History Array
  const [cpuHistory, setCpuHistory] = useState<number[]>([
    24, 28, 32, 29, 35, 42, 38, 45, 52, 48, 55, 62, 58, 65, 72, 68, 70, 74, 72, 73
  ]);

  // Fetch telemetry for currently selected host IP
  const fetchTelemetry = useCallback(async (targetIp?: string) => {
    const ipToQuery = targetIp || activeHostIp;
    try {
      const res = await fetch(`/api/telemetry?ip=${encodeURIComponent(ipToQuery)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.cpu) {
          setCpu(data.cpu);
          setCpuHistory((prev) => {
            const next = [...prev, data.cpu.utilization];
            return next.slice(-40);
          });
        }
        if (data.memory) setMemory(data.memory);
        if (data.processes) setProcessMetrics(data.processes);
        if (data.systemInfo) setSystemInfo(data.systemInfo);
        if (data.processList && data.processList.length > 0) {
          setProcessesList(data.processList);
        }
      }
    } catch (err) {
      console.error('Telemetry fetch error:', err);
    }
  }, [activeHostIp]);

  // Polling loop
  useEffect(() => {
    fetchTelemetry(activeHostIp);
    const intervalMs = refreshInterval * 1000;
    const timer = setInterval(() => fetchTelemetry(activeHostIp), intervalMs);
    return () => clearInterval(timer);
  }, [refreshInterval, activeHostIp, fetchTelemetry]);

  // Host Selection Handler
  const handleSelectHost = (ip: string) => {
    setActiveHostIp(ip);
    fetchTelemetry(ip);
  };

  const handleAddCustomNode = (newNode: RemoteNode) => {
    setNodesList((prev) => [...prev, newNode]);
  };

  const handleTabChange = (tab: string) => {
    if (tab === 'terminal') {
      setIsTerminalModalOpen(true);
    } else {
      setActiveTab(tab);
    }
  };

  return (
    <div className="app-layout">
      {/* Sidebar with Target Host IP Status */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        kernelVersion={systemInfo.kernel.split(' ')[0] || '6.8.x'}
        activeHostIp={activeHostIp}
      />

      {/* Main Viewport */}
      <main className="main-viewport">
        {/* Top Header with Target Host Switcher */}
        <Header
          uptime={systemInfo.uptime}
          refreshInterval={refreshInterval}
          setRefreshInterval={setRefreshInterval}
          onOpenSettings={() => setActiveTab('settings')}
          nodes={nodesList}
          activeHostIp={activeHostIp}
          onSelectHost={handleSelectHost}
          onAddCustomNode={handleAddCustomNode}
        />

        {/* Content Body */}
        <div className="content-container">
          {/* Main Dashboard */}
          {activeTab === 'dashboard' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Primary 3 Metrics Overview */}
              <PrimaryOverview
                cpu={cpu}
                memory={memory}
                processes={processMetrics}
              />

              {/* 2-Column Core Panels: CPU History & Memory Breakdown */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                gap: '12px',
              }}>
                <CpuPanel cpu={cpu} history={cpuHistory} />
                <MemoryPanel memory={memory} />
              </div>

              {/* Dense Professional Process Table with Selection Inspector */}
              <ProcessSection processes={processesList} />

              {/* 2-Column Technical Architecture & System Information */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
                gap: '12px',
              }}>
                <SystemInfoPanel systemInfo={systemInfo} />
                <ProcArchitecturePanel />
              </div>
            </div>
          )}

          {/* Dedicated CPU View */}
          {activeTab === 'cpu' && (
            <CpuView cpu={cpu} history={cpuHistory} />
          )}

          {/* Dedicated Memory View */}
          {activeTab === 'memory' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <MemoryPanel memory={memory} />
              <div className="sys-panel" style={{ padding: '16px' }}>
                <h3 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '10px' }}>
                  KERNEL MEMORY ALLOCATION METRICS (/proc/meminfo)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px' }}>
                  <div className="data-row" style={{ padding: '8px', background: 'var(--bg-surface)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>MemTotal</span>
                    <span className="mono">{memory.totalGib.toFixed(2)} GiB</span>
                  </div>
                  <div className="data-row" style={{ padding: '8px', background: 'var(--bg-surface)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>MemAvailable</span>
                    <span className="mono" style={{ color: 'var(--accent-success)' }}>{memory.availableGib.toFixed(2)} GiB</span>
                  </div>
                  <div className="data-row" style={{ padding: '8px', background: 'var(--bg-surface)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Buffers</span>
                    <span className="mono">{memory.buffersGib.toFixed(2)} GiB</span>
                  </div>
                  <div className="data-row" style={{ padding: '8px', background: 'var(--bg-surface)' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Cached</span>
                    <span className="mono">{memory.cachedGib.toFixed(2)} GiB</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Dedicated Process View */}
          {activeTab === 'processes' && (
            <ProcessSection processes={processesList} />
          )}

          {/* Dedicated Remote Nodes / Systems View */}
          {activeTab === 'nodes' && (
            <NodesView
              nodes={nodesList}
              activeHostIp={activeHostIp}
              onSelectHost={handleSelectHost}
              onAddCustomNode={handleAddCustomNode}
            />
          )}

          {/* Dedicated System View */}
          {activeTab === 'system' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <SystemInfoPanel systemInfo={systemInfo} />
              <ProcArchitecturePanel />
            </div>
          )}

          {/* Logs View */}
          {activeTab === 'logs' && <LogsView />}

          {/* Settings View */}
          {activeTab === 'settings' && (
            <SettingsView
              refreshInterval={refreshInterval}
              setRefreshInterval={setRefreshInterval}
            />
          )}
        </div>
      </main>

      {/* Terminal Modal */}
      <TerminalModal
        cpu={cpu}
        memory={memory}
        processes={processMetrics}
        isOpen={isTerminalModalOpen}
        onClose={() => setIsTerminalModalOpen(false)}
      />
    </div>
  );
}
