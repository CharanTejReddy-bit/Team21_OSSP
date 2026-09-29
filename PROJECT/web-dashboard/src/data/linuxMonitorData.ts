export interface CpuMetrics {
  utilization: number;
  user: number;
  system: number;
  idle: number;
  iowait: number;
  source: string;
  cores: { id: number; usage: number; user: number; sys: number }[];
}

export interface MemoryMetrics {
  totalGib: number;
  usedGib: number;
  availableGib: number;
  buffersGib: number;
  cachedGib: number;
  swapTotalGib: number;
  swapUsedGib: number;
  percentage: number;
  source: string;
}

export interface ProcessMetrics {
  total: number;
  running: number;
  sleeping: number;
  stopped: number;
  zombie: number;
  source: string;
}

export interface SystemOverview {
  hostname: string;
  os: string;
  kernel: string;
  cpuModel: string;
  cpuCores: number;
  uptime: string;
  uptimeSeconds: number;
  loadAverage: [number, number, number];
  architecture: string;
}

export interface ProcessItem {
  pid: number;
  user: string;
  cpu: number;
  mem: number;
  state: 'R' | 'S' | 'Z' | 'T' | 'D';
  command: string;
  rssMb: number;
  vmsizeMb: number;
  threads: number;
}

export interface TeamMember {
  memberNumber: string;
  name: string;
  rollNo: string;
  role: string;
  responsibilities: string[];
}

export interface OsConcept {
  title: string;
  description: string;
  tag: string;
}

export const INITIAL_CPU: CpuMetrics = {
  utilization: 72.4,
  user: 41.2,
  system: 22.8,
  idle: 27.6,
  iowait: 8.4,
  source: '/proc/stat',
  cores: [
    { id: 0, usage: 78.2, user: 45.0, sys: 33.2 },
    { id: 1, usage: 65.4, user: 38.1, sys: 27.3 },
    { id: 2, usage: 82.0, user: 49.5, sys: 32.5 },
    { id: 3, usage: 64.1, user: 32.7, sys: 31.4 },
    { id: 4, usage: 74.8, user: 42.0, sys: 32.8 },
    { id: 5, usage: 69.2, user: 39.4, sys: 29.8 },
    { id: 6, usage: 73.0, user: 41.6, sys: 31.4 },
    { id: 7, usage: 72.5, user: 41.3, sys: 31.2 },
  ],
};

export const INITIAL_MEMORY: MemoryMetrics = {
  totalGib: 15.4,
  usedGib: 8.7,
  availableGib: 6.7,
  buffersGib: 0.8,
  cachedGib: 3.2,
  swapTotalGib: 4.0,
  swapUsedGib: 0.4,
  percentage: 57,
  source: '/proc/meminfo',
};

export const INITIAL_PROCESS_METRICS: ProcessMetrics = {
  total: 163,
  running: 8,
  sleeping: 147,
  stopped: 2,
  zombie: 6,
  source: '/proc',
};

export const INITIAL_SYSTEM_INFO: SystemOverview = {
  hostname: 'linux-monitor',
  os: 'Ubuntu 24.04 LTS',
  kernel: '6.8.0-generic',
  cpuModel: 'Intel(R) Core(TM) i7-11800H @ 2.30GHz',
  cpuCores: 8,
  uptime: '03:42:18',
  uptimeSeconds: 13338,
  loadAverage: [1.24, 0.98, 0.84],
  architecture: 'x86_64',
};

export const INITIAL_PROCESSES: ProcessItem[] = [
  { pid: 1234, user: 'charan', cpu: 35.2, mem: 4.8, state: 'R', command: 'chrome', rssMb: 740, vmsizeMb: 2400, threads: 32 },
  { pid: 2481, user: 'charan', cpu: 18.4, mem: 2.1, state: 'S', command: 'code', rssMb: 324, vmsizeMb: 1100, threads: 14 },
  { pid: 912, user: 'root', cpu: 7.2, mem: 1.4, state: 'S', command: 'systemd', rssMb: 215, vmsizeMb: 450, threads: 1 },
  { pid: 4412, user: 'charan', cpu: 3.1, mem: 0.9, state: 'S', command: 'bash', rssMb: 138, vmsizeMb: 280, threads: 1 },
  { pid: 3105, user: 'charan', cpu: 2.8, mem: 1.2, state: 'R', command: './bin/linux_monitor', rssMb: 184, vmsizeMb: 310, threads: 3 },
  { pid: 1882, user: 'mysql', cpu: 1.9, mem: 3.5, state: 'S', command: 'mysqld', rssMb: 540, vmsizeMb: 1800, threads: 28 },
  { pid: 8201, user: 'root', cpu: 1.4, mem: 0.6, state: 'S', command: 'dockerd', rssMb: 92, vmsizeMb: 390, threads: 16 },
  { pid: 5612, user: 'charan', cpu: 0.9, mem: 0.4, state: 'S', command: 'node server.js', rssMb: 62, vmsizeMb: 210, threads: 6 },
  { pid: 7120, user: 'charan', cpu: 0.4, mem: 0.3, state: 'T', command: 'vim Makefile', rssMb: 46, vmsizeMb: 120, threads: 1 },
  { pid: 9941, user: 'charan', cpu: 0.0, mem: 0.0, state: 'Z', command: '<defunct_task>', rssMb: 0, vmsizeMb: 0, threads: 0 },
];

export const PROC_PIPELINE = [
  { source: '/proc/stat', target: 'CPU Metrics', desc: 'Aggregated & per-core jiffies for user, sys, idle, iowait delta computation' },
  { source: '/proc/meminfo', target: 'Memory Metrics', desc: 'MemTotal, MemFree, MemAvailable, Buffers, Cached, Swap values' },
  { source: '/proc/uptime', target: 'System Uptime', desc: 'System uptime seconds and idle duration jiffies' },
  { source: '/proc/[PID]/stat', target: 'Process Metrics', desc: 'Process state (R/S/Z/T), utime, stime, priority, and parent PID' },
  { source: '/proc/[PID]/status', target: 'Process Memory / State', desc: 'VmRSS, VmSize, UID, thread count, and voluntary context switches' },
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    memberNumber: '01',
    name: 'CharanTej Reddy',
    rollNo: '2520030422',
    role: 'CPU & Memory Metric Parsing',
    responsibilities: [
      '/proc/stat jiffies calculation',
      '/proc/meminfo memory extraction',
      'System uptime & load average parsing',
    ],
  },
  {
    memberNumber: '02',
    name: 'Sathvik',
    rollNo: '2520030226',
    role: 'Process Scanner & Lifecycle Control',
    responsibilities: [
      'opendir() & readdir() on /proc',
      '/proc/[PID]/stat parsing',
      'POSIX kill() signal transmission',
    ],
  },
  {
    memberNumber: '03',
    name: 'Chandrakanth Reddy',
    rollNo: '2520030290',
    role: 'Multithreading & Synchronization',
    responsibilities: [
      'pthread background polling thread',
      'pthread_mutex_t shared buffer safety',
      'ncurses / CLI rendering integration',
    ],
  },
];

export const OS_CONCEPTS: OsConcept[] = [
  {
    title: '/proc Virtual Filesystem',
    description: 'Dynamic in-memory kernel pseudofiles that provide structured access to hardware state and process control blocks without disk I/O.',
    tag: 'Kernel API',
  },
  {
    title: 'System Calls',
    description: 'Direct POSIX kernel interfaces (open, read, close, uname, sysinfo) used to request hardware and process telemetry directly.',
    tag: 'POSIX',
  },
  {
    title: 'Process Management',
    description: 'Scanning process directory tables, parsing execution states (Running, Sleeping, Zombie, Stopped), and thread tracking.',
    tag: 'Lifecycle',
  },
  {
    title: 'POSIX Signals',
    description: 'Used for controlled process management through standard signals such as graceful SIGTERM (15) and unconditional SIGKILL (9).',
    tag: 'IPC & Signals',
  },
  {
    title: 'Multithreading',
    description: 'POSIX pthreads decouple continuous background metric sampling from the terminal rendering loop to prevent UI freezing.',
    tag: 'pthreads',
  },
  {
    title: 'Mutex Synchronization',
    description: 'Thread-safe shared metric buffer protection using pthread_mutex_t to eliminate data races between worker and renderer.',
    tag: 'Concurrency',
  },
  {
    title: 'Low-Level File I/O',
    description: 'Fast stream and buffer parsing from /proc pseudo-devices optimized for low CPU overhead and microsecond-level latency.',
    tag: 'Systems I/O',
  },
  {
    title: 'Dynamic Resource Monitoring',
    description: 'Real-time delta-based mathematical computation of CPU percentage jiffies between sampling intervals (user, nice, sys, idle).',
    tag: 'Algorithms',
  },
];

export const TECH_STACK = [
  'C++17',
  'Linux',
  '/proc',
  'POSIX',
  'pthreads',
  'ncurses',
  'CMake',
  'Make',
  'Git',
];
