/**
 * @file ipc_factory.c
 * @brief Factory for selecting IPC Backends
 * Course: Operating Systems & Systems Programming (OSSP 25CS2104E)
 * Team 21: CharanTej Reddy, Sathvik, Chandrakanth Reddy
 */

#include "ipc_interface.h"
#include "ipc_shm.h"
#include "ipc_mq.h"
#include "ipc_fifo.h"
#include "ipc_socket.h"
#include <string.h>

const ipc_backend_t *ipc_get_backend(ipc_backend_type_t type) {
    switch (type) {
        case IPC_TYPE_SHM:    return &g_ipc_shm_backend;
        case IPC_TYPE_MQ:     return &g_ipc_mq_backend;
        case IPC_TYPE_FIFO:   return &g_ipc_fifo_backend;
        case IPC_TYPE_SOCKET: return &g_ipc_socket_backend;
        default:              return &g_ipc_shm_backend;
    }
}

const ipc_backend_t *ipc_get_backend_by_name(const char *name) {
    if (!name) return &g_ipc_shm_backend;
    if (strcasecmp(name, "shm") == 0 || strcasecmp(name, "shared_memory") == 0) {
        return &g_ipc_shm_backend;
    }
    if (strcasecmp(name, "mq") == 0 || strcasecmp(name, "msgqueue") == 0) {
        return &g_ipc_mq_backend;
    }
    if (strcasecmp(name, "fifo") == 0 || strcasecmp(name, "pipe") == 0) {
        return &g_ipc_fifo_backend;
    }
    if (strcasecmp(name, "socket") == 0 || strcasecmp(name, "unix") == 0) {
        return &g_ipc_socket_backend;
    }
    return &g_ipc_shm_backend;
}
