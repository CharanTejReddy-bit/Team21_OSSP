#!/bin/bash
# test_cleanup.sh: Verifies zero orphan resource leakage in /dev/shm and /tmp
echo "=== Testing IPC Resource Leakage and Cleanup ==="

# Check /dev/shm for lingering team21 artifacts
LEAKS_SHM=$(ls /dev/shm 2>/dev/null | grep -E "ipc_shm|ipc_s_" | wc -l)
echo "Active /dev/shm IPC chat artifacts: $LEAKS_SHM"

# Check /tmp for lingering FIFO or socket artifacts
LEAKS_TMP=$(ls /tmp 2>/dev/null | grep -E "ipc_fifo|ipc_sock" | wc -l)
echo "Active /tmp IPC chat artifacts: $LEAKS_TMP"

if [ "$LEAKS_SHM" -eq 0 ] && [ "$LEAKS_TMP" -eq 0 ]; then
    echo "[PASS] System is completely clean. Zero resource leakage detected."
    exit 0
else
    echo "[WARN] Lingering IPC resources detected. Cleaning up now..."
    rm -f /dev/shm/ipc_* /dev/shm/sem.ipc_* /tmp/ipc_fifo_* /tmp/ipc_sock_* 2>/dev/null
    exit 1
fi
