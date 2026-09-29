#include "cpu_monitor.h"
#include <fstream>
#include <sstream>
#include <iostream>

// Responsibility: CharanTej Reddy
// CPU metric parsing from /proc/stat

CpuMonitor::CpuMonitor() {
    readCpuStat(prevTotal, prevCores);
}

bool CpuMonitor::readCpuStat(CpuTicks& total, std::vector<CpuTicks>& cores) {
    std::ifstream file("/proc/stat");
    if (!file.is_open()) return false;

    std::string line;
    cores.clear();

    while (std::getline(file, line)) {
        if (line.compare(0, 3, "cpu") == 0) {
            std::istringstream ss(line);
            std::string label;
            CpuTicks ticks = {0, 0, 0, 0, 0, 0, 0, 0, 0, 0};
            ss >> label >> ticks.user >> ticks.nice >> ticks.system >> ticks.idle 
               >> ticks.iowait >> ticks.irq >> ticks.softirq >> ticks.steal 
               >> ticks.guest >> ticks.guest_nice;

            if (label == "cpu") {
                total = ticks;
            } else {
                cores.push_back(ticks);
            }
        }
    }
    return true;
}

void CpuMonitor::update(CpuInfo& cpuInfo) {
    CpuTicks currTotal;
    std::vector<CpuTicks> currCores;

    if (!readCpuStat(currTotal, currCores)) return;

    // Calculate total CPU usage
    unsigned long long prevTotalTicks = prevTotal.total();
    unsigned long long currTotalTicks = currTotal.total();
    unsigned long long prevActiveTicks = prevTotal.active();
    unsigned long long currActiveTicks = currTotal.active();

    unsigned long long totalDiff = currTotalTicks - prevTotalTicks;
    unsigned long long activeDiff = currActiveTicks - prevActiveTicks;

    if (totalDiff > 0) {
        cpuInfo.totalUsage = (static_cast<double>(activeDiff) / totalDiff) * 100.0;
    } else {
        cpuInfo.totalUsage = 0.0;
    }

    // Calculate core CPU usage
    cpuInfo.coreUsage.clear();
    for (size_t i = 0; i < currCores.size() && i < prevCores.size(); ++i) {
        unsigned long long pt = prevCores[i].total();
        unsigned long long ct = currCores[i].total();
        unsigned long long pa = prevCores[i].active();
        unsigned long long ca = currCores[i].active();

        unsigned long long td = ct - pt;
        unsigned long long ad = ca - pa;

        if (td > 0) {
            cpuInfo.coreUsage.push_back((static_cast<double>(ad) / td) * 100.0);
        } else {
            cpuInfo.coreUsage.push_back(0.0);
        }
    }

    prevTotal = currTotal;
    prevCores = currCores;
}
