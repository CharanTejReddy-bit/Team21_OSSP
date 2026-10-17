/**
 * @file ipc_fifo.c
 * @brief POSIX Named Pipe (FIFO) Full-Duplex IPC Backend Implementation
 * Course: Operating Systems & Systems Programming (OSSP 25CS2104E)
 * Team 21: CharanTej Reddy, Sathvik, Chandrakanth Reddy
 */

#include "ipc_fifo.h"
#include "common.h"
#include <fcntl.h>
#include <sys/stat.h>
#include <sys/types.h>
#include <unistd.h>
#include <poll.h>

static int fifo_backend_init(void **ctx_out, const char *channel_name, bool is_host) {
    fifo_ctx_t *ctx = (fifo_ctx_t *)calloc(1, sizeof(fifo_ctx_t));
    if (!ctx) return -ENOMEM;

    ctx->is_host = is_host;
    snprintf(ctx->tx_path, sizeof(ctx->tx_path), "/tmp/ipc_fifo_%s_%s", channel_name, is_host ? "a2b" : "b2a");
    snprintf(ctx->rx_path, sizeof(ctx->rx_path), "/tmp/ipc_fifo_%s_%s", channel_name, is_host ? "b2a" : "a2b");

    if (is_host) {
        unlink(ctx->tx_path);
        unlink(ctx->rx_path);

        if (mkfifo(ctx->tx_path, 0666) != 0 && errno != EEXIST) {
            LOG_ERROR("Failed to create FIFO %s", ctx->tx_path);
            free(ctx);
            return -errno;
        }
        if (mkfifo(ctx->rx_path, 0666) != 0 && errno != EEXIST) {
            LOG_ERROR("Failed to create FIFO %s", ctx->rx_path);
            unlink(ctx->tx_path);
            free(ctx);
            return -errno;
        }
    } else {
        /* Wait for host to create FIFOs */
        for (int i = 0; i < 30; i++) {
            if (access(ctx->tx_path, F_OK) == 0 && access(ctx->rx_path, F_OK) == 0) break;
            usleep(100000);
        }
    }

    /* Open both FIFOs with O_RDWR to prevent blocking and SIGPIPE during startup */
    ctx->tx_fd = open(ctx->tx_path, O_RDWR);
    if (ctx->tx_fd < 0) {
        LOG_ERROR("Failed to open TX FIFO %s", ctx->tx_path);
        free(ctx);
        return -errno;
    }

    ctx->rx_fd = open(ctx->rx_path, O_RDWR);
    if (ctx->rx_fd < 0) {
        LOG_ERROR("Failed to open RX FIFO %s", ctx->rx_path);
        close(ctx->tx_fd);
        free(ctx);
        return -errno;
    }

    *ctx_out = ctx;
    return 0;
}

static int fifo_backend_send(void *ctx_ptr, const ipc_packet_t *pkt) {
    fifo_ctx_t *ctx = (fifo_ctx_t *)ctx_ptr;
    if (!ctx || ctx->tx_fd < 0 || !pkt) return -EINVAL;

    size_t total = sizeof(ipc_packet_t);
    const char *buf = (const char *)pkt;
    size_t written = 0;

    while (written < total) {
        ssize_t n = write(ctx->tx_fd, buf + written, total - written);
        if (n < 0) {
            if (errno == EINTR) continue;
            return -errno;
        }
        written += (size_t)n;
    }
    return 0;
}

static int fifo_backend_recv(void *ctx_ptr, ipc_packet_t *pkt, int timeout_ms) {
    fifo_ctx_t *ctx = (fifo_ctx_t *)ctx_ptr;
    if (!ctx || ctx->rx_fd < 0 || !pkt) return -EINVAL;

    struct pollfd pfd;
    pfd.fd = ctx->rx_fd;
    pfd.events = POLLIN;
    pfd.revents = 0;

    int ret = poll(&pfd, 1, timeout_ms);
    if (ret == 0) return 0; /* Timeout */
    if (ret < 0) {
        if (errno == EINTR) return 0;
        return -errno;
    }

    if (pfd.revents & POLLIN) {
        size_t total = sizeof(ipc_packet_t);
        char *buf = (char *)pkt;
        size_t bytes_read = 0;

        while (bytes_read < total) {
            ssize_t n = read(ctx->rx_fd, buf + bytes_read, total - bytes_read);
            if (n < 0) {
                if (errno == EINTR) continue;
                return -errno;
            }
            if (n == 0) {
                /* Pipe closed by peer */
                return -EPIPE;
            }
            bytes_read += (size_t)n;
        }
        return 1;
    }

    return 0;
}

static void fifo_backend_close(void *ctx_ptr) {
    fifo_ctx_t *ctx = (fifo_ctx_t *)ctx_ptr;
    if (!ctx) return;
    if (ctx->tx_fd >= 0) close(ctx->tx_fd);
    if (ctx->rx_fd >= 0) close(ctx->rx_fd);
    free(ctx);
}

static void fifo_backend_cleanup(const char *channel_name) {
    char path1[128], path2[128];
    snprintf(path1, sizeof(path1), "/tmp/ipc_fifo_%s_a2b", channel_name);
    snprintf(path2, sizeof(path2), "/tmp/ipc_fifo_%s_b2a", channel_name);
    unlink(path1);
    unlink(path2);
}

const ipc_backend_t g_ipc_fifo_backend = {
    .name = "fifo",
    .desc = "POSIX Named Pipes / FIFOs (Dual Full-Duplex /tmp Pipes with poll)",
    .type = IPC_TYPE_FIFO,
    .init = fifo_backend_init,
    .send = fifo_backend_send,
    .recv = fifo_backend_recv,
    .close = fifo_backend_close,
    .cleanup = fifo_backend_cleanup
};
