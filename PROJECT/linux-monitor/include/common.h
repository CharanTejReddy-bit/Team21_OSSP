#ifndef COMMON_H
#define COMMON_H

#include <string>
#include <vector>
#include <mutex>
#include <atomic>

struct CpuInfo {
    double totalUsage;
    std::vector<double> coreUsage;
};

struct MemoryInfo {
    long long totalRam; // in KiB
    long long freeRam;
    long long availableRam;
    long long cachedRam;
    long long buffers;
    long long usedRam;

    long long totalSwap;
    long long freeSwap;
    long long usedSwap;
};

struct ProcessInfo {
    int pid;
    std::string name;
    std::string user;
    char state;
    double cpuUsage;
    double memoryUsage;
    long long rss; // in KiB
    long long virtualMemory; // in KiB
    std::string command;
    long long uptime;
};

struct SystemInfoData {
    std::string hostname;
    std::string kernelVersion;
    int numCores;
    long uptime;
    double loadAvg[3];
    int activeProcesses;
};

struct SharedData {
    CpuInfo cpu;
    MemoryInfo memory;
    SystemInfoData sysInfo;
    std::vector<ProcessInfo> processes;
    std::mutex dataMutex;
    std::atomic<bool> running{true};
    std::atomic<int> refreshRateMs{1000};
};

#endif // COMMON_H
