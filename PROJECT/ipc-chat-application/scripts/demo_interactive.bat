@echo off
REM demo_interactive.bat: Launches Alice and Bob side-by-side via WSL on Windows
REM Course: Operating Systems & Systems Programming (OSSP 25CS2104E) - Team 21

set IPC_MODE=%1
if "%IPC_MODE%"=="" set IPC_MODE=shm

set CHANNEL=%2
if "%CHANNEL%"=="" set CHANNEL=team21

echo ===================================================================
echo     Launching Interactive IPC Chat in Dual Windows via WSL
echo     IPC Backend: %IPC_MODE%  ^|  Channel: %CHANNEL%
echo ===================================================================

start "Node 1 - Alice (Host)" wsl bash -c "cd '/mnt/c/Users/CHARAN/Documents/projects/sem 4/ipc-chat-application' && ./bin/ipc_chat --ipc=%IPC_MODE% --channel=%CHANNEL% --user=Alice --host"
timeout /t 1 /nobreak >nul
start "Node 2 - Bob (Peer)" wsl bash -c "cd '/mnt/c/Users/CHARAN/Documents/projects/sem 4/ipc-chat-application' && ./bin/ipc_chat --ipc=%IPC_MODE% --channel=%CHANNEL% --user=Bob --client"

echo Both processes spawned in separate windows.
