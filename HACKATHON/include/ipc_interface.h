/**
 * @file ipc_interface.h
 * @brief Common Abstract Interface for Inter-Process Communication Backends
 * Course: Operating Systems & Systems Programming (OSSP 25CS2104E)
 * Team 21: CharanTej Reddy, Sathvik, Chandrakanth Reddy
 */

#ifndef IPC_INTERFACE_H
#define IPC_INTERFACE_H

#include "protocol.h"
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

typedef enum {
    IPC_TYPE_SHM    = 0,  /* POSIX Shared Memory + Named Semaphores */
    IPC_TYPE_MQ     = 1,  /* POSIX Message Queues */
    IPC_TYPE_FIFO   = 2,  /* POSIX Named Pipes (Dual FIFOs) */
    IPC_TYPE_SOCKET = 3   /* UNIX Domain Sockets */
} ipc_backend_type_t;

typedef struct ipc_backend ipc_backend_t;

struct ipc_backend {
    const char *name;
    const char *desc;
    ipc_backend_type_t type;

    /**
     * @brief Initialize the IPC channel
     * @param ctx Pointer to backend context pointer (allocated internally)
     * @param channel_name Unique channel/room identifier (e.g. "team21_chat")
     * @param is_host true if this process is Node 1 (creator/server), false if Node 2 (client)
     * @return 0 on success, negative error code on failure
     */
    int (*init)(void **ctx, const char *channel_name, bool is_host);

    /**
     * @brief Send an IPC packet to the peer process
     * @param ctx Backend context pointer
     * @param pkt Packet to transmit
     * @return 0 on success, negative error code on failure
     */
    int (*send)(void *ctx, const ipc_packet_t *pkt);

    /**
     * @brief Receive an IPC packet from the peer process
     * @param ctx Backend context pointer
     * @param pkt Buffer where the received packet is stored
     * @param timeout_ms Timeout in milliseconds (0 = non-blocking, -1 = infinite)
     * @return 1 on packet received, 0 on timeout, negative on error or peer disconnected
     */
    int (*recv)(void *ctx, ipc_packet_t *pkt, int timeout_ms);

    /**
     * @brief Close the IPC channel connection
     * @param ctx Backend context pointer
     */
    void (*close)(void *ctx);

    /**
     * @brief Unlink/remove kernel and filesystem IPC artifacts
     * @param channel_name Unique channel identifier
     */
    void (*cleanup)(const char *channel_name);
};

/* Backend Factory Functions */
const ipc_backend_t *ipc_get_backend(ipc_backend_type_t type);
const ipc_backend_t *ipc_get_backend_by_name(const char *name);

#ifdef __cplusplus
}
#endif

#endif /* IPC_INTERFACE_H */
