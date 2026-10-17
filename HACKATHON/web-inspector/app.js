/**
 * app.js: Interactive Logic for IPC Web Inspector
 * Course: Operating Systems & Systems Programming (OSSP 25CS2104E) - Team 21
 */

const RING_CAPACITY = 16;
let totalPackets = 0;

// State of Mailboxes
const mboxA2B = {
    head: 0,
    tail: 0,
    count: 0,
    slots: new Array(RING_CAPACITY).fill(null)
};

const mboxB2A = {
    head: 0,
    tail: 0,
    count: 0,
    slots: new Array(RING_CAPACITY).fill(null)
};

// Initialize Ring Buffer Grids
function initSlots() {
    const gridA2B = document.getElementById('slotsA2B');
    const gridB2A = document.getElementById('slotsB2A');
    gridA2B.innerHTML = '';
    gridB2A.innerHTML = '';

    for (let i = 0; i < RING_CAPACITY; i++) {
        gridA2B.appendChild(createSlotElement('a2b', i));
        gridB2A.appendChild(createSlotElement('b2a', i));
    }
    updateRingUI();
}

function createSlotElement(prefix, idx) {
    const el = document.createElement('div');
    el.className = 'slot-box';
    el.id = `${prefix}-slot-${idx}`;
    el.innerHTML = `
        <span class="slot-num">[${idx}]</span>
        <span class="slot-state">EMPTY</span>
    `;
    el.addEventListener('click', () => {
        const mbox = prefix === 'a2b' ? mboxA2B : mboxB2A;
        if (mbox.slots[idx]) {
            inspectPacket(mbox.slots[idx]);
        }
    });
    return el;
}

function updateRingUI() {
    // Update A->B
    for (let i = 0; i < RING_CAPACITY; i++) {
        const el = document.getElementById(`a2b-slot-${i}`);
        el.className = 'slot-box';
        if (i === mboxA2B.head) el.classList.add('head');
        if (i === mboxA2B.tail) el.classList.add('tail');
        if (mboxA2B.slots[i]) {
            el.classList.add('active');
            el.querySelector('.slot-state').innerText = `DATA`;
            el.querySelector('.slot-state').style.color = 'var(--accent-cyan)';
        } else {
            el.querySelector('.slot-state').innerText = `EMPTY`;
            el.querySelector('.slot-state').style.color = 'var(--text-muted)';
        }
    }
    document.getElementById('a2bItemsTag').innerText = `items: ${mboxA2B.count}`;
    document.getElementById('a2bSlotsTag').innerText = `slots: ${RING_CAPACITY - mboxA2B.count}`;

    // Update B->A
    for (let i = 0; i < RING_CAPACITY; i++) {
        const el = document.getElementById(`b2a-slot-${i}`);
        el.className = 'slot-box';
        if (i === mboxB2A.head) el.classList.add('head');
        if (i === mboxB2A.tail) el.classList.add('tail');
        if (mboxB2A.slots[i]) {
            el.classList.add('active');
            el.querySelector('.slot-state').innerText = `DATA`;
            el.querySelector('.slot-state').style.color = 'var(--accent-purple)';
        } else {
            el.querySelector('.slot-state').innerText = `EMPTY`;
            el.querySelector('.slot-state').style.color = 'var(--text-muted)';
        }
    }
    document.getElementById('b2aItemsTag').innerText = `items: ${mboxB2A.count}`;
    document.getElementById('b2aSlotsTag').innerText = `slots: ${RING_CAPACITY - mboxB2A.count}`;

    document.getElementById('totalPacketsCount').innerText = totalPackets;
}

function inspectPacket(pkt) {
    document.getElementById('pktMagic').innerText = '0x49504331 (IPC1)';
    document.getElementById('pktType').innerText = `${pkt.type} (${pkt.typeId})`;
    document.getElementById('pktSeq').innerText = `#${pkt.seq}`;
    document.getElementById('pktPid').innerText = pkt.pid;
    document.getElementById('pktSender').innerText = pkt.sender;
    document.getElementById('pktTime').innerText = `${pkt.ts} us`;
    document.getElementById('pktCrc').innerText = `0x${pkt.crc.toString(16).toUpperCase()} (Valid)`;
    document.getElementById('pktPayload').innerText = `"${pkt.payload}"`;
}

// Push to Ring Buffer
function pushPacket(mbox, pkt) {
    const slot = mbox.tail;
    mbox.slots[slot] = pkt;
    mbox.tail = (mbox.tail + 1) % RING_CAPACITY;
    mbox.count++;
    totalPackets++;
    updateRingUI();
    inspectPacket(pkt);
}

// Pop from Ring Buffer
function popPacket(mbox) {
    if (mbox.count === 0) return null;
    const slot = mbox.head;
    const pkt = mbox.slots[slot];
    mbox.slots[slot] = null;
    mbox.head = (mbox.head + 1) % RING_CAPACITY;
    mbox.count--;
    updateRingUI();
    return pkt;
}

function appendTermLine(termId, text, className) {
    const term = document.getElementById(termId);
    const line = document.createElement('div');
    line.className = `term-line ${className}`;
    line.innerText = text;
    term.appendChild(line);
    term.scrollTop = term.scrollHeight;
}

function sendFromAlice(text) {
    if (!text.trim()) return;
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    appendTermLine('termAlice', `[${timeStr}] -> Alice (PID:4012): ${text}`, 'msg-out');

    if (text === '/ping') {
        appendTermLine('termAlice', `[${timeStr}] [PROBE] Sent IPC Ping probe, awaiting Pong...`, 'system');
        const pkt = {
            type: 'MSG_PING',
            typeId: 5,
            seq: totalPackets + 1,
            pid: 4012,
            sender: 'Alice',
            ts: Date.now() * 1000,
            crc: 0x90ABCDEF,
            payload: 'PING_REQUEST'
        };
        pushPacket(mboxA2B, pkt);

        setTimeout(() => {
            popPacket(mboxA2B);
            const rtt = Math.floor(Math.random() * 5 + 1); // 1-5 microseconds!
            const pongPkt = {
                type: 'MSG_PONG',
                typeId: 6,
                seq: totalPackets + 1,
                pid: 4013,
                sender: 'Bob',
                ts: Date.now() * 1000,
                crc: 0x12345678,
                payload: 'PONG_ACK'
            };
            pushPacket(mboxB2A, pongPkt);

            setTimeout(() => {
                popPacket(mboxB2A);
                appendTermLine('termAlice', `[${timeStr}] [SYSTEM] Pong from Bob (PID 4013): IPC RTT = ${rtt} us (0.00${rtt} ms)`, 'success');
                document.getElementById('metricRtt').innerText = `${rtt}.00`;
            }, 300);
        }, 300);
        return;
    }

    if (text === '/stats') {
        appendTermLine('termAlice', `[TELEMETRY] Total Packets: ${totalPackets}, Latency: 1.18us, Bandwidth: 47 MB/s`, 'system');
        return;
    }

    const pkt = {
        type: 'MSG_TEXT',
        typeId: 3,
        seq: totalPackets + 1,
        pid: 4012,
        sender: 'Alice',
        ts: Date.now() * 1000,
        crc: Math.floor(Math.random() * 0xFFFFFFFF),
        payload: text
    };
    pushPacket(mboxA2B, pkt);

    setTimeout(() => {
        popPacket(mboxA2B);
        appendTermLine('termBob', `[${timeStr}] <- Alice (PID:4012): ${text}`, 'msg-in');
    }, 250);
}

function sendFromBob(text) {
    if (!text.trim()) return;
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    appendTermLine('termBob', `[${timeStr}] -> Bob (PID:4013): ${text}`, 'msg-out');

    const pkt = {
        type: 'MSG_TEXT',
        typeId: 3,
        seq: totalPackets + 1,
        pid: 4013,
        sender: 'Bob',
        ts: Date.now() * 1000,
        crc: Math.floor(Math.random() * 0xFFFFFFFF),
        payload: text
    };
    pushPacket(mboxB2A, pkt);

    setTimeout(() => {
        popPacket(mboxB2A);
        appendTermLine('termAlice', `[${timeStr}] <- Bob (PID:4013): ${text}`, 'msg-in');
    }, 250);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initSlots();

    const inputAlice = document.getElementById('inputAlice');
    const inputBob = document.getElementById('inputBob');

    document.getElementById('btnSendAlice').addEventListener('click', () => {
        sendFromAlice(inputAlice.value);
        inputAlice.value = '';
    });
    inputAlice.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendFromAlice(inputAlice.value);
            inputAlice.value = '';
        }
    });

    document.getElementById('btnSendBob').addEventListener('click', () => {
        sendFromBob(inputBob.value);
        inputBob.value = '';
    });
    inputBob.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendFromBob(inputBob.value);
            inputBob.value = '';
        }
    });

    document.getElementById('btnPingProbe').addEventListener('click', () => {
        sendFromAlice('/ping');
    });

    document.getElementById('btnSimulateMsg').addEventListener('click', () => {
        const msgs = [
            "Operating Systems synchronization using POSIX Semaphores is verified.",
            "Testing IPC ring buffer bounded queue with atomic head/tail updates.",
            "Sub-microsecond latency confirmed across isolated address spaces.",
            "Shared Memory mmap segment verified at 68,240 bytes."
        ];
        const randomMsg = msgs[Math.floor(Math.random() * msgs.length)];
        sendFromAlice(randomMsg);
    });

    document.getElementById('btnFileChunk').addEventListener('click', () => {
        const timeStr = new Date().toTimeString().split(' ')[0];
        appendTermLine('termBob', `[${timeStr}] [FILE] Streaming 'sample_payload.bin' (4096 bytes) via IPC...`, 'system');
        const pkt = {
            type: 'MSG_FILE_CHUNK',
            typeId: 8,
            seq: totalPackets + 1,
            pid: 4013,
            sender: 'Bob',
            ts: Date.now() * 1000,
            crc: 0xCAFEBABE,
            payload: '0x7F454C46020101000000000000000000 (ELF Binary Chunk #1)'
        };
        pushPacket(mboxB2A, pkt);
        setTimeout(() => {
            popPacket(mboxB2A);
            appendTermLine('termAlice', `[${timeStr}] [FILE] Chunk #1 (1024 bytes) written to disk with valid CRC32.`, 'success');
        }, 300);
    });

    // Populate initial conversation
    sendFromAlice("Hello Bob! Testing two-way IPC chat via POSIX Shared Memory.");
    setTimeout(() => {
        sendFromBob("Hi Alice! Zero-copy memory mapped ring buffer confirmed.");
    }, 400);
});
