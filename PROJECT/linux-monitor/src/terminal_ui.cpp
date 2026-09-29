#include "terminal_ui.h"
#include "process_control.h"
#include <ncurses.h>
#include <algorithm>
#include <iomanip>
#include <sstream>
#include <unistd.h>
#include <signal.h>

TerminalUI::TerminalUI(SharedData& data) : 
    sharedData(data), currentSort(SortOption::CPU), 
    scrollOffset(0), selectedProcessIndex(0), 
    statusTimeout(0) 
{
    initscr();
    noecho();
    cbreak();
    keypad(stdscr, TRUE);
    nodelay(stdscr, TRUE);
    curs_set(0);

    if (has_colors()) {
        start_color();
        init_pair(1, COLOR_CYAN, COLOR_BLACK);
        init_pair(2, COLOR_GREEN, COLOR_BLACK);
        init_pair(3, COLOR_YELLOW, COLOR_BLACK);
        init_pair(4, COLOR_RED, COLOR_BLACK);
        init_pair(5, COLOR_BLACK, COLOR_WHITE); // selected row
    }
}

TerminalUI::~TerminalUI() {
    endwin();
}

void TerminalUI::sortProcesses(std::vector<ProcessInfo>& procs) {
    if (procs.empty()) return;
    
    auto comp = [this](const ProcessInfo& a, const ProcessInfo& b) {
        switch (currentSort) {
            case SortOption::PID: return a.pid < b.pid;
            case SortOption::CPU: return a.cpuUsage > b.cpuUsage;
            case SortOption::MEM: return a.memoryUsage > b.memoryUsage;
            case SortOption::NAME: return a.name < b.name;
            default: return a.cpuUsage > b.cpuUsage;
        }
    };
    
    std::sort(procs.begin(), procs.end(), comp);
}

void TerminalUI::drawProcessTable(int startY, int height, int width) {
    attron(COLOR_PAIR(1) | A_BOLD);
    mvprintw(startY, 0, "%-6s %-12s %-6s %-6s %-6s %-20s", "PID", "USER", "CPU%", "MEM%", "STATE", "COMMAND");
    attroff(COLOR_PAIR(1) | A_BOLD);

    std::vector<ProcessInfo> localProcs;
    {
        std::lock_guard<std::mutex> lock(sharedData.dataMutex);
        localProcs = sharedData.processes;
    }

    sortProcesses(localProcs);

    if (selectedProcessIndex >= (int)localProcs.size()) {
        selectedProcessIndex = std::max(0, (int)localProcs.size() - 1);
    }
    if (scrollOffset > selectedProcessIndex) {
        scrollOffset = selectedProcessIndex;
    }
    if (selectedProcessIndex >= scrollOffset + height - 2) {
        scrollOffset = selectedProcessIndex - height + 3;
    }

    int row = startY + 1;
    for (int i = scrollOffset; i < (int)localProcs.size() && row < startY + height - 1; ++i, ++row) {
        if (i == selectedProcessIndex) {
            attron(COLOR_PAIR(5));
        }

        const auto& p = localProcs[i];
        size_t maxLen = (width > 48) ? static_cast<size_t>(width - 48) : 0;
        std::string cmd = (maxLen > 0 && p.command.length() > maxLen + 3) ? p.command.substr(0, maxLen) + "..." : p.command;
        
        mvprintw(row, 0, "%-6d %-12.12s %-6.1f %-6.1f %-6c %s", 
                 p.pid, p.user.c_str(), p.cpuUsage, p.memoryUsage, p.state, cmd.c_str());

        if (i == selectedProcessIndex) {
            attroff(COLOR_PAIR(5));
        }
    }
}

void TerminalUI::drawMainView(int height, int width) {
    CpuInfo cpu;
    MemoryInfo mem;
    SystemInfoData sys;
    
    {
        std::lock_guard<std::mutex> lock(sharedData.dataMutex);
        cpu = sharedData.cpu;
        mem = sharedData.memory;
        sys = sharedData.sysInfo;
    }

    attron(COLOR_PAIR(1) | A_BOLD);
    mvprintw(0, (width - 45) / 2, "LINUX SYSTEM INFORMATION & RESOURCE MONITOR");
    attroff(COLOR_PAIR(1) | A_BOLD);
    mvhline(1, 0, ACS_HLINE, width);

    attron(COLOR_PAIR(2) | A_BOLD);
    mvprintw(2, 0, "CPU");
    attroff(COLOR_PAIR(2) | A_BOLD);
    mvprintw(3, 0, "Overall Usage: %.1f%%", cpu.totalUsage);
    
    int row = 4;
    int col = 0;
    for (size_t i = 0; i < cpu.coreUsage.size(); ++i) {
        mvprintw(row, col, "CPU%zu: %5.1f%%", i, cpu.coreUsage[i]);
        col += 15;
        if (col + 15 > width) {
            col = 0;
            row++;
        }
    }

    row++;
    mvhline(row, 0, ACS_HLINE, width);
    row++;

    attron(COLOR_PAIR(3) | A_BOLD);
    mvprintw(row++, 0, "MEMORY");
    attroff(COLOR_PAIR(3) | A_BOLD);
    
    double ramUsedGb = mem.usedRam / (1024.0 * 1024.0);
    double ramTotalGb = mem.totalRam / (1024.0 * 1024.0);
    double swapUsedGb = mem.usedSwap / (1024.0 * 1024.0);
    double swapTotalGb = mem.totalSwap / (1024.0 * 1024.0);

    mvprintw(row++, 0, "RAM : %5.1f / %5.1f GiB", ramUsedGb, ramTotalGb);
    mvprintw(row++, 0, "SWAP: %5.1f / %5.1f GiB", swapUsedGb, swapTotalGb);

    mvhline(row++, 0, ACS_HLINE, width);

    attron(COLOR_PAIR(4) | A_BOLD);
    mvprintw(row++, 0, "SYSTEM");
    attroff(COLOR_PAIR(4) | A_BOLD);
    
    long hours = sys.uptime / 3600;
    long mins = (sys.uptime % 3600) / 60;
    
    mvprintw(row++, 0, "Uptime: %ldh %ldm | Load Avg: %.2f %.2f %.2f | Tasks: %d", 
             hours, mins, sys.loadAvg[0], sys.loadAvg[1], sys.loadAvg[2], sys.activeProcesses);
             
    mvhline(row++, 0, ACS_HLINE, width);

    int procTableHeight = height - row - 2; 
    drawProcessTable(row, procTableHeight, width);

    mvhline(height - 2, 0, ACS_HLINE, width);
    mvprintw(height - 1, 0, "[q]Quit [r]Refresh [s]Sort [k]Kill [t]Term [UP/DOWN]Nav [+/-]Rate:%dms", sharedData.refreshRateMs.load());

    if (statusTimeout > 0) {
        attron(A_REVERSE);
        mvprintw(height - 1, width - statusMessage.length() - 2, " %s ", statusMessage.c_str());
        attroff(A_REVERSE);
        statusTimeout--;
    }
}

void TerminalUI::showConfirmationDialog(const std::string& message, int pid, int signalNum) {
    nodelay(stdscr, FALSE); 
    
    int h = 5, w = 50;
    int max_y, max_x;
    getmaxyx(stdscr, max_y, max_x);
    
    int start_y = (max_y - h) / 2;
    int start_x = (max_x - w) / 2;
    
    WINDOW* win = newwin(h, w, start_y, start_x);
    box(win, 0, 0);
    
    mvwprintw(win, 1, 2, "%s", message.c_str());
    mvwprintw(win, 2, 2, "PID: %d", pid);
    mvwprintw(win, 3, 2, "[Y]es / [N]o");
    
    wrefresh(win);
    
    int ch;
    while ((ch = wgetch(win)) != ERR) {
        if (ch == 'y' || ch == 'Y') {
            std::string errMsg;
            if (ProcessControl::sendSignal(pid, signalNum, errMsg)) {
                statusMessage = "Signal sent successfully.";
            } else {
                statusMessage = errMsg;
            }
            statusTimeout = 50; // 50 ticks ~ 5s
            break;
        } else if (ch == 'n' || ch == 'N' || ch == 27) { 
            statusMessage = "Operation cancelled.";
            statusTimeout = 50;
            break;
        }
    }
    
    delwin(win);
    nodelay(stdscr, TRUE);
    clear(); 
}

void TerminalUI::handleInput(int ch) {
    switch(ch) {
        case 'q':
        case 'Q':
            sharedData.running = false;
            break;
        case 'r':
        case 'R':
            clear();
            break;
        case KEY_UP:
            if (selectedProcessIndex > 0) selectedProcessIndex--;
            break;
        case KEY_DOWN:
            selectedProcessIndex++;
            break;
        case 's':
        case 'S':
            currentSort = static_cast<SortOption>((static_cast<int>(currentSort) + 1) % 4);
            statusMessage = "Sorting changed.";
            statusTimeout = 30; // 30 ticks ~ 3s
            break;
        case '+':
            if (sharedData.refreshRateMs.load() > 250) {
                sharedData.refreshRateMs = sharedData.refreshRateMs.load() - 250;
            }
            break;
        case '-':
            if (sharedData.refreshRateMs.load() < 5000) {
                sharedData.refreshRateMs = sharedData.refreshRateMs.load() + 250;
            }
            break;
        case 'k':
        case 'K':
        case 't':
        case 'T':
            {
                int pid = -1;
                std::string procName;
                {
                    std::lock_guard<std::mutex> lock(sharedData.dataMutex);
                    auto localProcs = sharedData.processes;
                    sortProcesses(localProcs);
                    if (selectedProcessIndex >= 0 && selectedProcessIndex < (int)localProcs.size()) {
                        pid = localProcs[selectedProcessIndex].pid;
                        procName = localProcs[selectedProcessIndex].name;
                    }
                }
                
                if (pid != -1) {
                    if (ch == 'k' || ch == 'K') {
                        showConfirmationDialog("Send SIGKILL to " + procName + "?", pid, SIGKILL);
                    } else {
                        showConfirmationDialog("Send SIGTERM to " + procName + "?", pid, SIGTERM);
                    }
                }
            }
            break;
    }
}

void TerminalUI::run() {
    int max_y, max_x;

    while (sharedData.running) {
        getmaxyx(stdscr, max_y, max_x);
        
        int ch = getch();
        if (ch != ERR) {
            handleInput(ch);
        }

        erase();
        drawMainView(max_y, max_x);
        refresh();
        
        usleep(100000); // 100ms UI tick
    }
}
