/**
 * @file protocol.h
 * @brief Inter-Process Communication (IPC) Chat Packet Protocol Definition
 * Course: Operating Systems & Systems Programming (OSSP 25CS2104E)
 * Team 21: CharanTej Reddy, Sathvik, Chandrakanth Reddy
 */

#ifndef IPC_PROTOCOL_H
#define IPC_PROTOCOL_H

#include <stdint.h>
#include <stddef.h>
#include <stdbool.h>
#include <sys/types.h>

#ifdef __cplusplus
extern "C" {
#endif

#define IPC_MAGIC           0x49504331U  /* ASCII "IPC1" */
#define IPC_PROTOCOL_VER    1
#define IPC_USER_MAX        32
#define IPC_PAYLOAD_MAX     1024
#define IPC_CHANNEL_MAX     64
#define RING_BUFFER_CAP     16

/* Message types exchanged between independent processes */
typedef enum {
    MSG_HANDSHAKE      = 1,   /* Initial peer discovery */
    MSG_HANDSHAKE_ACK  = 2,   /* Handshake acknowledgement */
    MSG_TEXT           = 3,   /* Standard chat message */
    MSG_ACK            = 4,   /* Message receipt confirmation */
    MSG_PING           = 5,   /* Latency probe */
    MSG_PONG           = 6,   /* Latency probe response */
    MSG_FILE_START     = 7,   /* File transfer header (filename, size) */
    MSG_FILE_CHUNK     = 8,   /* File binary chunk */
    MSG_FILE_END       = 9,   /* File transfer complete */
    MSG_STATUS         = 10,  /* Status update / notification */
    MSG_TYPING         = 11,  /* Peer typing indicator */
    MSG_DISCONNECT     = 12   /* Graceful peer disconnection */
} ipc_msg_type_t;

/* IPC Packet Structure (Framed with CRC32 integrity check) */
#pragma pack(push, 1)
typedef struct {
    uint32_t magic;                     /* Magic bytes: IPC_MAGIC */
    uint8_t  version;                   /* Protocol version */
    uint8_t  msg_type;                  /* Message type (ipc_msg_type_t) */
    uint16_t flags;                     /* Priority and control flags */
    uint32_t seq_num;                   /* Monotonically increasing sequence number */
    uint32_t ack_num;                   /* Acknowledged sequence number */
    int32_t  sender_pid;                /* OS Process ID of the sender */
    char     sender_name[IPC_USER_MAX]; /* Nickname / username */
    uint64_t timestamp_us;              /* Timestamp in microseconds (CLOCK_REALTIME) */
    uint32_t payload_len;               /* Number of valid bytes in payload */
    uint32_t crc32;                     /* CRC32 checksum of payload */
    char     payload[IPC_PAYLOAD_MAX];  /* Message or chunk data */
} ipc_packet_t;
#pragma pack(pop)

/* File Transfer Metadata Header for MSG_FILE_START */
typedef struct {
    char     filename[128];
    uint64_t file_size;
    uint32_t total_chunks;
    uint32_t chunk_size;
} file_meta_t;

/* CRC32 and Packet Validation Functions */
uint32_t crc32_compute(const void *data, size_t length);
void packet_init(ipc_packet_t *pkt, ipc_msg_type_t type, int32_t pid, const char *sender);
bool packet_set_payload(ipc_packet_t *pkt, const void *data, size_t length);
bool packet_validate(const ipc_packet_t *pkt);
const char *msg_type_to_string(ipc_msg_type_t type);

#ifdef __cplusplus
}
#endif

#endif /* IPC_PROTOCOL_H */
