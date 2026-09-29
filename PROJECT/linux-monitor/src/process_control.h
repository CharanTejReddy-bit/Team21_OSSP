#ifndef PROCESS_CONTROL_H
#define PROCESS_CONTROL_H

#include <string>

// Responsibility: Sathvik
class ProcessControl {
public:
    static bool sendSignal(int pid, int signal, std::string& errorMsg);
};

#endif
