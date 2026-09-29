#ifndef CPU_MONITOR_H
#define CPU_MONITOR_H

#include "../include/common.h"
#include <vector>
#include <string>

// Responsibility: CharanTej Reddy
class CpuMonitor {
private:
    struct CpuTicks {
        unsigned long long user;
        unsigned long long nice;
        unsigned long long system;
        unsigned long long idle;
        unsigned long long iowait;
        unsigned long long irq;
        unsigned long long softirq;
        unsigned long long steal;
        unsigned long long guest;
        unsigned long long guest_nice;

        unsigned long long total() const {
            return user + nice + system + idle + iowait + irq + softirq + steal + guest + guest_nice;
        }

        unsigned long long active() const {
            return total() - idle - iowait;
        }
    };

    CpuTicks prevTotal;
    std::vector<CpuTicks> prevCores;

    bool readCpuStat(CpuTicks& total, std::vector<CpuTicks>& cores);

public:
    CpuMonitor();
    void update(CpuInfo& cpuInfo);
};

#endif
