export interface RemoteNode {
  id: string;
  ip: string;
  port: number;
  hostname: string;
  os: string;
  kernel: string;
  status: 'online' | 'offline' | 'connecting';
  pingMs: number;
  cpu: {
    utilization: number;
    cores: number;
    user: number;
    system: number;
    idle: number;
    iowait: number;
  };
  memory: {
    totalGib: number;
    usedGib: number;
    availableGib: number;
    percentage: number;
  };
  processes: {
    total: number;
    running: number;
    sleeping: number;
    zombie: number;
  };
  uptime: string;
  uptimeSeconds: number;
  loadAverage: [number, number, number];
  role: string;
}

export const PRESET_NODES: RemoteNode[] = [
  {
    id: 'local',
    ip: '127.0.0.1',
    port: 3000,
    hostname: 'local-workstation',
    os: 'Ubuntu 24.04 LTS (x86_64)',
    kernel: '6.8.0-generic',
    status: 'online',
    pingMs: 0,
    cpu: { utilization: 29.4, cores: 8, user: 18.2, system: 11.2, idle: 70.6, iowait: 0.0 },
    memory: { totalGib: 15.4, usedGib: 9.8, availableGib: 5.6, percentage: 64 },
    processes: { total: 148, running: 3, sleeping: 144, zombie: 1 },
    uptime: '08:24:12',
    uptimeSeconds: 30252,
    loadAverage: [0.45, 0.38, 0.28],
    role: 'Local Host Node',
  },
  {
    id: 'node-compute-1',
    ip: '192.168.1.105',
    port: 8080,
    hostname: 'ubuntu-compute-01',
    os: 'Ubuntu 22.04.4 LTS Server',
    kernel: '6.5.0-28-generic',
    status: 'online',
    pingMs: 4,
    cpu: { utilization: 68.2, cores: 16, user: 44.5, system: 23.7, idle: 31.8, iowait: 1.2 },
    memory: { totalGib: 31.8, usedGib: 22.4, availableGib: 9.4, percentage: 70 },
    processes: { total: 284, running: 8, sleeping: 274, zombie: 2 },
    uptime: '42:15:30',
    uptimeSeconds: 152130,
    loadAverage: [2.14, 1.88, 1.45],
    role: 'High-Performance Compute Node',
  },
  {
    id: 'node-db-primary',
    ip: '192.168.1.110',
    port: 8080,
    hostname: 'debian-db-primary',
    os: 'Debian GNU/Linux 12 (bookworm)',
    kernel: '6.1.0-18-amd64',
    status: 'online',
    pingMs: 8,
    cpu: { utilization: 42.1, cores: 8, user: 28.0, system: 14.1, idle: 57.9, iowait: 3.4 },
    memory: { totalGib: 63.8, usedGib: 48.2, availableGib: 15.6, percentage: 75 },
    processes: { total: 192, running: 4, sleeping: 188, zombie: 0 },
    uptime: '118:04:19',
    uptimeSeconds: 424859,
    loadAverage: [1.12, 0.94, 0.82],
    role: 'PostgreSQL Database Node',
  },
  {
    id: 'node-edge-gateway',
    ip: '10.0.4.20',
    port: 8080,
    hostname: 'alpine-edge-proxy',
    os: 'Alpine Linux v3.19',
    kernel: '6.6.14-0-lts',
    status: 'online',
    pingMs: 16,
    cpu: { utilization: 14.8, cores: 4, user: 8.5, system: 6.3, idle: 85.2, iowait: 0.1 },
    memory: { totalGib: 7.8, usedGib: 1.9, availableGib: 5.9, percentage: 24 },
    processes: { total: 64, running: 2, sleeping: 62, zombie: 0 },
    uptime: '14:38:00',
    uptimeSeconds: 52680,
    loadAverage: [0.18, 0.12, 0.08],
    role: 'NGINX Reverse Proxy / Gateway',
  },
];
