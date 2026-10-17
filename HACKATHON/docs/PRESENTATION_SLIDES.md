# Presentation Slide Deck & Speaker Notes
## Two-Way Inter-Process Communication (IPC) Chat Engine
**Course:** Operating Systems & Systems Programming (OSSP 25CS2104E)  
**Team 21:** CharanTej Reddy (2520030422), Sathvik (2520030226), Chandrakanth Reddy (2520030290)

---

### Slide 1: Title & Team Introduction
- **Title:** TWO-WAY INTER-PROCESS COMMUNICATION (IPC) CHAT ENGINE
- **Subtitle:** High-Performance Asynchronous Messaging across Independent OS Processes
- **Course:** Operating Systems & Systems Programming (OSSP 25CS2104E) -- Term-I 2026-27
- **Team 21 Members & Core Roles:**
  - **CharanTej Reddy (`2520030422`)**: Core Architecture, POSIX Shared Memory (`mmap`) & Semaphore Ring Buffer
  - **Sathvik (`2520030226`)**: POSIX Message Queues (`mq`), Named Pipes (FIFOs) & Binary Packet Framing
  - **Chandrakanth Reddy (`2520030290`)**: Pthreads Asynchronous Multithreading, ANSI TUI & Benchmark Suite
- **Speaker Notes:**
  > "Respected evaluators, today Team 21 presents our project: a native, two-way Inter-Process Communication Chat Engine. We implemented three distinct POSIX IPC mechanisms to allow isolated Linux processes to exchange messages, stream files, and measure microsecond latencies without relying on traditional network socket stacks."

---

### Slide 2: Problem Statement & Motivation
- **Key Points:**
  - Modern OS processes execute in isolated virtual address spaces guarded by the CPU MMU.
  - Inter-process isolation protects system security, but modern systems (browsers, databases, OS services) require fast, safe communication.
  - Network sockets (TCP 127.0.0.1) suffer from high kernel overhead, TCP sequence tracking, and memory copies.
  - Objective: Build an authentic C11 POSIX IPC engine demonstrating low-level kernel system calls, race-condition freedom, and sub-microsecond latency.
- **Speaker Notes:**
  > "Operating systems enforce isolation for security. If Process A attempts to access Process B's memory, the kernel issues a SIGSEGV. We solve this by implementing kernel-supported IPC mechanisms that safely bridge process boundaries."

---

### Slide 3: System Architecture -- Dual-Mailbox Ring Buffer
- **Key Points:**
  - Partitioned physical memory into two circular ring buffers: Mailbox A->B and Mailbox B->A.
  - Node 1 (Alice - Host): Allocates `/dev/shm` segment (68 KB) via `shm_open()` and `mmap()`.
  - Node 2 (Bob - Peer): Attaches to shared memory segment via `shm_open()`.
  - Full-duplex asynchronous sending and receiving using dedicated receiver pthreads.
- **Speaker Notes:**
  > "Notice our dual-mailbox design: Alice writes to Mailbox A-to-B, which Bob reads. Bob writes to Mailbox B-to-A, which Alice reads. This separation completely eliminates bidirectional write contention."

---

### Slide 4: Comparative Analysis of IPC Mechanisms
- **Key Points:**
  - **POSIX Shared Memory (`shm_open`, `mmap`):** Fastest; zero-copy user-space memory access; requires semaphores.
  - **POSIX Message Queues (`mq_open`, `mq_send`):** Kernel-managed message linked list; built-in priority ordering.
  - **POSIX Named Pipes (FIFOs):** Stream-based kernel pipe buffers in `/tmp`; non-blocking `poll()` multiplexing.
- **Speaker Notes:**
  > "We did not just implement one mechanism -- our architecture includes three swappable backends. Shared Memory provides maximum throughput, Message Queues offer priority queues, and FIFOs provide stream simplicity."

---

### Slide 5: Synchronization & Deadlock Freedom
- **Key Points:**
  - Classic Bounded-Buffer Producer-Consumer solution.
  - `sem_mutex` (Binary, init 1): Exclusive access to ring-buffer head/tail indices.
  - `sem_items` (Counting, init 0): Incremented by producer; consumer blocks when empty.
  - `sem_slots` (Counting, init 16): Decremented by producer; blocks producer if buffer is full (backpressure).
  - Clean unlinking via `sigaction()` on `SIGINT` (Ctrl+C).
- **Speaker Notes:**
  > "By pairing sem_items and sem_slots, our ring buffer achieves automatic backpressure and flow control without CPU-burning spinlocks. Our signal handlers guarantee zero memory leaks in /dev/shm."

---

### Slide 6: Binary Packet Protocol & CRC32 Framing
- **Key Points:**
  - `ipc_packet_t` (1,084 Bytes): Magic (`0x49504331`), version, sequence number, timestamps, PID, sender name.
  - IEEE 802.3 32-bit CRC: Checksum computed across every payload to detect corruption.
  - Message Types: Handshake, Chat Text, Ping/Pong Latency Probe, File Start/Chunk/End, Disconnect.
- **Speaker Notes:**
  > "Every message on the wire includes a 32-bit CRC checksum. If any bit flips during transit, the packet is caught and rejected. The protocol also includes microsecond timestamps from CLOCK_REALTIME."

---

### Slide 7: Key Features & Demonstration Capabilities
- **Key Points:**
  - Asynchronous full-duplex ANSI terminal interface.
  - Built-in slash commands: `/ping`, `/sendfile <path>`, `/stats`, `/ipc`, `/clear`, `/exit`.
  - In-line binary file transfer over IPC chunks (1024 bytes per chunk).
  - Interactive Web IPC Inspector showing real-time 16-slot ring buffers, semaphores, and packet hex inspect.
- **Speaker Notes:**
  > "Our application includes a rich command-line interface with colorized chat bubbles, live ping-pong latency measurement, and file transfer directly through IPC memory chunks."

---

### Slide 8: Testing, Validation & Stress Test Results
- **Key Points:**
  - Unit tests: Protocol CRC32, POSIX SHM forking, POSIX MQ, and POSIX FIFO.
  - Stress Test: 5,000 rapid messages exchanged between independent processes.
  - Results: **5,000 / 5,000 packets delivered (100% guarantee)**.
  - Throughput: **45,187 msgs/sec** (47.06 MB/sec sustained bandwidth).
  - Resource Leak Test: Verified 0 lingering objects in `/dev/shm` and `/tmp`.
- **Speaker Notes:**
  > "Our automated stress test pushed 5,000 packets across process boundaries in just 110 milliseconds, achieving over 45,000 messages per second with zero lost packets and zero deadlocks."

---

### Slide 9: Performance Benchmarks Comparison Table
- **Key Points:**
  - Benchmarked 200 round-trip exchanges per mechanism.
  - Shared Memory: Min RTT = 34 us | Avg RTT = 587 us | Bandwidth = 3.54 MB/s.
  - Message Queues: Min RTT = 20 us | Avg RTT = 614 us | Bandwidth = 3.38 MB/s.
  - Named Pipes (FIFOs): Min RTT = 46 us | Avg RTT = 624 us | Bandwidth = 3.33 MB/s.
- **Speaker Notes:**
  > "This empirical comparison proves that Shared Memory delivers the highest bandwidth by bypassing kernel copies, while Message Queues provide quick delivery for priority control frames."

---

### Slide 10: Team Roles & Contributions
- **Key Points:**
  - CharanTej Reddy: Architecture, Shared Memory (`mmap`), Semaphore Ring Buffer, Cleanup.
  - Sathvik: Message Queues, FIFO Named Pipes, Packet Framing, File Chunking.
  - Chandrakanth Reddy: Multithreading (`pthreads`), ANSI UI, Automated Testing, Benchmark Suite.
- **Speaker Notes:**
  > "Each team member spearheaded a major component of the systems programming lifecycle: CharanTej on memory and synchronization, Sathvik on message queues and protocol framing, and Chandrakanth on multithreading and performance testing."

---

### Slide 11: Industrial Impact & Real-World Applications
- **Key Points:**
  - Multi-Process Web Browsers (Chrome, Firefox tab/GPU isolation).
  - Relational Database Engines (PostgreSQL buffer cache & worker coordination).
  - Microkernels (seL4, QNX high-speed message passing).
  - High-Frequency Trading (sub-microsecond local market data routing).
- **Speaker Notes:**
  > "The concepts implemented here are the exact foundational techniques used in Google Chrome's multi-process architecture and PostgreSQL's shared memory engine."

---

### Slide 12: Summary & Conclusion
- **Key Points:**
  - Functional solution meeting 100% of problem statement requirements.
  - Multi-IPC modular design (SHM, MQ, FIFO).
  - Comprehensive repository: Code, tests, benchmarks, docs, presentation, web inspector.
- **Speaker Notes:**
  > "Thank you for your time. We are now delighted to present the live interactive demonstration and answer any questions."
