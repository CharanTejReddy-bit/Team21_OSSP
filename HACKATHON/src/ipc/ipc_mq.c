/**
 * @file ipc_mq.c
 * @brief POSIX Message Queue IPC Backend Implementation
 * Course: Operating Systems & Systems Programming (OSSP 25CS2104E)
 * Team 21: CharanTej Reddy, Sathvik, Chandrakanth Reddy
 */

#include "ipc_mq.h"
#include "common.h"
#include <fcntl.h>
#include <sys/stat.h>
#include <mqueue.h>
#include <unistd.h>
#include <time.h>

static int mq_backend_init(void **ctx_out, const char *channel_name, bool is_host) {
    mq_ctx_t *ctx = (mq_ctx_t *)calloc(1, sizeof(mq_ctx_t));
    if (!ctx) return -ENOMEM;

    ctx->is_host = is_host;
    snprintf(ctx->tx_name, sizeof(ctx->tx_name), "/ipc_mq_%s_%s", channel_name, is_host ? "a2b" : "b2a");
    snprintf(ctx->rx_name, sizeof(ctx->rx_name), "/ipc_mq_%s_%s", channel_name, is_host ? "b2a" : "a2b");

    struct mq_attr attr;
    memset(&attr, 0, sizeof(attr));
    attr.mq_flags = 0;
    attr.mq_maxmsg = 10;
    attr.mq_msgsize = sizeof(ipc_packet_t);
    attr.mq_curmsgs = 0;

    int oflag_create = O_CREAT | O_RDWR;
    int oflag_open = O_RDWR;

    if (is_host) {
        mq_unlink(ctx->tx_name);
        mq_unlink(ctx->rx_name);

        ctx->tx_mq = mq_open(ctx->tx_name, oflag_create, 0666, &attr);
        ctx->rx_mq = mq_open(ctx->rx_name, oflag_create, 0666, &attr);
    } else {
        /* Client opens queues created by host */
        ctx->tx_mq = (mqd_t)-1;
        ctx->rx_mq = (mqd_t)-1;
        for (int i = 0; i < 20; i++) {
            if (ctx->tx_mq == (mqd_t)-1) ctx->tx_mq = mq_open(ctx->tx_name, oflag_open);
            if (ctx->rx_mq == (mqd_t)-1) ctx->rx_mq = mq_open(ctx->rx_name, oflag_open);
            if (ctx->tx_mq != (mqd_t)-1 && ctx->rx_mq != (mqd_t)-1) break;
            usleep(100000);
        }
    }

    if (ctx->tx_mq == (mqd_t)-1 || ctx->rx_mq == (mqd_t)-1) {
        LOG_ERROR("Failed to open POSIX message queues (%s / %s)", ctx->tx_name, ctx->rx_name);
        if (ctx->tx_mq != (mqd_t)-1) mq_close(ctx->tx_mq);
        if (ctx->rx_mq != (mqd_t)-1) mq_close(ctx->rx_mq);
        free(ctx);
        return -errno;
    }

    *ctx_out = ctx;
    return 0;
}

static int mq_backend_send(void *ctx_ptr, const ipc_packet_t *pkt) {
    mq_ctx_t *ctx = (mq_ctx_t *)ctx_ptr;
    if (!ctx || ctx->tx_mq == (mqd_t)-1 || !pkt) return -EINVAL;

    unsigned int prio = 1;
    if (pkt->msg_type == MSG_PING || pkt->msg_type == MSG_PONG || pkt->msg_type == MSG_DISCONNECT) {
        prio = 10;
    }

    struct timespec ts;
    clock_gettime(CLOCK_REALTIME, &ts);
    ts.tv_sec += 2;

    int ret = mq_timedsend(ctx->tx_mq, (const char *)pkt, sizeof(ipc_packet_t), prio, &ts);
    if (ret != 0) {
        return -errno;
    }
    return 0;
}

static int mq_backend_recv(void *ctx_ptr, ipc_packet_t *pkt, int timeout_ms) {
    mq_ctx_t *ctx = (mq_ctx_t *)ctx_ptr;
    if (!ctx || ctx->rx_mq == (mqd_t)-1 || !pkt) return -EINVAL;

    struct timespec ts;
    clock_gettime(CLOCK_REALTIME, &ts);
    if (timeout_ms < 0) {
        ts.tv_sec += 3600; /* Long wait */
    } else {
        ts.tv_sec += timeout_ms / 1000;
        ts.tv_nsec += (long)(timeout_ms % 1000) * 1000000L;
        if (ts.tv_nsec >= 1000000000L) {
            ts.tv_sec += 1;
            ts.tv_nsec -= 1000000000L;
        }
    }

    unsigned int prio;
    ssize_t bytes = mq_timedreceive(ctx->rx_mq, (char *)pkt, sizeof(ipc_packet_t), &prio, &ts);
    if (bytes < 0) {
        if (errno == ETIMEDOUT) return 0;
        return -errno;
    }
    return 1;
}

static void mq_backend_close(void *ctx_ptr) {
    mq_ctx_t *ctx = (mq_ctx_t *)ctx_ptr;
    if (!ctx) return;
    if (ctx->tx_mq != (mqd_t)-1) mq_close(ctx->tx_mq);
    if (ctx->rx_mq != (mqd_t)-1) mq_close(ctx->rx_mq);
    free(ctx);
}

static void mq_backend_cleanup(const char *channel_name) {
    char name1[128], name2[128];
    snprintf(name1, sizeof(name1), "/ipc_mq_%s_a2b", channel_name);
    snprintf(name2, sizeof(name2), "/ipc_mq_%s_b2a", channel_name);
    mq_unlink(name1);
    mq_unlink(name2);
}

const ipc_backend_t g_ipc_mq_backend = {
    .name = "mq",
    .desc = "POSIX Message Queues (mq_send / mq_timedreceive with priority)",
    .type = IPC_TYPE_MQ,
    .init = mq_backend_init,
    .send = mq_backend_send,
    .recv = mq_backend_recv,
    .close = mq_backend_close,
    .cleanup = mq_backend_cleanup
};
