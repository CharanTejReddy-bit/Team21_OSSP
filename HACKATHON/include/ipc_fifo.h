/**
 * @file ipc_fifo.h
 * @brief POSIX Named Pipe (FIFO) IPC Implementation
 * Course: Operating Systems & Systems Programming (OSSP 25CS2104E)
 * Team 21: CharanTej Reddy, Sathvik, Chandrakanth Reddy
 */

#ifndef IPC_FIFO_H
#define IPC_FIFO_H

#include "ipc_interface.h"
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

typedef struct {
    char tx_path[128];
    char rx_path[128];
    int tx_fd;
    int rx_fd;
    bool is_host;
} fifo_ctx_t;

extern const ipc_backend_t g_ipc_fifo_backend;

#ifdef __cplusplus
}
#endif

#endif /* IPC_FIFO_H */
