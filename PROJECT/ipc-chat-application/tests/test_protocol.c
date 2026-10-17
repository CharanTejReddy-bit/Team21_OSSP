/**
 * @file test_protocol.c
 * @brief Unit tests for IPC packet protocol, framing, and CRC32 verification
 * Course: Operating Systems & Systems Programming (OSSP 25CS2104E)
 * Team 21: CharanTej Reddy, Sathvik, Chandrakanth Reddy
 */

#include "protocol.h"
#include <stdio.h>
#include <assert.h>
#include <string.h>

int main(void) {
    printf("[TEST] Starting Protocol & CRC32 Unit Tests...\n");

    /* Test 1: CRC32 Known Vector */
    const char *test_str = "123456789";
    uint32_t crc = crc32_compute(test_str, strlen(test_str));
    /* Standard CRC32 of "123456789" is 0xCBF43926 */
    assert(crc == 0xCBF43926U);
    printf("  [PASS] CRC32 verification (vector: '123456789' -> 0xCBF43926)\n");

    /* Test 2: Packet Initialization */
    ipc_packet_t pkt;
    packet_init(&pkt, MSG_TEXT, 1234, "Alice");
    assert(pkt.magic == IPC_MAGIC);
    assert(pkt.version == IPC_PROTOCOL_VER);
    assert(pkt.msg_type == MSG_TEXT);
    assert(pkt.sender_pid == 1234);
    assert(strcmp(pkt.sender_name, "Alice") == 0);
    printf("  [PASS] Packet initialization\n");

    /* Test 3: Payload and CRC Integrity */
    const char *msg = "Hello World via POSIX IPC!";
    assert(packet_set_payload(&pkt, msg, strlen(msg) + 1));
    assert(packet_validate(&pkt) == true);
    printf("  [PASS] Payload attachment and CRC validation\n");

    /* Test 4: Corrupted Payload Detection */
    pkt.payload[2] ^= 0xFF; /* Corrupt one byte */
    assert(packet_validate(&pkt) == false);
    printf("  [PASS] Tampered packet detection (corrupted CRC check)\n");

    /* Test 5: Magic byte tampering */
    pkt.payload[2] ^= 0xFF; /* Restore */
    pkt.magic = 0xDEADBEEF;
    assert(packet_validate(&pkt) == false);
    printf("  [PASS] Invalid magic header rejection\n");

    printf("[SUCCESS] All Protocol Unit Tests Passed!\n\n");
    return 0;
}
