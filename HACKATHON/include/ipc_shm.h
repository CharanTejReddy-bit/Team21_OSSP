/**
 * @file ipc_shm.h
 * @brief POSIX Shared Memory with Named Semaphores IPC Implementation
 * Course: Operating Systems & Systems Programming (OSSP 25CS2104E)
 * Team 21: CharanTej Reddy, Sathvik, Chandrakanth Reddy
 */

#ifndef IPC_SHM_H
#define IPC_SHM_H

#include "ipc_interface.h"
#include "protocol.h"
#include <semaphore.h>
#include <stdbool.h>
#include <stdint.h>

#ifdef __cplusplus
extern "C" {
#endif

/* Bounded circular ring-buffer mailbox */
typedef struct {
    uint32_t head;                     /* Read index (consumer) */
    uint32_t tail;                     /* Write index (producer) */
    uint32_t count;                    /* Current pending packets */
    ipc_packet_t queue[RING_BUFFER_CAP]; /* Pre-allocated slots */
} shm_mailbox_t;

/* Entire shared memory layout mapped into both processes */
typedef struct {
    uint32_t magic;                    /* SHM magic verification */
    volatile int32_t host_pid;         /* Node 1 PID */
    volatile int32_t peer_pid;         /* Node 2 PID */
    volatile bool host_connected;      /* Host online status */
    volatile bool peer_connected;      /* Peer online status */
    volatile uint64_t total_packets;   /* Global packet counter */
    
    shm_mailbox_t mbox_a2b;            /* Channel: Host -> Peer */
    shm_mailbox_t mbox_b2a;            /* Channel: Peer -> Host */
} shm_channel_t;

/* SHM Context structure held by each process */
typedef struct {
    char shm_name[128];
    char sem_mutex_name[128];
    char sem_items_name[128];
    char sem_slots_name[128];
    
    int fd;
    shm_channel_t *channel;
    bool is_host;
    
    /* Semaphores for TX and RX mailboxes */
    sem_t *tx_mutex;
    sem_t *tx_items;
    sem_t *tx_slots;

    sem_t *rx_mutex;
    sem_t *rx_items;
    sem_t *rx_slots;
} shm_ctx_t;

extern const ipc_backend_t g_ipc_shm_backend;

#ifdef __cplusplus
}
#endif

#endif /* IPC_SHM_H */
