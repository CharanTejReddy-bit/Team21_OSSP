@echo off
REM run_demo.bat: One-click launcher for the automated IPC demonstration
cd /d "%~dp0"
echo ===================================================
echo     Running IPC Automated Demonstration via WSL
echo ===================================================
wsl bash -c "cd '/mnt/c/Users/CHARAN/Documents/projects/sem 4/ipc-chat-application' && python3 scripts/demo_automated.py"
pause
