#ifndef MONITOR_THREAD_H
#define MONITOR_THREAD_H

#include "../include/common.h"
#include <pthread.h>

// Responsibility: Chandrakanth Reddy
class MonitorThread {
private:
    SharedData& sharedData;
    pthread_t threadId;

    static void* run(void* arg);

public:
    MonitorThread(SharedData& data);
    ~MonitorThread();
    
    void start();
    void stop();
    void join();
};

#endif
