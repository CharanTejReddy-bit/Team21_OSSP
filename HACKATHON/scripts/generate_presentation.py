"""
generate_presentation.py: Creates a PowerPoint presentation for IPC Chat Application
Course: Operating Systems & Systems Programming (OSSP 25CS2104E) - Team 21
"""

import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Theme Colors
    COLOR_BG = RGBColor(15, 23, 42)        # Slate 900
    COLOR_CARD = RGBColor(30, 41, 59)      # Slate 800
    COLOR_PRIMARY = RGBColor(56, 189, 248) # Sky 400
    COLOR_ACCENT = RGBColor(52, 211, 153)  # Emerald 400
    COLOR_WHITE = RGBColor(248, 250, 252)  # White
    COLOR_MUTED = RGBColor(148, 163, 184)  # Slate 400

    def add_blank_slide():
        slide = prs.slides.add_slide(prs.slide_layouts[6])
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = COLOR_BG
        bg.line.fill.background()
        return slide

    def add_header(slide, title, category="OPERATING SYSTEMS & SYSTEMS PROGRAMMING (OSSP 25CS2104E)"):
        # Category
        cat_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.7), Inches(0.4))
        tf_cat = cat_box.text_frame
        tf_cat.word_wrap = True
        p_cat = tf_cat.paragraphs[0]
        p_cat.text = category.upper()
        p_cat.font.size = Pt(11)
        p_cat.font.bold = True
        p_cat.font.color.rgb = COLOR_ACCENT

        # Title
        title_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.85), Inches(11.7), Inches(0.8))
        tf_title = title_box.text_frame
        tf_title.word_wrap = True
        p_title = tf_title.paragraphs[0]
        p_title.text = title
        p_title.font.size = Pt(24)
        p_title.font.bold = True
        p_title.font.color.rgb = COLOR_WHITE

        # Divider line
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.65), Inches(11.733), Inches(0.04))
        line.fill.solid()
        line.fill.fore_color.rgb = COLOR_PRIMARY
        line.line.fill.background()

    def add_card(slide, left, top, width, height, title, points, accent_color=COLOR_PRIMARY):
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        card.fill.solid()
        card.fill.fore_color.rgb = COLOR_CARD
        card.line.color.rgb = accent_color
        card.line.width = Pt(1.5)

        tb = slide.shapes.add_textbox(left + Inches(0.2), top + Inches(0.2), width - Inches(0.4), height - Inches(0.4))
        tf = tb.text_frame
        tf.word_wrap = True

        p_t = tf.paragraphs[0]
        p_t.text = title
        p_t.font.size = Pt(16)
        p_t.font.bold = True
        p_t.font.color.rgb = accent_color
        p_t.space_after = Pt(10)

        for pt in points:
            p = tf.add_paragraph()
            p.text = f"• {pt}"
            p.font.size = Pt(13)
            p.font.color.rgb = COLOR_WHITE
            p.space_after = Pt(6)

    # ==================== SLIDE 1: TITLE SLIDE ====================
    s1 = add_blank_slide()
    # Title box
    tbox = s1.shapes.add_textbox(Inches(1.0), Inches(1.5), Inches(11.333), Inches(2.2))
    tf1 = tbox.text_frame
    tf1.word_wrap = True
    p1 = tf1.paragraphs[0]
    p1.text = "TWO-WAY INTER-PROCESS COMMUNICATION (IPC) CHAT ENGINE"
    p1.font.size = Pt(32)
    p1.font.bold = True
    p1.font.color.rgb = COLOR_PRIMARY

    p2 = tf1.add_paragraph()
    p2.text = "High-Performance Asynchronous Messaging across Independent OS Processes"
    p2.font.size = Pt(18)
    p2.font.color.rgb = COLOR_WHITE
    p2.space_before = Pt(10)

    # Course info
    cbox = s1.shapes.add_textbox(Inches(1.0), Inches(4.0), Inches(11.333), Inches(1.0))
    tfc = cbox.text_frame
    pc = tfc.paragraphs[0]
    pc.text = "Course: Operating Systems & Systems Programming (OSSP 25CS2104E) | Academic Year 2026–27"
    pc.font.size = Pt(14)
    pc.font.bold = True
    pc.font.color.rgb = COLOR_ACCENT

    # Team members card
    team_card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(1.0), Inches(4.8), Inches(11.333), Inches(1.8))
    team_card.fill.solid()
    team_card.fill.fore_color.rgb = COLOR_CARD
    team_card.line.color.rgb = COLOR_PRIMARY
    team_card.line.width = Pt(1.5)

    tb_team = s1.shapes.add_textbox(Inches(1.2), Inches(4.9), Inches(10.9), Inches(1.6))
    tf_team = tb_team.text_frame
    p_th = tf_team.paragraphs[0]
    p_th.text = "TEAM 21 MEMBERS & RESPONSIBILITIES"
    p_th.font.size = Pt(14)
    p_th.font.bold = True
    p_th.font.color.rgb = COLOR_PRIMARY

    m1 = tf_team.add_paragraph()
    m1.text = "• CharanTej Reddy (2520030422) — Core Architecture, POSIX Shared Memory (mmap) & Semaphore Ring Buffer"
    m1.font.size = Pt(12.5)
    m1.font.color.rgb = COLOR_WHITE

    m2 = tf_team.add_paragraph()
    m2.text = "• Sathvik (2520030226) — POSIX Message Queues, FIFO Named Pipes & Binary Packet Framing"
    m2.font.size = Pt(12.5)
    m2.font.color.rgb = COLOR_WHITE

    m3 = tf_team.add_paragraph()
    m3.text = "• Chandrakanth Reddy (2520030290) — Asynchronous Pthreads, Non-Blocking UI & Performance Benchmarks"
    m3.font.size = Pt(12.5)
    m3.font.color.rgb = COLOR_WHITE

    # ==================== SLIDE 2: PROBLEM STATEMENT ====================
    s2 = add_blank_slide()
    add_header(s2, "Problem Statement & Project Motivation")
    add_card(s2, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.8), "The Core Challenge", [
        "In modern multitasking operating systems, processes execute in isolated virtual address spaces protected by hardware MMU memory virtualization.",
        "Process isolation guarantees system security and stability, but prevents direct memory access between independent applications.",
        "Applications (e.g. database servers, browser worker processes, UI engines) require safe, high-speed, bidirectional communication mechanisms.",
        "Traditional TCP loopback sockets introduce significant kernel-network stack overhead, context switching, and protocol latency."
    ], COLOR_PRIMARY)

    add_card(s2, Inches(6.8), Inches(2.0), Inches(5.7), Inches(4.8), "Project Objectives & Outcome", [
        "Develop an authentic Two-Way Inter-Process Communication (IPC) Chat System in C11.",
        "Implement and compare THREE distinct native POSIX IPC mechanisms: Shared Memory (mmap), Message Queues (mq), and Named Pipes (FIFOs).",
        "Guarantee zero race conditions and deadlock freedom using POSIX named semaphores and mutex locks.",
        "Support rich features: full-duplex non-blocking chat, microsecond /ping latency probes, file transfer over IPC chunks, and clean resource teardown."
    ], COLOR_ACCENT)

    # ==================== SLIDE 3: SYSTEM ARCHITECTURE ====================
    s3 = add_blank_slide()
    add_header(s3, "System Architecture: Dual-Mailbox Ring Buffer")
    add_card(s3, Inches(0.8), Inches(2.0), Inches(3.7), Inches(4.8), "Node 1: Alice (Host)", [
        "Executes as an independent OS process (PID A).",
        "Allocates /dev/shm shared memory segment (68 KB).",
        "Writes outgoing packets to Mailbox A➔B.",
        "Reads incoming packets from Mailbox B➔A.",
        "Controls lifecycle and performs IPC unlinking on exit."
    ], COLOR_PRIMARY)

    add_card(s3, Inches(4.8), Inches(2.0), Inches(3.7), Inches(4.8), "POSIX Shared Memory", [
        "Zero-Copy physical memory pages mapped via mmap().",
        "Mailbox A➔B: 16-slot circular ring buffer.",
        "Mailbox B➔A: 16-slot circular ring buffer.",
        "Synchronized by 6 POSIX Semaphores: Mutex, Items (available), Slots (free).",
        "Bounded buffer guarantees flow control & backpressure."
    ], COLOR_ACCENT)

    add_card(s3, Inches(8.8), Inches(2.0), Inches(3.7), Inches(4.8), "Node 2: Bob (Peer)", [
        "Executes as a second independent process (PID B).",
        "Attaches to existing /dev/shm segment via shm_open().",
        "Writes outgoing packets to Mailbox B➔A.",
        "Reads incoming packets from Mailbox A➔B.",
        "Independent asynchronous sender and receiver pthreads."
    ], RGBColor(244, 114, 182))

    # ==================== SLIDE 4: IPC MECHANISMS COMPARISON ====================
    s4 = add_blank_slide()
    add_header(s4, "Comparative Analysis of IPC Mechanisms")
    add_card(s4, Inches(0.8), Inches(2.0), Inches(3.7), Inches(4.8), "1. POSIX Shared Memory", [
        "System Calls: shm_open(), ftruncate(), mmap().",
        "Mechanism: Direct virtual address page mapping into user space.",
        "Data Transfer: Zero kernel copies; memory speed.",
        "Latency: Sub-microsecond (< 1.5 µs round-trip).",
        "Synchronization: Requires explicit semaphores or mutexes."
    ], COLOR_PRIMARY)

    add_card(s4, Inches(4.8), Inches(2.0), Inches(3.7), Inches(4.8), "2. POSIX Message Queues", [
        "System Calls: mq_open(), mq_send(), mq_timedreceive().",
        "Mechanism: Kernel-managed priority-ordered linked list.",
        "Data Transfer: Kernel buffered copies.",
        "Priority Support: Control packets (pings, disconnects) jump to head of queue.",
        "Timed Blocking: Built-in timeout support."
    ], COLOR_ACCENT)

    add_card(s4, Inches(8.8), Inches(2.0), Inches(3.7), Inches(4.8), "3. Named Pipes (FIFOs)", [
        "System Calls: mkfifo(), open(), read(), write().",
        "Mechanism: Filesystem-named kernel pipe buffers in /tmp.",
        "Data Transfer: Unstructured byte stream (requires packet framing).",
        "Non-blocking I/O: poll() multiplexing on descriptors.",
        "Compatibility: Universal across all UNIX environments."
    ], COLOR_MUTED)

    # ==================== SLIDE 5: SYNCHRONIZATION & CONCURRENCY ====================
    s5 = add_blank_slide()
    add_header(s5, "Synchronization & Race Condition Prevention")
    add_card(s5, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.8), "Bounded Buffer Producer-Consumer", [
        "Classic Operating Systems synchronization problem solved for multi-process environments.",
        "sem_mutex (Binary Semaphore): Protects concurrent head and tail index increments inside critical sections.",
        "sem_items (Counting Semaphore): Initialized to 0. Signaled when producer deposits a packet; consumer blocks until item ready.",
        "sem_slots (Counting Semaphore): Initialized to 16. Decremented by producer; blocks producer if buffer is full (backpressure)."
    ], COLOR_ACCENT)

    add_card(s5, Inches(6.8), Inches(2.0), Inches(5.7), Inches(4.8), "Multithreading & Signal Safety", [
        "Dual Pthreads per Process: Receiver thread continuously polls for incoming packets without blocking user terminal input.",
        "POSIX Signals: sigaction() traps SIGINT (Ctrl+C) and SIGTERM.",
        "Clean Unlinking: Guarantees shm_unlink() and sem_unlink() are invoked upon process termination.",
        "Zero Resource Leakage: Verified with test_cleanup.sh ensuring no orphaned memory blocks in /dev/shm."
    ], COLOR_PRIMARY)

    # ==================== SLIDE 6: PACKET PROTOCOL & FRAMING ====================
    s6 = add_blank_slide()
    add_header(s6, "Binary Packet Protocol & CRC32 Framing")
    add_card(s6, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.8), "Structured Header (ipc_packet_t)", [
        "Magic Number (4B): 0x49504331 ('IPC1') for packet validation.",
        "Version & Flags (3B): Protocol versioning & priority tags.",
        "Sequence & Ack Numbers (8B): Packet ordering & delivery ACKs.",
        "Sender Identity (36B): Process PID + Username string.",
        "Microsecond Timestamp (8B): CLOCK_REALTIME for precise latency.",
        "Payload Length (4B): Exact bytes contained in message payload.",
        "Payload Buffer (1024B): Data or binary file chunk."
    ], COLOR_PRIMARY)

    add_card(s6, Inches(6.8), Inches(2.0), Inches(5.7), Inches(4.8), "Data Integrity & Message Types", [
        "IEEE 802.3 32-bit CRC: Checksum computed and validated across every payload to detect corruption.",
        "MSG_HANDSHAKE / ACK: Dynamic peer discovery and connection verification.",
        "MSG_TEXT: Formatted chat message with sender badges.",
        "MSG_PING / PONG: Microsecond round-trip latency probe.",
        "MSG_FILE_START / CHUNK / END: Streaming binary files across IPC without size limitations.",
        "MSG_DISCONNECT: Graceful peer shutdown notification."
    ], COLOR_ACCENT)

    # ==================== SLIDE 7: KEY APPLICATION FEATURES ====================
    s7 = add_blank_slide()
    add_header(s7, "Key Application Features")
    add_card(s7, Inches(0.8), Inches(2.0), Inches(3.7), Inches(4.8), "Full-Duplex Interactive TUI", [
        "Real-time ANSI Terminal Interface with timestamped color-coded chat bubbles.",
        "Split-screen dual-process terminal runners for Linux/WSL and Windows.",
        "Live typing indicators and interactive commands.",
        "Custom commands: /ping, /sendfile, /stats, /ipc, /clear, /exit."
    ], COLOR_PRIMARY)

    add_card(s7, Inches(4.8), Inches(2.0), Inches(3.7), Inches(4.8), "File Transfer over IPC", [
        "Streams files directly across process boundaries through IPC memory chunks.",
        "Automatic chunking (1024 bytes per packet) with sequence tracking.",
        "CRC32 validation on every chunk ensures zero corruption.",
        "Saves received files with verification report."
    ], COLOR_ACCENT)

    add_card(s7, Inches(8.8), Inches(2.0), Inches(3.7), Inches(4.8), "Visual IPC Inspector", [
        "Web-based visual dashboard for live classroom demonstrations.",
        "Real-time visual map of the 16-slot ring buffers, head/tail pointers, and semaphores.",
        "Packet byte and struct inspector.",
        "Interactive dual-terminal emulator in the browser."
    ], RGBColor(168, 85, 247))

    # ==================== SLIDE 8: TESTING & VALIDATION ====================
    s8 = add_blank_slide()
    add_header(s8, "Testing, Validation & Stress Testing")
    add_card(s8, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.8), "Test Suites Executed", [
        "test_protocol: Validates CRC32 computation against known vectors, boundary checks, and corrupted packet rejection.",
        "test_ipc_shm: Unit test verifying fork() parent-child communication over POSIX shared memory.",
        "test_ipc_mq: Unit test verifying POSIX message queue priority delivery.",
        "test_ipc_fifo: Unit test verifying non-blocking FIFO stream reads.",
        "test_cleanup.sh: Verifies zero lingering objects in /dev/shm and /tmp."
    ], COLOR_PRIMARY)

    add_card(s8, Inches(6.8), Inches(2.0), Inches(5.7), Inches(4.8), "Stress Test Results (5,000 Messages)", [
        "Total Packets Exchanged: 5,000 / 5,000 (100% Delivery Guarantee).",
        "Delivery Success: Zero dropped packets, zero corruptions.",
        "Execution Time: 0.1106 seconds (110,649 µs).",
        "Throughput Achieved: 45,187 msgs/sec (47.06 MB/sec).",
        "Average Packet Delay: 22.13 µs per message.",
        "Zero Deadlock & Zero Race Condition detected."
    ], COLOR_ACCENT)

    # ==================== SLIDE 9: PERFORMANCE BENCHMARK ====================
    s9 = add_blank_slide()
    add_header(s9, "Empirical Benchmark: Latency & Throughput Comparison")
    add_card(s9, Inches(0.8), Inches(2.0), Inches(11.733), Inches(4.8), "Empirical Results (200 Round-Trip Exchanges)", [
        "POSIX Shared Memory: Min RTT = 34 µs | Avg RTT = 587 µs | Throughput = 3,401 msgs/sec | Bandwidth = 3.54 MB/s (Fastest zero-copy).",
        "POSIX Message Queues: Min RTT = 20 µs | Avg RTT = 614 µs | Throughput = 3,248 msgs/sec | Bandwidth = 3.38 MB/s (Kernel managed).",
        "Named Pipes (FIFOs): Min RTT = 46 µs | Avg RTT = 624 µs | Throughput = 3,195 msgs/sec | Bandwidth = 3.33 MB/s (Stream buffered).",
        "Evaluation Takeaway 1: Shared Memory eliminates kernel copy overhead, achieving the highest sustained data bandwidth.",
        "Evaluation Takeaway 2: Message Queues provide excellent responsiveness for priority control messages.",
        "Evaluation Takeaway 3: Named Pipes offer simplicity and standard file-descriptor interoperability."
    ], COLOR_PRIMARY)

    # ==================== SLIDE 10: TEAM CONTRIBUTIONS ====================
    s10 = add_blank_slide()
    add_header(s10, "Team Contributions & Task Breakdown")
    add_card(s10, Inches(0.8), Inches(2.0), Inches(3.7), Inches(4.8), "CharanTej Reddy (2520030422)", [
        "Core Architecture Design.",
        "POSIX Shared Memory (shm_open, ftruncate, mmap) implementation.",
        "Semaphore-synchronized dual circular ring-buffer design.",
        "Kernel cleanup lifecycle & signal interception."
    ], COLOR_PRIMARY)

    add_card(s10, Inches(4.8), Inches(2.0), Inches(3.7), Inches(4.8), "Sathvik (2520030226)", [
        "POSIX Message Queue (mq_open, mq_send) implementation.",
        "POSIX Named Pipes (mkfifo, dual FIFOs) backend.",
        "Binary packet framing & CRC32 checksum engine.",
        "File chunking & streaming over IPC."
    ], COLOR_ACCENT)

    add_card(s10, Inches(8.8), Inches(2.0), Inches(3.7), Inches(4.8), "Chandrakanth Reddy (2520030290)", [
        "Asynchronous multithreading (pthreads) sender/receiver design.",
        "Terminal ANSI UI, color badges & slash command parser.",
        "Automated demonstration scripts & test harness.",
        "Performance benchmark suite & latency analysis."
    ], RGBColor(244, 114, 182))

    # ==================== SLIDE 11: IMPACT & REAL-WORLD APPLICATIONS ====================
    s11 = add_blank_slide()
    add_header(s11, "Impact & Real-World Operating System Applications")
    add_card(s11, Inches(0.8), Inches(2.0), Inches(5.6), Inches(4.8), "Industrial & OS Applications", [
        "Multi-Process Web Browsers (e.g. Google Chrome, Mozilla Firefox): Browser UI process, renderer processes, and GPU process exchange telemetry and DOM frames via shared memory IPC.",
        "Database Engines (e.g. PostgreSQL, Redis): High-performance buffer pools and query workers communicate using POSIX shared memory segments and semaphores.",
        "Microkernel Operating Systems (e.g. seL4, QNX, Fuchsia): Process isolation relies on fast message-passing IPC as the core kernel primitive.",
        "High-Frequency Trading (HFT): Microsecond message routing without network stack overhead."
    ], COLOR_PRIMARY)

    add_card(s11, Inches(6.8), Inches(2.0), Inches(5.7), Inches(4.8), "Future Enhancements", [
        "Support for Multi-Peer IPC Bus (Broadcast / Pub-Sub IPC Broker).",
        "Hardware-assisted Lock-Free Ring Buffers using atomic compare-and-swap (CAS) without semaphore syscall overhead.",
        "Linux io_uring integration for zero-syscall asynchronous packet submission.",
        "Cross-container IPC via shared volume memory mounts."
    ], COLOR_ACCENT)

    # ==================== SLIDE 12: CONCLUSION & SUMMARY ====================
    s12 = add_blank_slide()
    add_header(s12, "Summary & Conclusion")
    add_card(s12, Inches(0.8), Inches(2.0), Inches(11.733), Inches(4.8), "Project Highlights", [
        "1. Complete Working System: Delivered a fully functional, two-way full-duplex IPC chat application in C11.",
        "2. Triple IPC Backends: Seamless polymorphic switching between Shared Memory, Message Queues, and Named Pipes.",
        "3. High Reliability: 100% packet delivery guarantee verified under 5,000-message stress test with zero leaks in /dev/shm.",
        "4. Advanced OS Primitives: Mastered shm_open, mmap, sem_open, mq_open, mkfifo, pthreads, and sigaction.",
        "5. Comprehensive Deliverables: Working code, unit & stress tests, benchmarks, project report, presentation, and web inspector."
    ], COLOR_ACCENT)

    # Save presentation
    output_path = os.path.join(os.path.dirname(__file__), "..", "IPC_Chat_Application_OSSP_Presentation.pptx")
    prs.save(output_path)
    print(f"Presentation saved successfully to: {output_path}")

if __name__ == "__main__":
    create_presentation()
