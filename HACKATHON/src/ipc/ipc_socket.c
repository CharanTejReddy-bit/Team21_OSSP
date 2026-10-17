/**
 * @file ipc_socket.c
 * @brief UNIX Domain Socket IPC Backend Implementation
 * Course: Operating Systems & Systems Programming (OSSP 25CS2104E)
 * Team 21: CharanTej Reddy, Sathvik, Chandrakanth Reddy
 */

#include "ipc_socket.h"
#include "common.h"
#include <sys/socket.h>
#include <sys/un.h>
#include <unistd.h>
#include <poll.h>

static int socket_backend_init(void **ctx_out, const char *channel_name, bool is_host) {
    socket_ctx_t *ctx = (socket_ctx_t *)calloc(1, sizeof(socket_ctx_t));
    if (!ctx) return -ENOMEM;

    ctx->is_host = is_host;
    ctx->server_fd = -1;
    ctx->conn_fd = -1;
    snprintf(ctx->socket_path, sizeof(ctx->socket_path), "/tmp/ipc_sock_%s.sock", channel_name);

    struct sockaddr_un addr;
    memset(&addr, 0, sizeof(addr));
    addr.sun_family = AF_UNIX;
    snprintf(addr.sun_path, sizeof(addr.sun_path), "%s", ctx->socket_path);

    if (is_host) {
        unlink(ctx->socket_path);
        int sfd = socket(AF_UNIX, SOCK_STREAM, 0);
        if (sfd < 0) {
            LOG_ERROR("Failed to create UNIX domain socket");
            free(ctx);
            return -errno;
        }

        if (bind(sfd, (struct sockaddr *)&addr, sizeof(addr)) != 0) {
            LOG_ERROR("Failed to bind UNIX domain socket to %s", ctx->socket_path);
            close(sfd);
            free(ctx);
            return -errno;
        }

        if (listen(sfd, 1) != 0) {
            LOG_ERROR("Failed to listen on UNIX domain socket");
            close(sfd);
            free(ctx);
            return -errno;
        }
        ctx->server_fd = sfd;

        LOG_INFO("Host listening on UNIX socket %s (waiting for peer to connect...)", ctx->socket_path);
        int cfd = accept(sfd, NULL, NULL);
        if (cfd < 0) {
            LOG_ERROR("Failed to accept peer connection");
            close(sfd);
            free(ctx);
            return -errno;
        }
        ctx->conn_fd = cfd;
        LOG_SUCCESS("Peer connected on UNIX socket");
    } else {
        int cfd = socket(AF_UNIX, SOCK_STREAM, 0);
        if (cfd < 0) {
            LOG_ERROR("Failed to create client socket");
            free(ctx);
            return -errno;
        }

        /* Connect to host with retries */
        bool connected = false;
        for (int i = 0; i < 30; i++) {
            if (connect(cfd, (struct sockaddr *)&addr, sizeof(addr)) == 0) {
                connected = true;
                break;
            }
            usleep(100000);
        }

        if (!connected) {
            LOG_ERROR("Failed to connect to host on %s", ctx->socket_path);
            close(cfd);
            free(ctx);
            return -errno;
        }
        ctx->conn_fd = cfd;
    }

    *ctx_out = ctx;
    return 0;
}

static int socket_backend_send(void *ctx_ptr, const ipc_packet_t *pkt) {
    socket_ctx_t *ctx = (socket_ctx_t *)ctx_ptr;
    if (!ctx || ctx->conn_fd < 0 || !pkt) return -EINVAL;

    size_t total = sizeof(ipc_packet_t);
    const char *buf = (const char *)pkt;
    size_t written = 0;

    while (written < total) {
        ssize_t n = send(ctx->conn_fd, buf + written, total - written, MSG_NOSIGNAL);
        if (n < 0) {
            if (errno == EINTR) continue;
            return -errno;
        }
        written += (size_t)n;
    }
    return 0;
}

static int socket_backend_recv(void *ctx_ptr, ipc_packet_t *pkt, int timeout_ms) {
    socket_ctx_t *ctx = (socket_ctx_t *)ctx_ptr;
    if (!ctx || ctx->conn_fd < 0 || !pkt) return -EINVAL;

    struct pollfd pfd;
    pfd.fd = ctx->conn_fd;
    pfd.events = POLLIN;
    pfd.revents = 0;

    int ret = poll(&pfd, 1, timeout_ms);
    if (ret == 0) return 0;
    if (ret < 0) {
        if (errno == EINTR) return 0;
        return -errno;
    }

    if (pfd.revents & POLLIN) {
        size_t total = sizeof(ipc_packet_t);
        char *buf = (char *)pkt;
        size_t bytes_read = 0;

        while (bytes_read < total) {
            ssize_t n = recv(ctx->conn_fd, buf + bytes_read, total - bytes_read, 0);
            if (n < 0) {
                if (errno == EINTR) continue;
                return -errno;
            }
            if (n == 0) return -ECONNRESET;
            bytes_read += (size_t)n;
        }
        return 1;
    }

    return 0;
}

static void socket_backend_close(void *ctx_ptr) {
    socket_ctx_t *ctx = (socket_ctx_t *)ctx_ptr;
    if (!ctx) return;
    if (ctx->conn_fd >= 0) close(ctx->conn_fd);
    if (ctx->server_fd >= 0) close(ctx->server_fd);
    free(ctx);
}

static void socket_backend_cleanup(const char *channel_name) {
    char path[128];
    snprintf(path, sizeof(path), "/tmp/ipc_sock_%s.sock", channel_name);
    unlink(path);
}

const ipc_backend_t g_ipc_socket_backend = {
    .name = "socket",
    .desc = "UNIX Domain Sockets (AF_UNIX stream protocol)",
    .type = IPC_TYPE_SOCKET,
    .init = socket_backend_init,
    .send = socket_backend_send,
    .recv = socket_backend_recv,
    .close = socket_backend_close,
    .cleanup = socket_backend_cleanup
};
