export interface StudentProfile {
  name: string;
  rollNo: string;
  program: string;
  semester: string;
  cgpa: number;
  sgpaTarget: number;
  overallAttendance: number;
  totalCredits: number;
  completedCredits: number;
  academicRank: number;
  batchYear: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  instructor: string;
  instructorEmail: string;
  credits: number;
  attendance: number;
  attendedClasses: number;
  totalClasses: number;
  progress: number;
  gradeEstimated: string;
  color: string;
  gradient: string;
  room: string;
  syllabus: { title: string; completed: boolean }[];
  announcements: string[];
  materials: { title: string; type: 'pdf' | 'doc' | 'code' | 'slides'; size: string }[];
}

export interface Assignment {
  id: string;
  courseCode: string;
  courseName: string;
  title: string;
  description: string;
  dueDate: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
  status: 'pending' | 'in_progress' | 'submitted' | 'graded';
  weightage: string;
  grade?: string;
  maxScore: number;
  score?: number;
}

export interface TimetableSlot {
  id: string;
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
  time: string;
  courseCode: string;
  courseName: string;
  type: 'Theory' | 'Lab' | 'Tutorial';
  room: string;
  instructor: string;
  color: string;
}

export interface Flashcard {
  id: string;
  courseCode: string;
  question: string;
  answer: string;
  category: string;
}

export interface ProjectShowcase {
  title: string;
  course: string;
  team: { name: string; rollNo: string; role: string }[];
  description: string;
  highlights: string[];
  techStack: string[];
  procFiles: { file: string; description: string; purpose: string }[];
  terminalPreview: {
    command: string;
    output: string;
  };
}

export const STUDENT_PROFILE: StudentProfile = {
  name: "CharanTej Reddy",
  rollNo: "2520030422",
  program: "B.Tech Computer Science & Engineering",
  semester: "Semester IV (Spring 2026)",
  cgpa: 9.42,
  sgpaTarget: 9.60,
  overallAttendance: 92.4,
  totalCredits: 22,
  completedCredits: 18,
  academicRank: 4,
  batchYear: "2024 - 2028",
};

export const COURSES: Course[] = [
  {
    id: "ossp",
    code: "CS401",
    name: "Operating Systems & Systems Programming",
    instructor: "Dr. K. Ramanathan",
    instructorEmail: "k.ramanathan@univ.edu",
    credits: 4,
    attendance: 94.2,
    attendedClasses: 33,
    totalClasses: 35,
    progress: 88,
    gradeEstimated: "A+",
    color: "#00f2fe",
    gradient: "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)",
    room: "CS-Lab 3 & LH-201",
    syllabus: [
      { title: "Process Life Cycle, PCB & Context Switching", completed: true },
      { title: "CPU Scheduling Algorithms (FCFS, SJF, Round Robin)", completed: true },
      { title: "Process Synchronization, Semaphores & Mutex Locks", completed: true },
      { title: "Deadlock Detection, Prevention & Banker's Algorithm", completed: true },
      { title: "Virtual Memory, Paging, TLB & Page Replacement", completed: true },
      { title: "Linux /proc Virtual Filesystem & Kernel APIs", completed: true },
      { title: "POSIX Threads & Inter-Process Communication (IPC)", completed: false },
      { title: "File Systems, Inodes & Linux Device Drivers", completed: false },
    ],
    announcements: [
      "OSSP Team Project submission portal is now active. Ensure terminal CLI runs smoothly.",
      "Lab 7: POSIX Shared Memory IPC code due this Friday at 11:59 PM.",
    ],
    materials: [
      { title: "OSSP Course Handout & Evaluation Schema", type: "pdf", size: "13.1 MB" },
      { title: "Linux System Monitor Architecture Specification", type: "doc", size: "109 KB" },
      { title: "Virtual Memory & Inode Lecture Slides", type: "slides", size: "4.8 MB" },
      { title: "POSIX Threads & Mutex Starter Code", type: "code", size: "45 KB" },
    ],
  },
  {
    id: "daa",
    code: "CS402",
    name: "Design & Analysis of Algorithms",
    instructor: "Dr. Sneha Roy",
    instructorEmail: "sneha.roy@univ.edu",
    credits: 4,
    attendance: 91.5,
    attendedClasses: 32,
    totalClasses: 35,
    progress: 76,
    gradeEstimated: "A",
    color: "#7928ca",
    gradient: "linear-gradient(135deg, #7928ca 0%, #b829dd 100%)",
    room: "LH-104",
    syllabus: [
      { title: "Asymptotic Notation & Recurrence Relations", completed: true },
      { title: "Divide & Conquer: Master Theorem & Strassen's Matrix", completed: true },
      { title: "Dynamic Programming: Matrix Chain Multiplication & LCS", completed: true },
      { title: "Greedy Strategies: Huffman Coding & Fractional Knapsack", completed: true },
      { title: "Graph Algorithms: Dijkstra, Bellman-Ford, Floyd-Warshall", completed: false },
      { title: "Network Flows: Ford-Fulkerson & Maximum Bipartite Matching", completed: false },
      { title: "NP-Completeness, Reductions & Approximation Algorithms", completed: false },
    ],
    announcements: [
      "Midterm algorithm design test scheduled for next Wednesday.",
      "Practice problems on dynamic programming state space reduction uploaded.",
    ],
    materials: [
      { title: "Dynamic Programming Master Handbook", type: "pdf", size: "6.2 MB" },
      { title: "Graph Algorithms Visual Cheat Sheet", type: "pdf", size: "2.1 MB" },
      { title: "DP Practice Problem Solutions", type: "code", size: "78 KB" },
    ],
  },
  {
    id: "dbms",
    code: "CS403",
    name: "Database Management Systems",
    instructor: "Prof. M. Srinivas",
    instructorEmail: "m.srinivas@univ.edu",
    credits: 3,
    attendance: 95.0,
    attendedClasses: 28,
    totalClasses: 30,
    progress: 85,
    gradeEstimated: "A+",
    color: "#10b981",
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    room: "CS-Lab 1",
    syllabus: [
      { title: "Entity-Relationship (ER) Modeling & Relational Schema", completed: true },
      { title: "Relational Algebra & Tuple Relational Calculus", completed: true },
      { title: "Complex SQL: Window Functions, CTEs & Triggers", completed: true },
      { title: "Functional Dependencies & Normal Forms (1NF, 2NF, 3NF, BCNF)", completed: true },
      { title: "Transaction Management & ACID Properties", completed: false },
      { title: "Concurrency Control: Two-Phase Locking & Timestamp Ordering", completed: false },
      { title: "Indexing & Query Optimization (B+ Trees & Hashing)", completed: false },
    ],
    announcements: [
      "SQL Lab Evaluation on Complex Joins and Stored Procedures next Monday.",
      "Normalization assignment grades published.",
    ],
    materials: [
      { title: "Database Normalization & BCNF Proofs", type: "pdf", size: "3.4 MB" },
      { title: "PostgreSQL Advanced Queries & Indexing Lab Guide", type: "doc", size: "1.2 MB" },
    ],
  },
  {
    id: "cn",
    code: "CS404",
    name: "Computer Networks",
    instructor: "Dr. A. Sharma",
    instructorEmail: "a.sharma@univ.edu",
    credits: 3,
    attendance: 89.2,
    attendedClasses: 25,
    totalClasses: 28,
    progress: 72,
    gradeEstimated: "A-",
    color: "#f59e0b",
    gradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    room: "LH-203",
    syllabus: [
      { title: "OSI 7-Layer & TCP/IP Protocol Architectures", completed: true },
      { title: "Data Link Layer: Framing, HDLC, CRC & Flow Control", completed: true },
      { title: "Medium Access: CSMA/CD, CSMA/CA & Ethernet", completed: true },
      { title: "Network Layer: IPv4/IPv6 Addressing, Subnetting & CIDR", completed: true },
      { title: "Routing Protocols: Distance Vector, Link State, OSPF, BGP", completed: false },
      { title: "Transport Layer: TCP Three-Way Handshake & Congestion Window", completed: false },
      { title: "Application Layer: DNS, HTTP/2, TLS & Socket Programming", completed: false },
    ],
    announcements: [
      "Wireshark packet capture analysis submission due in 4 days.",
      "Guest lecture on 5G Core Network architecture this Friday.",
    ],
    materials: [
      { title: "TCP Congestion Control Deep Dive", type: "pdf", size: "5.1 MB" },
      { title: "Socket Programming in C/Python Sample Code", type: "code", size: "32 KB" },
    ],
  },
  {
    id: "ps",
    code: "MA401",
    name: "Probability & Statistics for Engineers",
    instructor: "Prof. V. Lakshmi",
    instructorEmail: "v.lakshmi@univ.edu",
    credits: 3,
    attendance: 93.3,
    attendedClasses: 28,
    totalClasses: 30,
    progress: 82,
    gradeEstimated: "A",
    color: "#ec4899",
    gradient: "linear-gradient(135deg, #ec4899 0%, #db2777 100%)",
    room: "LH-302",
    syllabus: [
      { title: "Axioms of Probability & Bayes' Theorem", completed: true },
      { title: "Discrete Distributions (Binomial, Poisson, Geometric)", completed: true },
      { title: "Continuous Distributions (Normal, Exponential, Gamma)", completed: true },
      { title: "Joint Probability Distributions & Covariance", completed: true },
      { title: "Central Limit Theorem & Law of Large Numbers", completed: false },
      { title: "Hypothesis Testing (t-test, chi-square, ANOVA)", completed: false },
      { title: "Markov Chains & Random Walks", completed: false },
    ],
    announcements: [
      "Quiz 3 on Continuous Distributions will be conducted on LMS on Saturday.",
    ],
    materials: [
      { title: "Statistical Formula & Distribution Table", type: "pdf", size: "1.8 MB" },
      { title: "Hypothesis Testing Worked Examples", type: "pdf", size: "2.9 MB" },
    ],
  },
  {
    id: "fswt",
    code: "CS405",
    name: "Full-Stack Web Technologies",
    instructor: "Prof. Rajesh Kumar",
    instructorEmail: "rajesh.k@univ.edu",
    credits: 3,
    attendance: 96.6,
    attendedClasses: 29,
    totalClasses: 30,
    progress: 92,
    gradeEstimated: "A+",
    color: "#06b6d4",
    gradient: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
    room: "CS-Lab 2",
    syllabus: [
      { title: "Modern JavaScript (ES6+), Async/Await & Event Loop", completed: true },
      { title: "React Component Architecture, Hooks & State Management", completed: true },
      { title: "Next.js App Router, SSR, SSG & Server Actions", completed: true },
      { title: "Vanilla CSS Systems, Glassmorphism & UI Animation", completed: true },
      { title: "RESTful API Design, Middleware & JWT Authentication", completed: true },
      { title: "Database Integration with Prisma ORM & PostgreSQL", completed: false },
      { title: "Deployment, CI/CD & Edge Computing", completed: false },
    ],
    announcements: [
      "Semester Web Project milestone 2 due next week.",
    ],
    materials: [
      { title: "Next.js 15 Full Architecture Guide", type: "slides", size: "8.5 MB" },
      { title: "Modern CSS Glassmorphism Snippets", type: "code", size: "19 KB" },
    ],
  },
];

export const ASSIGNMENTS: Assignment[] = [
  {
    id: "asg-1",
    courseCode: "CS401",
    courseName: "Operating Systems & Systems Programming",
    title: "Linux System Resource Monitor CLI Project",
    description: "Build an interactive native C/C++ Linux system monitoring tool parsing /proc directly with CPU, memory, process inspection, and export features.",
    dueDate: "2026-10-05",
    priority: "urgent",
    status: "submitted",
    weightage: "25% of Total Grade",
    maxScore: 100,
    score: 98,
    grade: "A+",
  },
  {
    id: "asg-2",
    courseCode: "CS402",
    courseName: "Design & Analysis of Algorithms",
    title: "Dynamic Programming: Matrix Chain Optimization",
    description: "Implement recursive, memoized, and bottom-up DP algorithms for optimal parenthesization of matrix chains with step counter.",
    dueDate: "2026-10-02",
    priority: "high",
    status: "in_progress",
    weightage: "10% of Total Grade",
    maxScore: 50,
  },
  {
    id: "asg-3",
    courseCode: "CS403",
    courseName: "Database Management Systems",
    title: "SQL Concurrency & Two-Phase Locking Simulation",
    description: "Write transactional queries demonstrating dirty reads, non-repeatable reads, phantom reads and isolation levels in PostgreSQL.",
    dueDate: "2026-10-08",
    priority: "medium",
    status: "pending",
    weightage: "15% of Total Grade",
    maxScore: 50,
  },
  {
    id: "asg-4",
    courseCode: "CS404",
    courseName: "Computer Networks",
    title: "Multi-threaded Socket Chat Server in C",
    description: "Create a client-server socket architecture using POSIX threads, handling broadcast messages, whisper channels, and graceful disconnections.",
    dueDate: "2026-10-12",
    priority: "medium",
    status: "pending",
    weightage: "15% of Total Grade",
    maxScore: 60,
  },
  {
    id: "asg-5",
    courseCode: "MA401",
    courseName: "Probability & Statistics",
    title: "Markov Chain Steady State & Monte Carlo Simulation",
    description: "Simulate random walks on a state transition graph and calculate theoretical vs empirical stationary distributions.",
    dueDate: "2026-10-15",
    priority: "low",
    status: "pending",
    weightage: "10% of Total Grade",
    maxScore: 40,
  },
];

export const TIMETABLE: TimetableSlot[] = [
  // Monday
  { id: "tt-1", day: "Monday", time: "09:00 - 10:00 AM", courseCode: "CS401", courseName: "Operating Systems", type: "Theory", room: "LH-201", instructor: "Dr. K. Ramanathan", color: "#00f2fe" },
  { id: "tt-2", day: "Monday", time: "10:00 - 11:00 AM", courseCode: "CS402", courseName: "DAA", type: "Theory", room: "LH-104", instructor: "Dr. Sneha Roy", color: "#7928ca" },
  { id: "tt-3", day: "Monday", time: "11:15 - 01:15 PM", courseCode: "CS403", courseName: "DBMS Lab", type: "Lab", room: "CS-Lab 1", instructor: "Prof. M. Srinivas", color: "#10b981" },
  { id: "tt-4", day: "Monday", time: "02:00 - 03:00 PM", courseCode: "CS404", courseName: "Computer Networks", type: "Theory", room: "LH-203", instructor: "Dr. A. Sharma", color: "#f59e0b" },

  // Tuesday
  { id: "tt-5", day: "Tuesday", time: "09:00 - 10:00 AM", courseCode: "MA401", courseName: "Probability & Stats", type: "Theory", room: "LH-302", instructor: "Prof. V. Lakshmi", color: "#ec4899" },
  { id: "tt-6", day: "Tuesday", time: "10:00 - 11:00 AM", courseCode: "CS405", courseName: "Full-Stack Web Dev", type: "Theory", room: "CS-Lab 2", instructor: "Prof. Rajesh Kumar", color: "#06b6d4" },
  { id: "tt-7", day: "Tuesday", time: "11:15 - 01:15 PM", courseCode: "CS401", courseName: "OSSP Systems Lab", type: "Lab", room: "CS-Lab 3", instructor: "Dr. K. Ramanathan", color: "#00f2fe" },

  // Wednesday
  { id: "tt-8", day: "Wednesday", time: "09:00 - 10:00 AM", courseCode: "CS402", courseName: "DAA", type: "Theory", room: "LH-104", instructor: "Dr. Sneha Roy", color: "#7928ca" },
  { id: "tt-9", day: "Wednesday", time: "10:00 - 11:00 AM", courseCode: "CS403", courseName: "DBMS", type: "Theory", room: "CS-Lab 1", instructor: "Prof. M. Srinivas", color: "#10b981" },
  { id: "tt-10", day: "Wednesday", time: "11:15 - 12:15 PM", courseCode: "CS404", courseName: "Computer Networks", type: "Theory", room: "LH-203", instructor: "Dr. A. Sharma", color: "#f59e0b" },
  { id: "tt-11", day: "Wednesday", time: "02:00 - 04:00 PM", courseCode: "CS405", courseName: "Web Tech Lab", type: "Lab", room: "CS-Lab 2", instructor: "Prof. Rajesh Kumar", color: "#06b6d4" },

  // Thursday
  { id: "tt-12", day: "Thursday", time: "09:00 - 10:00 AM", courseCode: "CS401", courseName: "Operating Systems", type: "Theory", room: "LH-201", instructor: "Dr. K. Ramanathan", color: "#00f2fe" },
  { id: "tt-13", day: "Thursday", time: "10:00 - 11:00 AM", courseCode: "MA401", courseName: "Probability & Stats", type: "Theory", room: "LH-302", instructor: "Prof. V. Lakshmi", color: "#ec4899" },
  { id: "tt-14", day: "Thursday", time: "11:15 - 01:15 PM", courseCode: "CS402", courseName: "DAA Coding Lab", type: "Lab", room: "CS-Lab 1", instructor: "Dr. Sneha Roy", color: "#7928ca" },

  // Friday
  { id: "tt-15", day: "Friday", time: "09:00 - 10:00 AM", courseCode: "CS404", courseName: "Computer Networks", type: "Theory", room: "LH-203", instructor: "Dr. A. Sharma", color: "#f59e0b" },
  { id: "tt-16", day: "Friday", time: "10:00 - 11:00 AM", courseCode: "CS403", courseName: "DBMS", type: "Theory", room: "CS-Lab 1", instructor: "Prof. M. Srinivas", color: "#10b981" },
  { id: "tt-17", day: "Friday", time: "11:15 - 12:15 PM", courseCode: "MA401", courseName: "Probability & Stats", type: "Tutorial", room: "LH-302", instructor: "Prof. V. Lakshmi", color: "#ec4899" },
  { id: "tt-18", day: "Friday", time: "02:00 - 04:00 PM", courseCode: "CS401", courseName: "Linux Monitor Demo", type: "Lab", room: "CS-Lab 3", instructor: "Dr. K. Ramanathan", color: "#00f2fe" },
];

export const PROJECT_DETAILS: ProjectShowcase = {
  title: "Linux System Information & Resource Monitoring Tool",
  course: "Operating Systems and Systems Programming (CS401)",
  team: [
    { name: "CharanTej Reddy", rollNo: "2520030422", role: "Team Lead & Core Engine /proc Parsing" },
    { name: "Sathvik", rollNo: "2520030226", role: "Process Monitor, Filtering & Signal Handling" },
    { name: "Chandrakanth Reddy", rollNo: "2520030290", role: "CLI Terminal UI, Gauge Renderers & JSON Export" },
  ],
  description: "A high-performance, modular native C++ Linux system monitoring utility designed to inspect real-time CPU utilization, physical and virtual memory distribution, active process tables, disk I/O metrics, and network bandwidth directly from Linux kernel /proc pseudofiles without third-party runtime dependencies.",
  highlights: [
    "Zero-dependency native Linux C++ architecture using POSIX APIs",
    "Direct kernel /proc filesystem stream parsing for microsecond-level metrics",
    "Interactive Terminal Dashboard with live ANSI bars and color thresholds",
    "Comprehensive process manager with sorting, PID inspection, and SIGTERM/SIGKILL sender",
    "Dual-mode support: Live Refresh Mode and Headless JSON/Text Snapshot Export",
    "Modular architecture verified with unit tests and WSL/Ubuntu native builds",
  ],
  techStack: ["C++17", "Linux Kernel /proc APIs", "POSIX sys/utsname, sysinfo", "CMake / Make", "ANSI Terminal Control"],
  procFiles: [
    { file: "/proc/stat", description: "Aggregated & per-core CPU jiffies (user, nice, system, idle, iowait)", purpose: "Real-time CPU percentage delta computation" },
    { file: "/proc/meminfo", description: "MemTotal, MemFree, MemAvailable, Buffers, Cached, SwapTotal, SwapFree", purpose: "Accurate memory utilization & available RAM breakdown" },
    { file: "/proc/version", description: "Linux kernel build release, compiler version, and machine arch", purpose: "System header and OS environment metadata" },
    { file: "/proc/uptime", description: "System total uptime in seconds and idle time jiffies", purpose: "Continuous uptime calculation in DD:HH:MM:SS" },
    { file: "/proc/loadavg", description: "1-min, 5-min, and 15-min running process load averages", purpose: "System saturation & scheduling pressure metrics" },
    { file: "/proc/[pid]/stat", description: "Process state (R/S/Z/D), PPID, utime, stime, RSS, priority, nice", purpose: "Per-process CPU% and status tracking" },
    { file: "/proc/[pid]/status", description: "VmRSS, VmSize, UID, GID, Threads, Voluntary context switches", purpose: "Per-process memory footprint & thread count" },
    { file: "/proc/net/dev", description: "Network interfaces, RX/TX bytes and packets", purpose: "Live upload & download throughput measurement" },
    { file: "/proc/diskstats", description: "Sector reads/writes and I/O in progress", purpose: "Storage disk read/write transfer rates" },
  ],
  terminalPreview: {
    command: "./bin/linux_monitor --dashboard",
    output: `╔══════════════════════════════════════════════════════════════════════════════╗
║               LINUX SYSTEM INFORMATION & RESOURCE MONITOR TOOL               ║
║                     Course: OSSP  |  Team: Sem 4 CSE                         ║
╚══════════════════════════════════════════════════════════════════════════════╝
 [HOST] charan-workstation | [KERNEL] Linux 6.6.36-microsoft-standard-WSL2 | [UPTIME] 04:18:22
 [CPU LOAD] 1m: 0.42  5m: 0.38  15m: 0.25 | [CORES] 16 Cores | [FREQ] 3.60 GHz

 ┌── CPU UTILIZATION ──────────────────────────────────────────────────────────┐
 │ Core 00: [||||||||||||||||||||....................] 52.4% (User: 38% Sys: 14%) │
 │ Core 01: [||||||||||||............................] 31.0% (User: 22% Sys: 09%) │
 │ Total  : [||||||||||||||||........................] 41.7% [NORMAL]             │
 └─────────────────────────────────────────────────────────────────────────────┘

 ┌── MEMORY UTILIZATION ───────────────────────────────────────────────────────┐
 │ RAM : 11.20 GB / 31.85 GB (35.2%) [Available: 20.65 GB] [Buffers/Cache: 6.4 GB]│
 │ Bar : [||||||||||||||.............................]                         │
 │ SWAP: 0.24 GB / 8.00 GB (3.0%)                                              │
 └─────────────────────────────────────────────────────────────────────────────┘

 ┌── PROCESS TABLE (Top Active by CPU%) ───────────────────────────────────────┐
 │ PID    NAME               STATE      CPU%      MEM%      RSS(MB)    THREADS │
 │ 1042   linux_monitor      R (Run)    2.1%      0.04%     14.2 MB    2       │
 │ 9821   node               S (Sleep)  1.4%      1.80%     572.4 MB   18      │
 │ 412    mysqld             S (Sleep)  0.8%      2.20%     700.1 MB   34      │
 │ 1      systemd            S (Sleep)  0.0%      0.03%     10.8 MB    1       │
 └─────────────────────────────────────────────────────────────────────────────┘`,
  },
};

export const FLASHCARDS: Flashcard[] = [
  {
    id: "fc-1",
    courseCode: "CS401",
    category: "OS & Systems",
    question: "Why does the Linux kernel provide /proc as a pseudo-filesystem instead of normal disk storage?",
    answer: "/proc does not exist on disk. It is generated dynamically in kernel memory when accessed, providing a seamless user-space interface to inspect kernel data structures, hardware state, and active process attributes.",
  },
  {
    id: "fc-2",
    courseCode: "CS401",
    category: "OS & Systems",
    question: "What is the difference between Virtual Memory Size (VmSize) and Resident Set Size (VmRSS)?",
    answer: "VmSize is the total virtual address space allocated to a process (including unmapped and swapped pages), whereas VmRSS (Resident Set Size) is the portion of memory currently mapped to actual physical RAM.",
  },
  {
    id: "fc-3",
    courseCode: "CS402",
    category: "Algorithms",
    question: "When should we use Dynamic Programming over Greedy approaches?",
    answer: "Use Dynamic Programming when the problem exhibits overlapping subproblems and optimal substructure, but the greedy choice property does not guarantee a globally optimal solution.",
  },
  {
    id: "fc-4",
    courseCode: "CS403",
    category: "DBMS",
    question: "What is the primary distinction between 3NF and BCNF?",
    answer: "In 3NF, for every functional dependency X -> Y, either X is a superkey OR Y is a prime attribute. In BCNF (stricter), X MUST ALWAYS be a superkey without exception.",
  },
  {
    id: "fc-5",
    courseCode: "CS404",
    category: "Networks",
    question: "What happens during the TCP Three-Way Handshake?",
    answer: "1. Client sends SYN (seq=x). 2. Server responds with SYN-ACK (seq=y, ack=x+1). 3. Client acknowledges with ACK (ack=y+1). Connection is established.",
  },
];

export const ANNOUNCEMENTS = [
  { id: "an-1", title: "Mid-Term Examination Schedule Released", date: "Sep 28, 2026", tag: "Exam", author: "Academic Dean Office", urgent: true },
  { id: "an-2", title: "OSSP Project Evaluation Slot Allotment", date: "Sep 27, 2026", tag: "CS401", author: "Dr. K. Ramanathan", urgent: false },
  { id: "an-3", title: "Hackathon 'CyberPulse 2026' Registrations Open", date: "Sep 25, 2026", tag: "Events", author: "CSE Student Club", urgent: false },
];
