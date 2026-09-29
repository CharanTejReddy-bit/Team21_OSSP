#include "process_control.h"
#include <signal.h>
#include <errno.h>
#include <string.h>

// Responsibility: Sathvik
// Process management using POSIX signals

bool ProcessControl::sendSignal(int pid, int signalNum, std::string& errorMsg) {
    if (kill(pid, signalNum) == 0) {
        return true;
    } else {
        if (errno == EPERM) {
            errorMsg = "Permission denied.";
        } else if (errno == ESRCH) {
            errorMsg = "Process no longer exists.";
        } else {
            errorMsg = std::string("Error: ") + strerror(errno);
        }
        return false;
    }
}
