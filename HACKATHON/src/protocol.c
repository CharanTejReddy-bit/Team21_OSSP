/**
 * @file protocol.c
 * @brief Implementation of IPC Packet Framing, CRC32, and Packet Validation
 * Course: Operating Systems & Systems Programming (OSSP 25CS2104E)
 * Team 21: CharanTej Reddy, Sathvik, Chandrakanth Reddy
 */

#include "protocol.h"
#include "common.h"
#include <string.h>

/* IEEE 802.3 32-bit CRC Polynomial: 0xEDB88320 */
static uint32_t crc32_table[256];
static bool crc32_table_ready = false;

static void init_crc32_table(void) {
    for (uint32_t i = 0; i < 256; i++) {
        uint32_t crc = i;
        for (int j = 0; j < 8; j++) {
            if (crc & 1) {
                crc = (crc >> 1) ^ 0xEDB88320U;
            } else {
                crc >>= 1;
            }
        }
        crc32_table[i] = crc;
    }
    crc32_table_ready = true;
}

uint32_t crc32_compute(const void *data, size_t length) {
    if (!crc32_table_ready) {
        init_crc32_table();
    }
    const uint8_t *bytes = (const uint8_t *)data;
    uint32_t crc = 0xFFFFFFFFU;
    for (size_t i = 0; i < length; i++) {
        uint8_t table_idx = (crc ^ bytes[i]) & 0xFF;
        crc = (crc >> 8) ^ crc32_table[table_idx];
    }
    return crc ^ 0xFFFFFFFFU;
}

void packet_init(ipc_packet_t *pkt, ipc_msg_type_t type, int32_t pid, const char *sender) {
    if (!pkt) return;
    memset(pkt, 0, sizeof(ipc_packet_t));
    pkt->magic = IPC_MAGIC;
    pkt->version = IPC_PROTOCOL_VER;
    pkt->msg_type = (uint8_t)type;
    pkt->flags = 0;
    pkt->sender_pid = pid;
    pkt->timestamp_us = get_current_time_us();
    if (sender) {
        strncpy(pkt->sender_name, sender, IPC_USER_MAX - 1);
        pkt->sender_name[IPC_USER_MAX - 1] = '\0';
    } else {
        snprintf(pkt->sender_name, IPC_USER_MAX, "PID-%d", pid);
    }
    pkt->payload_len = 0;
    pkt->crc32 = crc32_compute("", 0);
}

bool packet_set_payload(ipc_packet_t *pkt, const void *data, size_t length) {
    if (!pkt) return false;
    if (length > IPC_PAYLOAD_MAX) {
        length = IPC_PAYLOAD_MAX;
    }
    if (data && length > 0) {
        memcpy(pkt->payload, data, length);
        pkt->payload_len = (uint32_t)length;
        pkt->crc32 = crc32_compute(data, length);
    } else {
        pkt->payload_len = 0;
        pkt->crc32 = crc32_compute("", 0);
    }
    return true;
}

bool packet_validate(const ipc_packet_t *pkt) {
    if (!pkt) return false;
    if (pkt->magic != IPC_MAGIC) return false;
    if (pkt->version != IPC_PROTOCOL_VER) return false;
    if (pkt->payload_len > IPC_PAYLOAD_MAX) return false;
    uint32_t computed_crc = crc32_compute(pkt->payload, pkt->payload_len);
    return (computed_crc == pkt->crc32);
}

const char *msg_type_to_string(ipc_msg_type_t type) {
    switch (type) {
        case MSG_HANDSHAKE:     return "HANDSHAKE";
        case MSG_HANDSHAKE_ACK: return "HANDSHAKE_ACK";
        case MSG_TEXT:          return "TEXT";
        case MSG_ACK:           return "ACK";
        case MSG_PING:          return "PING";
        case MSG_PONG:          return "PONG";
        case MSG_FILE_START:    return "FILE_START";
        case MSG_FILE_CHUNK:    return "FILE_CHUNK";
        case MSG_FILE_END:      return "FILE_END";
        case MSG_STATUS:        return "STATUS";
        case MSG_TYPING:        return "TYPING";
        case MSG_DISCONNECT:    return "DISCONNECT";
        default:                return "UNKNOWN";
    }
}
