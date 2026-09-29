#include <iostream>
#include <vector>
#include "../src/process_monitor.h"

int main() {
    ProcessMonitor monitor;
    std::vector<ProcessInfo> procs;
    
    monitor.update(procs, 8 * 1024 * 1024); // mock 8GB RAM
    
    std::cout << "Processes found: " << procs.size() << std::endl;
    
    bool foundInit = false;
    for (const auto& p : procs) {
        if (p.pid == 1) {
            foundInit = true;
            std::cout << "Found PID 1: " << p.name << " User: " << p.user << std::endl;
            break;
        }
    }
    
    if (foundInit) {
        std::cout << "Process monitor test passed." << std::endl;
    } else {
        std::cout << "PID 1 not found. Are we in a weird container?" << std::endl;
    }
    
    return 0;
}
