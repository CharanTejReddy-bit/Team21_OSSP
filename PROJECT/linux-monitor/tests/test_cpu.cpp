#include <iostream>
#include <cassert>
#include "../src/cpu_monitor.h"
#include <unistd.h>

int main() {
    CpuMonitor monitor;
    CpuInfo info;
    
    monitor.update(info);
    std::cout << "Initial read total usage (should be 0): " << info.totalUsage << "%" << std::endl;
    
    std::cout << "Sleeping 1 second to gather diff..." << std::endl;
    sleep(1);
    
    monitor.update(info);
    std::cout << "Second read total usage: " << info.totalUsage << "%" << std::endl;
    assert(info.totalUsage >= 0.0 && info.totalUsage <= 100.0);
    
    std::cout << "CPU monitor test passed." << std::endl;
    return 0;
}
