#ifndef TERMINAL_UI_H
#define TERMINAL_UI_H

#include "../include/common.h"
#include <string>
#include <vector>

// Responsibility: Team
enum class SortOption {
    PID,
    CPU,
    MEM,
    NAME
};

class TerminalUI {
private:
    SharedData& sharedData;
    SortOption currentSort;
    int scrollOffset;
    int selectedProcessIndex;
    std::string statusMessage;
    int statusTimeout;

    void drawMainView(int height, int width);
    void drawProcessTable(int startY, int height, int width);
    void sortProcesses(std::vector<ProcessInfo>& procs);
    void handleInput(int ch);
    void showConfirmationDialog(const std::string& message, int pid, int signal);

public:
    TerminalUI(SharedData& data);
    ~TerminalUI();

    void run();
};

#endif
