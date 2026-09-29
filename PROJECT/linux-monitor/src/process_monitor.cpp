#include "process_monitor.h"
#include <dirent.h>
#include <fstream>
#include <sstream>
#include <iostream>
#include <pwd.h>
#include <unistd.h>
#include <sys/types.h>
#include <unordered_map>

// Responsibility: Sathvik
// Dynamic process table scanner

ProcessMonitor::ProcessMonitor() {
    systemHertz = sysconf(_SC_CLK_TCK);
}

std::string ProcessMonitor::getProcessUser(int uid) {
    static std::unordered_map<int, std::string> userCache;
    if (userCache.find(uid) != userCache.end()) {
        return userCache[uid];
    }

    struct passwd* pw = getpwuid(uid);
    if (pw) {
        userCache[uid] = pw->pw_name;
        return pw->pw_name;
    }
    return std::to_string(uid);
}

std::string ProcessMonitor::getProcessCommand(int pid) {
    std::string path = "/proc/" + std::to_string(pid) + "/cmdline";
    std::ifstream file(path);
    std::string cmd;
    if (file.is_open()) {
        std::getline(file, cmd, '\0');
        if (cmd.empty()) {
            std::string statusPath = "/proc/" + std::to_string(pid) + "/comm";
            std::ifstream commFile(statusPath);
            if (commFile.is_open()) {
                std::getline(commFile, cmd);
                cmd = "[" + cmd + "]";
            }
        } else {
            char c;
            while (file.get(c)) {
                if (c == '\0') cmd += ' ';
                else cmd += c;
            }
        }
    }
    return cmd;
}

void ProcessMonitor::update(std::vector<ProcessInfo>& processes, long long totalMemKiB) {
    processes.clear();
    DIR* dir = opendir("/proc");
    if (!dir) return;

    double systemUptime = 0;
    std::ifstream uptimeFile("/proc/uptime");
    if (uptimeFile.is_open()) {
        uptimeFile >> systemUptime;
    }

    struct dirent* entry;
    std::unordered_map<int, ProcessTicks> currProcessTicks;

    while ((entry = readdir(dir)) != nullptr) {
        if (entry->d_type == DT_DIR) {
            std::string name = entry->d_name;
            if (name.find_first_not_of("0123456789") == std::string::npos) {
                int pid = std::stoi(name);
                ProcessInfo pInfo = {};
                pInfo.pid = pid;

                std::string statPath = "/proc/" + name + "/stat";
                std::ifstream statFile(statPath);
                if (statFile.is_open()) {
                    std::string line;
                    std::getline(statFile, line);
                    
                    size_t firstParen = line.find_first_of('(');
                    size_t lastParen = line.find_last_of(')');
                    
                    if (firstParen != std::string::npos && lastParen != std::string::npos) {
                        pInfo.name = line.substr(firstParen + 1, lastParen - firstParen - 1);
                        
                        std::istringstream ss(line.substr(lastParen + 1));
                        std::string temp;
                        unsigned long long utime = 0, stime = 0, starttime = 0;
                        long rss = 0;
                        
                        ss >> pInfo.state >> temp >> temp >> temp >> temp >> temp >> temp 
                           >> temp >> temp >> temp >> temp >> utime >> stime >> temp 
                           >> temp >> temp >> temp >> temp >> temp >> starttime 
                           >> pInfo.virtualMemory >> rss;

                        pInfo.virtualMemory /= 1024;
                        long pageSize = sysconf(_SC_PAGESIZE);
                        pInfo.rss = (rss * pageSize) / 1024;

                        if (totalMemKiB > 0) {
                            pInfo.memoryUsage = (static_cast<double>(pInfo.rss) / totalMemKiB) * 100.0;
                        } else {
                            pInfo.memoryUsage = 0.0;
                        }

                        unsigned long long totalTime = utime + stime;
                        double seconds = systemUptime - (static_cast<double>(starttime) / systemHertz);
                        pInfo.uptime = static_cast<long long>(seconds);

                        ProcessTicks ticks = {utime, stime, static_cast<unsigned long long>(systemUptime * systemHertz)};
                        currProcessTicks[pid] = ticks;

                        if (prevProcessTicks.find(pid) != prevProcessTicks.end()) {
                            ProcessTicks prev = prevProcessTicks[pid];
                            unsigned long long timeDiff = totalTime - (prev.utime + prev.stime);
                            unsigned long long uptimeDiff = ticks.uptime - prev.uptime;

                            if (uptimeDiff > 0) {
                                pInfo.cpuUsage = (static_cast<double>(timeDiff) / uptimeDiff) * 100.0;
                            } else {
                                pInfo.cpuUsage = 0.0;
                            }
                        } else {
                            pInfo.cpuUsage = 0.0;
                        }
                    }
                } else {
                    continue;
                }

                std::string statusPath = "/proc/" + name + "/status";
                std::ifstream statusFile(statusPath);
                if (statusFile.is_open()) {
                    std::string line;
                    while (std::getline(statusFile, line)) {
                        if (line.compare(0, 4, "Uid:") == 0) {
                            std::istringstream ss(line.substr(4));
                            int uid;
                            ss >> uid;
                            pInfo.user = getProcessUser(uid);
                            break;
                        }
                    }
                }

                pInfo.command = getProcessCommand(pid);
                processes.push_back(pInfo);
            }
        }
    }
    
    closedir(dir);
    prevProcessTicks = currProcessTicks;
}
