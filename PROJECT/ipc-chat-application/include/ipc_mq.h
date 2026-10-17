/**
 * @file ipc_mq.h
 * @brief POSIX Message Queue IPC Implementation
 * Course: Operating Systems & Systems Programming (OSSP 25CS2104E)
 * Team 21: CharanTej Reddy, Sathvik, Chandrakanth Reddy
 */

#ifndef IPC_MQ_H
#define IPC_MQ_H

#include "ipc_interface.h"
#include <mqueue.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

typedef struct {
    char tx_name[128];
    char rx_name[128];
    mqd_t tx_mq;
    mqd_t rx_mq;
    bool is_host;
} mq_ctx_t;

extern const ipc_backend_t g_ipc_mq_backend;

#ifdef __cplusplus
}
#endif

#endif /* IPC_MQ_H */
