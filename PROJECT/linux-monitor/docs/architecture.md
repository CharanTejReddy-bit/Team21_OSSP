# Architecture

The application is built using a Producer-Consumer-like multithreaded architecture.

## Data Flow
```text
User Input
    ↓
Terminal UI (Main Thread) <---+
    |                         | Reads (Mutex Locked)
    ↓                         |
Shared Monitoring State (SharedData)
    ↑                         |
    | Writes (Mutex Locked)   |
    |                         |
Background Monitoring Thread -+
    |
    +--> CpuMonitor (Reads /proc/stat)
    +--> MemoryMonitor (Reads /proc/meminfo)
    +--> ProcessMonitor (Reads /proc/[pid]/...)
    +--> SystemInfo (Uses sysinfo(), gethostname())
```

## Component Details
1. **Monitor Thread**: Runs autonomously in the background. Sleeps for a configurable interval (`refreshRateMs`), gathers all metrics into local variables, and then swiftly locks the mutex to transfer the data to the shared state. This minimizes lock contention.
2. **Terminal UI**: Uses `ncurses`. Runs in the main thread in non-blocking mode (`nodelay`). It loops rapidly (10Hz) to capture keyboard input instantly, ensuring high responsiveness while displaying the snapshot of metrics from the shared state.
3. **Data Classes**: Modular classes (`CpuMonitor`, `MemoryMonitor`, etc.) encapsulate the specific parsing logic for Linux `/proc` files, hiding string manipulation and file I/O away from the core loops.
