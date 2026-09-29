# Linux System Information & Resource Monitoring Tool

**Course:** Operating Systems & Systems Programming (OSSP)  
**Team 21:**
- **CharanTej Reddy** — `2520030422` (CPU & Memory Metric Parsing, `/proc/stat`, `/proc/meminfo`)
- **Sathvik** — `2520030226` (Process Scanner & Lifecycle Control, `opendir()`, `kill()`)
- **Chandrakanth Reddy** — `2520030290` (Multithreading & Synchronization, `pthreads`, CLI Interface)

---

## 📌 Project Overview

A lightweight, real-time Linux system monitoring utility built with **C++17**, interacting directly with the Linux kernel through the **/proc virtual filesystem** and **POSIX APIs**. The project includes both a **Native Linux Terminal Monitoring Engine** (ncurses / CLI) and a **Professional Real-Time Web Command Center** supporting multi-system remote host monitoring over IP.

---

## 🏗️ Architecture & `/proc` Stream Mapping

```text
Linux Kernel Space
       │
       ▼
/proc Virtual Filesystem
 ├── /proc/stat          ──► CPU Utilization, Jiffies Delta, Cores Load
 ├── /proc/meminfo       ──► Physical RAM, Buffers, Cached, Swap Usage
 ├── /proc/uptime        ──► System Total Uptime & Idle Time
 ├── /proc/loadavg       ──► 1m, 5m, 15m Scheduling Load Averages
 └── /proc/[PID]/stat    ──► Process States (R/S/Z/T), CPU%, RSS, Threads
       │
       ▼
C++ Monitoring Engine (pthreads + POSIX signals + mutex)
 ├── Native Terminal UI (ANSI / ncurses live dashboard)
 └── Telemetry API Bridge ──► Real-Time Web Command Center
```

---

## 📂 Project Structure

```text
PROJECT/
├── linux-monitor/               # Native C++ Linux System Monitoring Application
│   ├── include/                 # Header declarations
│   │   ├── common.h
│   │   ├── cpu_monitor.h
│   │   ├── memory_monitor.h
│   │   ├── process_monitor.h
│   │   ├── system_info.h
│   │   └── terminal_ui.h
│   ├── src/                     # C++17 implementations
│   │   ├── main.cpp
│   │   ├── cpu_monitor.cpp
│   │   ├── memory_monitor.cpp
│   │   ├── process_monitor.cpp
│   │   ├── system_info.cpp
│   │   └── terminal_ui.cpp
│   ├── tests/                   # Unit test suite
│   ├── docs/                    # Architecture & implementation specs
│   ├── Makefile                 # Linux compilation rules
│   └── README.md
│
└── web-dashboard/               # Professional Real-Time Web Command Center (Next.js)
    ├── src/
    │   ├── app/
    │   │   ├── api/telemetry/   # Live system & remote IP telemetry endpoint
    │   │   ├── globals.css      # Minimalist dark engineering styling
    │   │   ├── layout.tsx
    │   │   └── page.tsx         # Dashboard assembly & live state polling
    │   ├── components/          # Reusable monitoring components
    │   └── data/                # Data models & remote cluster nodes
    ├── package.json
    └── tsconfig.json
```

---

## 🚀 How to Build & Run

### 1️⃣ Native Linux C++ Terminal Monitor

Open a terminal in Ubuntu / Linux (or WSL2):

```bash
cd PROJECT/linux-monitor

# Compile using Makefile
make clean
make

# Run interactive live dashboard
./linux-monitor

# Command line options
./linux-monitor --interval 0.5    # Set refresh rate (0.5s, 1s, 2s, 5s)
./linux-monitor --cpu             # Print CPU utilization breakdown
./linux-monitor --memory          # Print physical RAM & swap metrics
./linux-monitor --process         # Print active process table
./linux-monitor --export out.json # Export JSON telemetry snapshot
```

#### Interactive Terminal Keys:
- `q` : Exit gracefully
- `c` : Sort process table by CPU %
- `m` : Sort process table by Memory %
- `p` : Sort process table by PID
- `+` / `-` : Adjust sampling rate

---

### 2️⃣ Real-Time Web Command Center

```bash
cd PROJECT/web-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

Open **`http://localhost:3000`** in your browser.

#### Features:
- **Real-Time CPU Jiffies Sparkline**: 60-second live utilization line graph.
- **Physical Memory & Swap Telemetry**: Real used, available, buffers, and cache.
- **Active Process Manager**: Sorting, live filtering, and process termination with signal safety guards (`SIGTERM` / `SIGKILL`).
- **Multi-System Monitoring by IP**: Switch between local node and remote Linux machines across the network by typing any target IP address.
- **Terminal Emulator & Logs**: Embedded live CLI output and telemetry stream audit trail.
