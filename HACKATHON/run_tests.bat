@echo off
REM run_tests.bat: Runs the complete verification and stress test suite via WSL
cd /d "%~dp0"
echo ===================================================
echo     Running IPC Test Suite and Stress Tests via WSL
echo ===================================================
wsl bash -c "cd '/mnt/c/Users/CHARAN/Documents/projects/sem 4/ipc-chat-application' && make run-tests"
pause
