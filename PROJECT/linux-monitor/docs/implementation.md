# Implementation Details

## CPU Monitoring (`cpu_monitor.cpp`)
- **What it does**: Calculates real-time CPU percentage for the total system and per-core.
- **Why it is required**: CPU usage is not an absolute value; it's a rate.
- **How Linux provides it**: `/proc/stat` provides cumulative ticks spent in user, system, idle, etc. We store the previous ticks, read the current ticks, compute the difference, and calculate the percentage of non-idle time.

## Memory Monitoring (`memory_monitor.cpp`)
- **What it does**: Computes RAM and Swap usage.
- **Why it is required**: To track system footprint.
- **How Linux provides it**: `/proc/meminfo` provides absolute values in KiB. We calculate "Used RAM" as `Total - Free - Buffers - Cached` for an accurate representation similar to `htop`.

## Process Monitoring (`process_monitor.cpp`)
- **What it does**: Scans all active processes and computes their resource usage.
- **Why it is required**: Identifies resource hogs and manages lifecycle.
- **How Linux provides it**: We use POSIX `opendir()` on `/proc`. For each numeric folder (PID), we parse `/proc/[pid]/stat` for CPU ticks, `/proc/[pid]/status` for UID, and `/proc/[pid]/cmdline` for the execution command. CPU usage is derived by comparing process ticks against system uptime elapsed between reads.

## Multithreading (`monitor_thread.cpp`)
- **What it does**: Offloads data collection from the UI thread.
- **Why it is required**: File I/O on `/proc` for thousands of processes can block UI rendering, making the tool feel laggy.
- **How it's implemented**: Uses POSIX `pthread_create`. Thread safety is guaranteed via `std::mutex` around the `SharedData` struct.

## Process Control (`process_control.cpp`)
- **What it does**: Terminates processes.
- **Why it is required**: Core OS functionality for process management.
- **How Linux provides it**: The POSIX `kill(pid, signal)` system call.
