#include "system_info.h"
#include <fstream>
#include <unistd.h>
#include <sys/sysinfo.h>
#include <limits.h>

void SystemInfo::update(SystemInfoData& sysInfo) {
    // Hostname
    char hostname[HOST_NAME_MAX];
    if (gethostname(hostname, HOST_NAME_MAX) == 0) {
        sysInfo.hostname = hostname;
    }

    // Kernel version
    std::ifstream versionFile("/proc/version");
    if (versionFile.is_open()) {
        std::string versionLine;
        std::getline(versionFile, versionLine);
        sysInfo.kernelVersion = versionLine.substr(0, versionLine.find(" ("));
    }

    // Uptime and Load Average via sysinfo()
    struct sysinfo si;
    if (sysinfo(&si) == 0) {
        sysInfo.uptime = si.uptime;
        // loadavg is shifted by 16 bits in sysinfo
        sysInfo.loadAvg[0] = static_cast<double>(si.loads[0]) / (1 << 16);
        sysInfo.loadAvg[1] = static_cast<double>(si.loads[1]) / (1 << 16);
        sysInfo.loadAvg[2] = static_cast<double>(si.loads[2]) / (1 << 16);
    }

    // Number of cores
    sysInfo.numCores = sysconf(_SC_NPROCESSORS_ONLN);
}
