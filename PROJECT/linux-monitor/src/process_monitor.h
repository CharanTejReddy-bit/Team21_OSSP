#ifndef PROCESS_MONITOR_H
#define PROCESS_MONITOR_H

#include "../include/common.h"
#include <vector>
#include <unordered_map>

// Responsibility: Sathvik
class ProcessMonitor {
private:
    struct ProcessTicks {
        unsigned long long utime;
        unsigned long long stime;
        unsigned long long uptime;
    };
    
    std::unordered_map<int, ProcessTicks> prevProcessTicks;
    long systemHertz = 100;

    std::string getProcessUser(int uid);
    std::string getProcessCommand(int pid);

public:
    ProcessMonitor();
    void update(std::vector<ProcessInfo>& processes, long long totalMemKiB);
};

#endif
