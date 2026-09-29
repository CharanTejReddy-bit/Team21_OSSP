# Linux System Information & Resource Monitoring Tool

A lightweight, real-time Linux system monitoring utility that allows users to monitor system resources directly from the terminal, built natively in C++ using POSIX APIs and the Linux `/proc` filesystem.

## Features
- **Real-time CPU Monitoring**: Overall and per-core CPU usage visualization.
- **Memory Tracking**: RAM and SWAP usage tracking with breakdown of caches and buffers.
- **Dynamic Process Table**: Live view of all active processes, sortable by CPU, Memory, PID, or Name.
- **Process Management**: Send SIGTERM and SIGKILL signals to processes directly from the UI with confirmation safeguards.
- **Multithreaded Architecture**: Dedicated background thread for metric collection to ensure responsive UI.
- **Low Overhead**: Direct reading from `/proc` without spawning external processes or heavy runtimes.

## Technologies
- Language: C++17
- Libraries: `ncurses` (for UI), `pthread` (for threading)
- Build System: Make

## Architecture
- **Data Collection (Background Thread)**: Reads `/proc/stat`, `/proc/meminfo`, `/proc/[pid]/stat`, and uses `sysinfo()` to collect metrics.
- **Shared State**: A thread-safe data structure protected by `std::mutex`.
- **UI (Main Thread)**: `ncurses`-based terminal interface that reads from the shared state at a defined refresh rate and handles user inputs.

## Installation & Compilation (Ubuntu)
Ensure you have the necessary dependencies installed:
```bash
sudo apt update
sudo apt install build-essential g++ make libncurses-dev
```

Compile the project:
```bash
make
```

Run the application:
```bash
./linux-monitor
```

## Keyboard Controls
- `q` : Quit
- `r` : Force refresh UI
- `s` : Cycle sorting (PID, CPU, MEM, Name)
- `k` : Send SIGKILL (kill -9) to selected process
- `t` : Send SIGTERM (kill -15) to selected process
- `UP/DOWN` : Navigate process list
- `+ / -` : Increase / Decrease refresh rate

## OS Concepts Demonstrated
1. **Linux Virtual Filesystem**: Extensively uses `/proc` for system state introspection.
2. **Multithreading & Synchronization**: Uses `pthread` and `std::mutex` to prevent race conditions between UI and metric collection.
3. **Signals & Process Control**: Utilizes POSIX `kill()` API for process termination.
4. **CPU Scheduling & Timing**: Calculates CPU utilization dynamically over consecutive samples.

## Team & Contributions
- **CharanTej Reddy (2520030422)**: CPU and memory metric parsing from `/proc/stat` and `/proc/meminfo`.
- **Sathvik (2520030226)**: Dynamic process table scanner and process lifecycle control using `opendir()`, `readdir()`, and `kill()`.
- **Chandrakanth Reddy (2520030290)**: Multithreading implementation using pthreads and synchronization.

## Future Enhancements
- Disk I/O monitoring via `/proc/diskstats`.
- Network bandwidth monitoring via `/proc/net/dev`.
- Filter/Search functionality in the process table.
