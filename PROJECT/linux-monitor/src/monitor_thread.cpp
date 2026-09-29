#include "monitor_thread.h"
#include "cpu_monitor.h"
#include "memory_monitor.h"
#include "process_monitor.h"
#include "system_info.h"
#include <unistd.h>

// Responsibility: Chandrakanth Reddy
// Multithreading implementation using pthreads and synchronization

MonitorThread::MonitorThread(SharedData& data) : sharedData(data), threadId(0) {}

MonitorThread::~MonitorThread() {
    stop();
    join();
}

void MonitorThread::start() {
    pthread_create(&threadId, nullptr, MonitorThread::run, this);
}

void MonitorThread::stop() {
    sharedData.running = false;
}

void MonitorThread::join() {
    if (threadId != 0) {
        pthread_join(threadId, nullptr);
        threadId = 0;
    }
}

void* MonitorThread::run(void* arg) {
    MonitorThread* self = static_cast<MonitorThread*>(arg);
    SharedData& data = self->sharedData;

    CpuMonitor cpuMonitor;
    MemoryMonitor memoryMonitor;
    ProcessMonitor processMonitor;
    SystemInfo sysInfo;

    while (data.running) {
        CpuInfo localCpu;
        MemoryInfo localMem;
        SystemInfoData localSys;
        std::vector<ProcessInfo> localProcs;

        cpuMonitor.update(localCpu);
        memoryMonitor.update(localMem);
        sysInfo.update(localSys);
        processMonitor.update(localProcs, localMem.totalRam);

        {
            std::lock_guard<std::mutex> lock(data.dataMutex);
            data.cpu = localCpu;
            data.memory = localMem;
            data.sysInfo = localSys;
            data.processes = localProcs;
            data.sysInfo.activeProcesses = localProcs.size();
        }

        int rate = data.refreshRateMs.load();
        usleep(rate * 1000);
    }
    return nullptr;
}
