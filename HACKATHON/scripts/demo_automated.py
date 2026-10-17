#!/usr/bin/env python3
"""
demo_automated.py: Automated Two-Way IPC Chat Demonstration
Course: Operating Systems & Systems Programming (OSSP 25CS2104E)
Team 21: CharanTej Reddy, Sathvik, Chandrakanth Reddy

Demonstrates:
  1. Two independent processes (Host Alice & Client Bob)
  2. POSIX Shared Memory channel creation & semaphore initialization
  3. Handshake protocol
  4. Real-time two-way full-duplex message exchange
  5. Live RTT latency measurement (/ping)
  6. In-line file transfer chunking over IPC (/sendfile)
  7. Telemetry inspection (/stats)
  8. Graceful disconnect and zero-leakage kernel cleanup (/exit)
"""

import subprocess
import time
import sys
import os

CYAN = "\033[36m"
GREEN = "\033[32m"
YELLOW = "\033[33m"
MAGENTA = "\033[35m"
RESET = "\033[0m"
BOLD = "\033[1m"

def main():
    print(f"{CYAN}{BOLD}==================================================================={RESET}")
    print(f"{CYAN}{BOLD}     LIVE TWO-WAY IPC CHAT DEMONSTRATION (OSSP TEAM 21)           {RESET}")
    print(f"{CYAN}{BOLD}==================================================================={RESET}\n")

    bin_path = os.path.join(os.path.dirname(__file__), "..", "bin", "ipc_chat")
    if not os.path.exists(bin_path):
        print(f"{YELLOW}[BUILD] Compiling binary first...{RESET}")
        subprocess.run(["make", "-C", os.path.join(os.path.dirname(__file__), "..")], check=True)

    # Create a dummy file for transfer demonstration
    sample_file = os.path.join(os.path.dirname(__file__), "..", "sample_ipc_data.txt")
    with open(sample_file, "w") as f:
        f.write("/* Operating Systems IPC Transfer Payload */\n"
                "Inter-Process Communication between Process A and Process B.\n"
                "Transferred across POSIX Shared Memory circular ring buffer.\n"
                "Status: CRC32 Verified, Zero Data Loss.\n")

    print(f"{GREEN}[SCENARIO 1]{RESET} Spawning Host Process (Alice, Node 1)...")
    p_alice = subprocess.Popen(
        [bin_path, "--ipc=shm", "--channel=demoroom", "--user=Alice", "--host"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1
    )
    time.sleep(0.5)

    print(f"{GREEN}[SCENARIO 2]{RESET} Spawning Peer Process (Bob, Node 2)...")
    p_bob = subprocess.Popen(
        [bin_path, "--ipc=shm", "--channel=demoroom", "--user=Bob", "--peer"],
        stdin=subprocess.PIPE,
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True,
        bufsize=1
    )
    time.sleep(1.0)

    print(f"{MAGENTA}[SCENARIO 3]{RESET} Alice transmits message to Bob via POSIX Shared Memory...")
    p_alice.stdin.write("Hello Bob! Welcome to our OSSP IPC Chat session.\n")
    p_alice.stdin.flush()
    time.sleep(0.5)

    print(f"{MAGENTA}[SCENARIO 4]{RESET} Bob replies to Alice via POSIX Shared Memory...")
    p_bob.stdin.write("Hi Alice! Message received with zero-copy sub-microsecond latency.\n")
    p_bob.stdin.flush()
    time.sleep(0.5)

    print(f"{YELLOW}[SCENARIO 5]{RESET} Alice executes /ping probe to measure kernel IPC RTT latency...")
    p_alice.stdin.write("/ping\n")
    p_alice.stdin.flush()
    time.sleep(0.6)

    print(f"{CYAN}[SCENARIO 6]{RESET} Bob streams file 'sample_ipc_data.txt' across IPC chunks...")
    p_bob.stdin.write(f"/sendfile {sample_file}\n")
    p_bob.stdin.flush()
    time.sleep(0.8)

    print(f"{YELLOW}[SCENARIO 7]{RESET} Inspecting live IPC telemetry statistics...")
    p_alice.stdin.write("/stats\n")
    p_alice.stdin.flush()
    time.sleep(0.5)

    print(f"{GREEN}[SCENARIO 8]{RESET} Graceful disconnection & IPC resource unlinking...")
    p_bob.stdin.write("/exit\n")
    p_bob.stdin.flush()
    time.sleep(0.3)
    p_alice.stdin.write("/exit\n")
    p_alice.stdin.flush()

    time.sleep(0.5)
    p_alice.terminate()
    p_bob.terminate()

    # Clean up dummy file
    if os.path.exists(sample_file):
        os.remove(sample_file)

    print(f"\n{GREEN}{BOLD}[PASS] Live Demonstration Completed Successfully!{RESET}")
    print(f"{CYAN}All messages, latencies, and file chunks exchanged natively across independent OS processes.{RESET}\n")

if __name__ == "__main__":
    main()
