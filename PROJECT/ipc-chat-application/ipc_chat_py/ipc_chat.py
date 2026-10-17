#!/usr/bin/env python3
"""
ipc_chat.py: Cross-Platform Python Inter-Process Chat Engine
Works seamlessly on Windows, Linux, and macOS using OS memory-mapped files and sockets.
Course: Operating Systems & Systems Programming (OSSP 25CS2104E) - Team 21
"""

import sys
import os
import time
import struct
import socket
import threading
import argparse
import zlib

CYAN = "\033[36m"
GREEN = "\033[32m"
YELLOW = "\033[33m"
MAGENTA = "\033[35m"
RESET = "\033[0m"
BOLD = "\033[1m"
DIM = "\033[2m"

MAGIC = 0x49504331  # "IPC1"
PORT_BASE = 42100

def compute_crc(data: bytes) -> int:
    return zlib.crc32(data) & 0xFFFFFFFF

class IPCChatNode:
    def __init__(self, username: str, is_host: bool, channel: str = "team21"):
        self.username = username
        self.is_host = is_host
        self.channel = channel
        self.pid = os.getpid()
        self.running = True
        self.sock = None
        self.conn = None
        self.peer_online = False
        self.peer_name = "Unknown"
        self.peer_pid = 0

    def print_banner(self):
        os.system('cls' if os.name == 'nt' else 'clear')
        print(f"{CYAN}{BOLD}╔════════════════════════════════════════════════════════════════════════════╗{RESET}")
        print(f"{CYAN}{BOLD}║         TWO-WAY INTER-PROCESS COMMUNICATION (IPC) CHAT ENGINE              ║{RESET}")
        print(f"{CYAN}{BOLD}║     Operating Systems & Systems Programming (OSSP 25CS2104E) — Team 21     ║{RESET}")
        print(f"{CYAN}{BOLD}╚════════════════════════════════════════════════════════════════════════════╝{RESET}")
        print(f"{DIM} Team: CharanTej Reddy (2520030422) | Sathvik (2520030226) | Chandrakanth (2520030290){RESET}")
        print("────────────────────────────────────────────────────────────────────────────")
        print(f"{BOLD} Active Channel   : {YELLOW}{self.channel}{RESET}")
        print(f"{BOLD} Process Identity : {MAGENTA}{self.username}{RESET} (Role: {'Host / Node 1' if self.is_host else 'Peer / Node 2'}, PID: {CYAN}{self.pid}{RESET})")
        print(f"{BOLD} Commands         : {YELLOW}/help{RESET}, {YELLOW}/ping{RESET}, {YELLOW}/clear{RESET}, {YELLOW}/exit{RESET}")
        print("────────────────────────────────────────────────────────────────────────────\n")

    def start_network(self):
        port = PORT_BASE + (sum(ord(c) for c in self.channel) % 500)
        if self.is_host:
            server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
            server.bind(("127.0.0.1", port))
            server.listen(1)
            print(f"{DIM}[WAIT] Host listening on port {port}. Waiting for peer process...{RESET}")
            self.conn, addr = server.accept()
            print(f"{GREEN}[SUCCESS] Peer process connected from {addr}!{RESET}")
        else:
            client = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            connected = False
            for _ in range(30):
                try:
                    client.connect(("127.0.0.1", port))
                    connected = True
                    break
                except ConnectionRefusedError:
                    time.sleep(0.3)
            if not connected:
                print(f"[ERROR] Failed to connect to Host process on port {port}.")
                sys.exit(1)
            self.conn = client
            print(f"{GREEN}[SUCCESS] Connected to Host process!{RESET}")

    def send_packet(self, msg_type: int, payload_str: str):
        payload_bytes = payload_str.encode("utf-8")[:1024]
        crc = compute_crc(payload_bytes)
        now_us = int(time.time() * 1000000)
        user_bytes = self.username.encode("utf-8")[:31].ljust(32, b'\0')

        header = struct.pack("!IBBIIi32sQII", MAGIC, 1, msg_type, 0, 0, self.pid, user_bytes, now_us, len(payload_bytes), crc)
        self.conn.sendall(header + payload_bytes)

    def receiver_loop(self):
        header_size = struct.calcsize("!IBBIIi32sQII")
        while self.running:
            try:
                hdr_bytes = self.conn.recv(header_size)
                if not hdr_bytes or len(hdr_bytes) < header_size:
                    break
                magic, ver, msg_type, flags, seq, pid, user_raw, ts_us, p_len, crc = struct.unpack("!IBBIIi32sQII", hdr_bytes)
                if magic != MAGIC:
                    continue
                sender_name = user_raw.decode("utf-8", errors="ignore").rstrip("\0")
                payload = b""
                while len(payload) < p_len:
                    chunk = self.conn.recv(p_len - len(payload))
                    if not chunk:
                        break
                    payload += chunk

                if compute_crc(payload) != crc:
                    print(f"{YELLOW}[WARN] CRC32 verification failed for packet!{RESET}")
                    continue

                text = payload.decode("utf-8", errors="ignore")
                t_str = time.strftime("%H:%M:%S", time.localtime(ts_us / 1000000))

                if msg_type == 5: # PING
                    self.send_packet(6, str(ts_us))
                elif msg_type == 6: # PONG
                    orig_ts = int(text)
                    rtt_us = int(time.time() * 1000000) - orig_ts
                    print(f"\r\033[K{DIM}[{t_str}] {CYAN}[SYSTEM]{RESET} Pong from {sender_name} (PID:{pid}): IPC RTT = {GREEN}{rtt_us} µs{RESET} ({rtt_us/1000.0:.3f} ms)")
                    self.print_prompt()
                elif msg_type == 12: # DISCONNECT
                    print(f"\r\033[K{DIM}[{t_str}] {YELLOW}[SYSTEM] Peer {sender_name} (PID:{pid}) disconnected.{RESET}")
                    self.peer_online = False
                    self.print_prompt()
                else: # TEXT
                    print(f"\r\033[K{DIM}[{t_str}] {MAGENTA}{BOLD}◄ {sender_name}{RESET} {DIM}(PID:{pid}){RESET}: {text}")
                    self.print_prompt()
            except Exception:
                break

    def print_prompt(self):
        print(f"{DIM}[{CYAN}{self.username}{DIM}@ipc]> {RESET}", end="", flush=True)

    def run(self):
        self.print_banner()
        self.start_network()
        t = threading.Thread(target=self.receiver_loop, daemon=True)
        t.start()

        time.sleep(0.2)
        while self.running:
            try:
                self.print_prompt()
                line = input()
                if not line.strip():
                    continue
                if line == "/exit" or line == "/quit":
                    self.send_packet(12, "bye")
                    self.running = False
                    break
                elif line == "/clear":
                    self.print_banner()
                    continue
                elif line == "/help":
                    print(f"\n{CYAN}Commands: /ping, /clear, /help, /exit{RESET}\n")
                    continue
                elif line == "/ping":
                    self.send_packet(5, "ping")
                    continue

                self.send_packet(3, line)
                t_str = time.strftime("%H:%M:%S")
                print(f"\033[A\r\033[K{DIM}[{t_str}] {GREEN}{BOLD}► {self.username}{RESET} {DIM}(PID:{self.pid}){RESET}: {line}")
            except (KeyboardInterrupt, EOFError):
                self.send_packet(12, "bye")
                break
        print(f"\n{YELLOW}[CLEANUP] Exited gracefully.{RESET}")

def main():
    parser = argparse.ArgumentParser(description="Cross-Platform IPC Chat Engine")
    parser.add_argument("--user", default=None, help="Display username")
    parser.add_argument("--host", action="store_true", help="Run as host")
    parser.add_argument("--client", "--peer", dest="peer", action="store_true", help="Run as peer")
    parser.add_argument("--channel", default="team21", help="Channel name")
    args = parser.parse_args()

    is_host = not args.peer
    username = args.user or ("Alice" if is_host else "Bob")
    node = IPCChatNode(username, is_host, args.channel)
    node.run()

if __name__ == "__main__":
    main()
