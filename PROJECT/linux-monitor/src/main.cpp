#include "../include/common.h"
#include "monitor_thread.h"
#include "terminal_ui.h"
#include <iostream>

int main() {
    SharedData sharedData;
    
    MonitorThread monitorThread(sharedData);
    monitorThread.start();

    TerminalUI ui(sharedData);
    ui.run();

    monitorThread.stop();
    monitorThread.join();

    return 0;
}
