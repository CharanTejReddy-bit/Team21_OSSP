# IPC Chat Engine — Architecture & System Design Specification
Course: Operating Systems & Systems Programming (OSSP 25CS2104E) — Team 21

## 1. High-Level Process Architecture

```mermaid
graph TD
    subgraph Process 1: Node 1 (Alice - Host)
        A_UI[ANSI Terminal UI & Input Loop] -->|fgets| A_CMD[Slash Command & Protocol Engine]
        A_CMD -->|packet_init| A_TX_TH[Sender Thread / Function]
        A_RX_TH[Receiver Pthread] -->|ui_render| A_OUT[Terminal Output Window]
    end

    subgraph Linux Kernel & IPC Subsystem
        SHM[POSIX Shared Memory Segment: /dev/shm/ipc_shm_team21]
        SEM[POSIX Named Semaphores: /dev/shm/sem.ipc_s_*]
        MQ[POSIX Message Queues: /dev/mqueue/ipc_mq_*]
        FIFO[POSIX Named Pipes: /tmp/ipc_fifo_*]
    end

    subgraph Process 2: Node 2 (Bob - Peer)
        B_UI[ANSI Terminal UI & Input Loop] -->|fgets| B_CMD[Slash Command & Protocol Engine]
        B_CMD -->|packet_init| B_TX_TH[Sender Thread / Function]
        B_RX_TH[Receiver Pthread] -->|ui_render| B_OUT[Terminal Output Window]
    end

    A_TX_TH -->|sem_wait/mmap write| SHM
    SHM -->|sem_post/mmap read| B_RX_TH

    B_TX_TH -->|sem_wait/mmap write| SHM
    SHM -->|sem_post/mmap read| A_RX_TH
```

---

## 2. Shared Memory Layout (`shm_channel_t`)

The shared memory region allocated via `shm_open()` and configured to 68,240 bytes with `ftruncate()` has the following exact binary layout:

```text
Offset 0x0000 ┌──────────────────────────────────────────────────────────┐
              │ Magic (uint32_t = 0x53484D31 "SHM1")                     │
              │ Host PID (int32_t) | Peer PID (int32_t)                  │
              │ Host Connected (bool) | Peer Connected (bool)            │
              │ Total Packets Transferred (uint64_t)                     │
Offset 0x0020 ├──────────────────────────────────────────────────────────┤
              │ Mailbox A ➔ B (Host to Peer Circular Queue)              │
              │   • Head Index: uint32_t (Consumer read pointer)         │
              │   • Tail Index: uint32_t (Producer write pointer)        │
              │   • Count: uint32_t (Pending unread packets)             │
              │   • Slot [ 0]: ipc_packet_t (1,084 Bytes)                │
              │   • Slot [ 1]: ipc_packet_t (1,084 Bytes)                │
              │   • ...                                                  │
              │   • Slot [15]: ipc_packet_t (1,084 Bytes)                │
              │ Total Mailbox A➔B Size: 17,356 Bytes                     │
Offset 0x43F0 ├──────────────────────────────────────────────────────────┤
              │ Mailbox B ➔ A (Peer to Host Circular Queue)              │
              │   • Head Index: uint32_t (Consumer read pointer)         │
              │   • Tail Index: uint32_t (Producer write pointer)        │
              │   • Count: uint32_t (Pending unread packets)             │
              │   • Slot [ 0]: ipc_packet_t (1,084 Bytes)                │
              │   • Slot [ 1]: ipc_packet_t (1,084 Bytes)                │
              │   • ...                                                  │
              │   • Slot [15]: ipc_packet_t (1,084 Bytes)                │
              │ Total Mailbox B➔A Size: 17,356 Bytes                     │
Offset 0x87C0 └──────────────────────────────────────────────────────────┘
```

---

## 3. Producer-Consumer Semaphore State Transition Table

For Mailbox A➔B:
- Initial state: `sem_mutex = 1`, `sem_items = 0`, `sem_slots = 16`.

| Event | Operation | Mutex | Items | Slots | State Description |
|---|---|---|---|---|---|
| **Initial State** | Init | 1 | 0 | 16 | Mailbox empty; Bob blocks on `sem_wait(items)`. |
| **Alice writes Packet #1** | `sem_wait(slots)` | 1 | 0 | 15 | Slot reserved. |
| | `sem_wait(mutex)` | 0 | 0 | 15 | Critical section entered. |
| | Copy to `slots[tail]` | 0 | 0 | 15 | Tail updated: `(0 + 1) % 16 = 1`. |
| | `sem_post(mutex)` | 1 | 0 | 15 | Critical section exited. |
| | `sem_post(items)` | 1 | 1 | 15 | Item available; Bob wakes up. |
| **Bob reads Packet #1** | `sem_wait(items)` | 1 | 0 | 15 | Bob receives wakeup token. |
| | `sem_wait(mutex)` | 0 | 0 | 15 | Critical section entered. |
| | Copy from `slots[head]`| 0 | 0 | 15 | Head updated: `(0 + 1) % 16 = 1`. |
| | `sem_post(mutex)` | 1 | 0 | 15 | Critical section exited. |
| | `sem_post(slots)` | 1 | 0 | 16 | Slot returned to Alice. |

---

## 4. Signal Trapping and Zero Leakage Guarantee

When an operator presses `Ctrl+C` or a process receives `SIGTERM`:
1. `sigaction` executes `handle_signal(int sig)`.
2. A `MSG_DISCONNECT` packet is dispatched to the peer to prevent hanging reads.
3. Node 2 closes descriptors via `backend->close()`.
4. Node 1 (Host) triggers `backend->cleanup()`, calling:
   - `shm_unlink("/ipc_shm_team21")`
   - `sem_unlink("/ipc_s_team21_a2b_mtx")`, `..._itm`, `..._slt`
   - `sem_unlink("/ipc_s_team21_b2a_mtx")`, `..._itm`, `..._slt`
5. Linux frees all shared memory pages from `/dev/shm`, ensuring 100% clean teardown.
