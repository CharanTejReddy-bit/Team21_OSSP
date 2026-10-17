# Two-Way Inter-Process Communication (IPC) Chat Engine

[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![Standard](https://img.shields.io/badge/Standard-POSIX%20C11-blue.svg)]()
[![Course](https://img.shields.io/badge/Course-OSSP%2025CS2104E-orange.svg)]()
[![Platform](https://img.shields.io/badge/Platform-Linux%20%7C%20WSL2%20%7C%20Windows-purple.svg)]()
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

An asynchronous, bidirectional **Inter-Process Communication (IPC) Chat Application** built in native **C11** for POSIX environments (Ubuntu / WSL2), featuring three swappable IPC kernel backends: **POSIX Shared Memory (`mmap`)**, **POSIX Message Queues (`mq`)**, and **Named Pipes (FIFOs)**.

Developed for the **Operating Systems & Systems Programming (OSSP 25CS2104E)** course by **Team 21**.

---

##  Team 21 Members & Individual Contributions

| Roll Number | Student Name | Core Technical Responsibilities |
|---|---|---|
| **`2520030422`** | **CharanTej Reddy** | Core System Architecture; POSIX Shared Memory (`shm_open`, `ftruncate`, `mmap`) ring buffer; Semaphore synchronization (`sem_mutex`, `sem_items`, `sem_slots`); Kernel resource cleanup lifecycle. |
| **`2520030226`** | **Sathvik** | POSIX Message Queue (`mq_open`, `mq_send`) & Named Pipe (FIFO) implementations; Binary packet framing protocol; IEEE 802.3 CRC32 checksum engine; File transfer chunking over IPC. |
| **`2520030290`** | **Chandrakanth Reddy** | Asynchronous multithreading (`pthreads`) sender/receiver pipeline; ANSI Terminal UI rendering & command parser; Automated test suite; High-throughput stress test & comparative benchmark. |

---

##  System Architecture

```text
+-----------------------------------------------------------------------------+
|                       POSIX Shared Memory (/dev/shm)                        |
|                                                                             |
|  +-------------------------+                   +-------------------------+  |
|  | Mailbox A -> B           |                   | Mailbox B -> A           |  |
|  | * Head (Bob Read)       |                   | * Head (Alice Read)     |  |
|  | * Tail (Alice Write)    |                   | * Tail (Bob Write)      |  |
|  | * 16 Slots (ipc_packet) |                   | * 16 Slots (ipc_packet) |  |
|  +-----------+-------------+                   +-----------^-------------+  |
|              |                                             |                |
+--------------+---------------------------------------------+----------------+
               v                                             |
      +-----------------+                           +-----------------+
      |   Node 2: Bob   |                           |  Node 1: Alice  |
      |   (Peer PID)    |                           |   (Host PID)    |
      +-----------------+                           +-----------------+
```

### Supported IPC Mechanisms
1. **POSIX Shared Memory (`shm`):** Zero-copy dual-mailbox circular ring buffer mapped directly to process virtual memory via `mmap()`, synchronized via 6 POSIX named semaphores (`sem_mutex`, `sem_items`, `sem_slots`).
2. **POSIX Message Queues (`mq`):** Kernel-managed message queues (`/ipc_mq_*`) with priority scheduling (control/ping packets jump to priority 10).
3. **POSIX Named Pipes (`fifo`):** Bidirectional FIFO pairs in `/tmp` using non-blocking stream I/O and `poll()` multiplexing.
4. **UNIX Domain Sockets (`socket`):** Local `AF_UNIX` bidirectional stream transport.

---

##  Performance Benchmarks & Stress Test Results

### 1. High-Throughput Concurrency Stress Test (5,000 Rapid Messages)
- **Packets Exchanged:** 5,000 / 5,000 (**100% Delivery Guarantee**)
- **Packet Loss / Race Conditions:** **0 (Zero)**
- **Elapsed Time:** 0.1106 seconds (110,649 us)
- **Sustained Throughput:** **45,187 msgs/sec**
- **Sustained Bandwidth:** **47.06 MB/sec**
- **Average Packet Delay:** **22.13 us / packet**

### 2. Empirical Benchmark (200 Round-Trip Ping-Pong Exchanges)

| IPC Transport Mechanism | Min RTT | Max RTT | Avg RTT | Throughput | Bandwidth |
|---|---|---|---|---|---|
| **POSIX Shared Memory (`mmap` + Semaphores)** | **34.00 us** | 100.64 ms | **587.20 us** | **3,401.6 msgs/s** | **3.54 MB/s** |
| **POSIX Message Queues (`mq_send`)** | **20.00 us** | 100.57 ms | **614.57 us** | **3,248.3 msgs/s** | **3.38 MB/s** |
| **POSIX Named Pipes (FIFOs)** | **46.00 us** | 100.69 ms | **624.60 us** | **3,195.9 msgs/s** | **3.33 MB/s** |

---

##  Project Repository Structure

```text
ipc-chat-application/
+-- Makefile                               # Comprehensive build automation system
+-- CMakeLists.txt                         # Alternative CMake build system
+-- README.md                              # Main documentation and instructions
+-- LICENSE                                # MIT open source license
+-- IPC_Chat_Application_OSSP_Presentation.pptx # Ready-to-present PowerPoint slides
+-- include/                               # C Header Declarations
|   +-- protocol.h                         # Packet framing, CRC32, and message types
|   +-- ipc_interface.h                    # Abstract polymorphic IPC backend interface
|   +-- ipc_shm.h                          # POSIX Shared Memory + Semaphores backend
|   +-- ipc_mq.h                           # POSIX Message Queue backend
|   +-- ipc_fifo.h                         # POSIX Named Pipe (FIFO) backend
|   +-- ipc_socket.h                       # UNIX Domain Socket backend
|   +-- ui.h                               # ANSI terminal interface & statistics
|   +-- common.h                           # Logging macros and microsecond timing
+-- src/                                   # C11 Implementation Files
|   +-- main.c                             # Main application & multithreaded engine
|   +-- protocol.c                         # CRC32 calculation & packet validation
|   +-- ipc/                               # IPC Backend Implementations
|   |   +-- ipc_shm.c                      # shm_open, mmap, sem_open ring buffer
|   |   +-- ipc_mq.c                       # mq_open, mq_send, mq_timedreceive
|   |   +-- ipc_fifo.c                     # mkfifo, dual /tmp FIFOs with poll
|   |   +-- ipc_socket.c                   # AF_UNIX stream socket
|   |   +-- ipc_factory.c                  # Polymorphic backend factory
|   +-- ui/                                # ANSI terminal styling
|   |   +-- ui.c
|   +-- utils/                             # Common helpers
|       +-- common.c
+-- tests/                                 # Unit, Stress & Benchmark Suites
|   +-- test_protocol.c                    # Packet serialization & CRC32 tests
|   +-- test_ipc_shm.c                     # Shared memory unit test with fork()
|   +-- test_ipc_mq.c                      # Message queue unit test
|   +-- test_ipc_fifo.c                    # Named pipe unit test
|   +-- test_stress.c                      # 5,000-message concurrency stress test
|   +-- benchmark_ipc.c                    # Comparative latency & throughput benchmark
|   +-- test_cleanup.sh                    # Verification of zero /dev/shm leaks
+-- scripts/                               # Execution & Demonstration Scripts
|   +-- demo_automated.py                  # Automated live demonstration runner
|   +-- demo_interactive.sh               # Side-by-side terminal launcher (Linux/WSL)
|   +-- demo_interactive.bat              # Side-by-side terminal launcher (Windows)
|   +-- generate_presentation.py           # PPTX slide deck generator
+-- docs/                                  # Academic Documentation
|   +-- PROJECT_REPORT.md                  # Comprehensive academic report
|   +-- ARCHITECTURE.md                    # Technical design & memory map specification
|   +-- PRESENTATION_SLIDES.md             # Slide transcript and speaker notes
+-- web-inspector/                         # Interactive Visual IPC Web Inspector
|   +-- index.html                         # Real-time memory ring buffer visualizer
|   +-- app.js                             # Simulator logic and packet inspector
|   +-- style.css                          # Dark glassmorphism engineering styling
+-- ipc_chat_py/                           # Pure Python Cross-Platform Engine
    +-- ipc_chat.py                        # Standalone runner for pure Windows environments
```

---

##  How to Build & Run

### Prerequisites
- **Linux or Windows with WSL2 (Ubuntu 22.04 / 24.04)**
- **GCC / Clang** (with `-lrt -lpthread`)
- **Python 3** (for automated demo runner & PPTX generation)

### 1 Compile the Application & Test Suites
Open terminal in WSL or Linux:

```bash
cd "ipc-chat-application"

# Build all binaries
make all
```

### 2 Run Verification Test Suite
```bash
make test
```
Executes `test_protocol`, `test_ipc_shm`, `test_ipc_mq`, `test_ipc_fifo`, `test_stress`, and validates zero leakage with `test_cleanup.sh`.

### 3 Run Comparative Performance Benchmark
```bash
make benchmark
```

---

##  Running the Interactive Two-Way Chat

To chat between two independent processes, open **two separate terminal windows** (or use the provided scripts):

### Terminal 1: Node 1 (Host - Alice)
```bash
./bin/ipc_chat --ipc=shm --channel=team21 --user=Alice --host
```

### Terminal 2: Node 2 (Peer - Bob)
```bash
./bin/ipc_chat --ipc=shm --channel=team21 --user=Bob --client
```

### Selecting Other IPC Backends:
- **POSIX Message Queues:**
  ```bash
  # Window 1
  ./bin/ipc_chat --ipc=mq --channel=team21 --user=Alice --host
  # Window 2
  ./bin/ipc_chat --ipc=mq --channel=team21 --user=Bob --client
  ```
- **Named Pipes (FIFOs):**
  ```bash
  # Window 1
  ./bin/ipc_chat --ipc=fifo --channel=team21 --user=Alice --host
  # Window 2
  ./bin/ipc_chat --ipc=fifo --channel=team21 --user=Bob --client
  ```

---

##  Interactive Slash Commands

Inside the live chat interface, type any of the following commands:

| Command | Action |
|---|---|
| `/ping` | Measures live round-trip latency (RTT in microseconds) via kernel IPC echo |
| `/sendfile <filepath>` | Streams a file directly across process boundaries in 1024-byte IPC chunks |
| `/stats` | Displays live telemetry: packets sent/received, bytes transferred, min/max/avg RTT |
| `/ipc` | Displays active IPC transport descriptor IDs and kernel buffer status |
| `/clear` | Clears the terminal screen and redraws the status banner |
| `/help` | Displays the command reference |
| `/exit` or `/quit` | Gracefully notifies peer, unlinks IPC objects from `/dev/shm`, and exits |

---

##  Live Demonstration Options

### Option A: Automated Demo Scenario
Runs an automated, end-to-end multi-process simulation showing handshake, two-way messaging, latency probe, file transfer, and clean teardown:
```bash
python3 scripts/demo_automated.py
```

### Option B: Side-by-Side Dual Terminal Launchers
- **On Linux / WSL2:**
  ```bash
  bash scripts/demo_interactive.sh shm team21
  ```
- **On Windows (Command Prompt / PowerShell):**
  ```cmd
  scripts\demo_interactive.bat
  ```

### Option C: Web-Based Visual IPC Inspector
Open `web-inspector/index.html` in any web browser to interactively inspect:
- The 16-slot circular ring buffers (`mbox_a2b` and `mbox_b2a`)
- Live Head and Tail pointer increments
- Semaphores (`mutex`, `items`, `slots`)
- Packet struct and hex inspector
- Side-by-side terminal emulator

---

##  Presentation PowerPoint (PPT)
The presentation slide deck is pre-generated and ready for evaluation:
- **File:** `IPC_Chat_Application_OSSP_Presentation.pptx` (located in root directory)
- **Slide Count:** 12 Professional Slides with Theme Styling, Cards, and Architecture Flows.
- **Re-generate anytime:** `python scripts/generate_presentation.py`
- **Slide Script & Notes:** Available in `docs/PRESENTATION_SLIDES.md`

---

##  Originality & Safety Compliance
- **Zero Resource Leakage:** Uses `sigaction` signal interception (`SIGINT`, `SIGTERM`) to guarantee execution of `shm_unlink()`, `sem_close()`, `sem_unlink()`, and `unlink()`.
- **Bounded Memory:** Zero-copy shared memory footprint is strictly capped at 68,240 bytes.
- **Defensive Bounds Checking:** All string operations utilize safe bounded buffers (`snprintf`) to eliminate buffer overflow vulnerabilities.
