/**
 * @file ipc_socket.h
 * @brief UNIX Domain Socket IPC Implementation
 * Course: Operating Systems & Systems Programming (OSSP 25CS2104E)
 * Team 21: CharanTej Reddy, Sathvik, Chandrakanth Reddy
 */

#ifndef IPC_SOCKET_H
#define IPC_SOCKET_H

#include "ipc_interface.h"
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

typedef struct {
    char socket_path[128];
    int server_fd;
    int conn_fd;
    bool is_host;
} socket_ctx_t;

extern const ipc_backend_t g_ipc_socket_backend;

#ifdef __cplusplus
}
#endif

#endif /* IPC_SOCKET_H */
