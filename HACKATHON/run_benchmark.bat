@echo off
REM run_benchmark.bat: Runs comparative latency and throughput benchmarks via WSL
cd /d "%~dp0"
echo ===================================================
echo     Running IPC Comparative Benchmark via WSL
echo ===================================================
wsl bash -c "cd '/mnt/c/Users/CHARAN/Documents/projects/sem 4/ipc-chat-application' && ./bin/benchmark_ipc"
pause
