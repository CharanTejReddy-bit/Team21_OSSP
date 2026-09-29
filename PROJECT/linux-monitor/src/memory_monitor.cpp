#include "memory_monitor.h"
#include <fstream>
#include <sstream>
#include <string>
#include <unordered_map>

// Responsibility: CharanTej Reddy
// Memory metric parsing from /proc/meminfo

void MemoryMonitor::update(MemoryInfo& memInfo) {
    std::ifstream file("/proc/meminfo");
    if (!file.is_open()) return;

    std::string line;
    std::unordered_map<std::string, long long> memData;

    while (std::getline(file, line)) {
        std::istringstream ss(line);
        std::string key;
        long long value;

        if (ss >> key >> value) {
            if (!key.empty() && key.back() == ':') {
                key.pop_back();
            }
            memData[key] = value;
        }
    }

    memInfo.totalRam = memData["MemTotal"];
    memInfo.freeRam = memData["MemFree"];
    memInfo.availableRam = memData["MemAvailable"];
    memInfo.cachedRam = memData["Cached"];
    memInfo.buffers = memData["Buffers"];
    
    // Used RAM = Total - Free - Buffers - Cached
    memInfo.usedRam = memInfo.totalRam - memInfo.freeRam - memInfo.buffers - memInfo.cachedRam;

    memInfo.totalSwap = memData["SwapTotal"];
    memInfo.freeSwap = memData["SwapFree"];
    memInfo.usedSwap = memInfo.totalSwap - memInfo.freeSwap;
}
