#include <iostream>
#include <cassert>
#include "../src/memory_monitor.h"

int main() {
    MemoryMonitor monitor;
    MemoryInfo info;
    
    monitor.update(info);
    
    std::cout << "Total RAM: " << info.totalRam << " KiB" << std::endl;
    std::cout << "Used RAM: " << info.usedRam << " KiB" << std::endl;
    
    assert(info.totalRam > 0);
    assert(info.usedRam >= 0);
    
    std::cout << "Memory monitor test passed." << std::endl;
    return 0;
}
