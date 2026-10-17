/**
 * @file ipc_shm.c
 * @brief POSIX Shared Memory with Named Semaphores IPC Implementation
 * Course: Operating Systems & Systems Programming (OSSP 25CS2104E)
 * Team 21: CharanTej Reddy, Sathvik, Chandrakanth Reddy
 */

#include "ipc_shm.h"
#include "common.h"
#include <sys/mman.h>
#include <sys/stat.h>
#include <fcntl.h>
#include <unistd.h>
#include <time.h>

#define SHM_MAGIC 0x53484D31U /* "SHM1" */

static void get_sem_names(const char *channel,
                          char *a2b_mutex, char *a2b_items, char *a2b_slots,
                          char *b2a_mutex, char *b2a_items, char *b2a_slots) {
    snprintf(a2b_mutex, 128, "/ipc_s_%s_a2b_mtx", channel);
    snprintf(a2b_items, 128, "/ipc_s_%s_a2b_itm", channel);
    snprintf(a2b_slots, 128, "/ipc_s_%s_a2b_slt", channel);
    snprintf(b2a_mutex, 128, "/ipc_s_%s_b2a_mtx", channel);
    snprintf(b2a_items, 128, "/ipc_s_%s_b2a_itm", channel);
    snprintf(b2a_slots, 128, "/ipc_s_%s_b2a_slt", channel);
}

static int shm_backend_init(void **ctx_out, const char *channel_name, bool is_host) {
    shm_ctx_t *ctx = (shm_ctx_t *)calloc(1, sizeof(shm_ctx_t));
    if (!ctx) return -ENOMEM;

    ctx->is_host = is_host;
    snprintf(ctx->shm_name, sizeof(ctx->shm_name), "/ipc_shm_%s", channel_name);

    char a2b_mtx[128], a2b_itm[128], a2b_slt[128];
    char b2a_mtx[128], b2a_itm[128], b2a_slt[128];
    get_sem_names(channel_name, a2b_mtx, a2b_itm, a2b_slt, b2a_mtx, b2a_itm, b2a_slt);

    int oflag = O_RDWR | (is_host ? O_CREAT : 0);
    int fd = shm_open(ctx->shm_name, oflag, 0666);
    if (fd < 0 && !is_host) {
        /* Retry a few times if host hasn't opened yet */
        for (int i = 0; i < 20 && fd < 0; i++) {
            usleep(100000);
            fd = shm_open(ctx->shm_name, O_RDWR, 0666);
        }
    }

    if (fd < 0) {
        LOG_ERROR("Failed to open shared memory object '%s'", ctx->shm_name);
        free(ctx);
        return -errno;
    }
    ctx->fd = fd;

    if (is_host) {
        if (ftruncate(fd, sizeof(shm_channel_t)) != 0) {
            LOG_ERROR("Failed to ftruncate shared memory");
            close(fd);
            free(ctx);
            return -errno;
        }
    }

    void *ptr = mmap(NULL, sizeof(shm_channel_t), PROT_READ | PROT_WRITE, MAP_SHARED, fd, 0);
    if (ptr == MAP_FAILED) {
        LOG_ERROR("Failed to mmap shared memory region");
        close(fd);
        free(ctx);
        return -errno;
    }
    ctx->channel = (shm_channel_t *)ptr;

    if (is_host) {
        memset(ctx->channel, 0, sizeof(shm_channel_t));
        ctx->channel->magic = SHM_MAGIC;
        ctx->channel->host_pid = getpid();
        ctx->channel->host_connected = true;
    } else {
        ctx->channel->peer_pid = getpid();
        ctx->channel->peer_connected = true;
    }

    /* Open POSIX Named Semaphores */
    sem_t *sem_a2b_m, *sem_a2b_i, *sem_a2b_s;
    sem_t *sem_b2a_m, *sem_b2a_i, *sem_b2a_s;

    if (is_host) {
        sem_unlink(a2b_mtx); sem_unlink(a2b_itm); sem_unlink(a2b_slt);
        sem_unlink(b2a_mtx); sem_unlink(b2a_itm); sem_unlink(b2a_slt);

        sem_a2b_m = sem_open(a2b_mtx, O_CREAT, 0666, 1);
        sem_a2b_i = sem_open(a2b_itm, O_CREAT, 0666, 0);
        sem_a2b_s = sem_open(a2b_slt, O_CREAT, 0666, RING_BUFFER_CAP);

        sem_b2a_m = sem_open(b2a_mtx, O_CREAT, 0666, 1);
        sem_b2a_i = sem_open(b2a_itm, O_CREAT, 0666, 0);
        sem_b2a_s = sem_open(b2a_slt, O_CREAT, 0666, RING_BUFFER_CAP);
    } else {
        sem_a2b_m = sem_open(a2b_mtx, 0);
        sem_a2b_i = sem_open(a2b_itm, 0);
        sem_a2b_s = sem_open(a2b_slt, 0);

        sem_b2a_m = sem_open(b2a_mtx, 0);
        sem_b2a_i = sem_open(b2a_itm, 0);
        sem_b2a_s = sem_open(b2a_slt, 0);
    }

    if (sem_a2b_m == SEM_FAILED || sem_a2b_i == SEM_FAILED || sem_a2b_s == SEM_FAILED ||
        sem_b2a_m == SEM_FAILED || sem_b2a_i == SEM_FAILED || sem_b2a_s == SEM_FAILED) {
        LOG_ERROR("Failed to open POSIX semaphores");
        munmap(ctx->channel, sizeof(shm_channel_t));
        close(fd);
        free(ctx);
        return -errno;
    }

    /* Assign TX and RX semaphores based on node role */
    if (is_host) {
        ctx->tx_mutex = sem_a2b_m;
        ctx->tx_items = sem_a2b_i;
        ctx->tx_slots = sem_a2b_s;

        ctx->rx_mutex = sem_b2a_m;
        ctx->rx_items = sem_b2a_i;
        ctx->rx_slots = sem_b2a_s;
    } else {
        ctx->tx_mutex = sem_b2a_m;
        ctx->tx_items = sem_b2a_i;
        ctx->tx_slots = sem_b2a_s;

        ctx->rx_mutex = sem_a2b_m;
        ctx->rx_items = sem_a2b_i;
        ctx->rx_slots = sem_a2b_s;
    }

    *ctx_out = ctx;
    return 0;
}

static int shm_backend_send(void *ctx_ptr, const ipc_packet_t *pkt) {
    shm_ctx_t *ctx = (shm_ctx_t *)ctx_ptr;
    if (!ctx || !ctx->channel || !pkt) return -EINVAL;

    /* Wait for free slot in circular queue with timeout (2s) */
    struct timespec ts;
    clock_gettime(CLOCK_REALTIME, &ts);
    ts.tv_sec += 2;

    if (sem_timedwait(ctx->tx_slots, &ts) != 0) {
        return -ETIMEDOUT;
    }

    /* Enter critical section for write mailbox */
    sem_wait(ctx->tx_mutex);

    shm_mailbox_t *mbox = ctx->is_host ? &ctx->channel->mbox_a2b : &ctx->channel->mbox_b2a;
    uint32_t slot = mbox->tail;
    memcpy(&mbox->queue[slot], pkt, sizeof(ipc_packet_t));
    mbox->tail = (mbox->tail + 1) % RING_BUFFER_CAP;
    mbox->count++;
    ctx->channel->total_packets++;

    /* Leave critical section */
    sem_post(ctx->tx_mutex);

    /* Signal consumer that an item is available */
    sem_post(ctx->tx_items);

    return 0;
}

static int shm_backend_recv(void *ctx_ptr, ipc_packet_t *pkt, int timeout_ms) {
    shm_ctx_t *ctx = (shm_ctx_t *)ctx_ptr;
    if (!ctx || !ctx->channel || !pkt) return -EINVAL;

    int ret;
    if (timeout_ms < 0) {
        ret = sem_wait(ctx->rx_items);
    } else {
        struct timespec ts;
        clock_gettime(CLOCK_REALTIME, &ts);
        ts.tv_sec += timeout_ms / 1000;
        ts.tv_nsec += (long)(timeout_ms % 1000) * 1000000L;
        if (ts.tv_nsec >= 1000000000L) {
            ts.tv_sec += 1;
            ts.tv_nsec -= 1000000000L;
        }
        ret = sem_timedwait(ctx->rx_items, &ts);
    }

    if (ret != 0) {
        if (errno == ETIMEDOUT) return 0; /* Normal timeout */
        return -errno;
    }

    /* Enter critical section for read mailbox */
    sem_wait(ctx->rx_mutex);

    shm_mailbox_t *mbox = ctx->is_host ? &ctx->channel->mbox_b2a : &ctx->channel->mbox_a2b;
    uint32_t slot = mbox->head;
    memcpy(pkt, &mbox->queue[slot], sizeof(ipc_packet_t));
    mbox->head = (mbox->head + 1) % RING_BUFFER_CAP;
    if (mbox->count > 0) mbox->count--;

    /* Leave critical section */
    sem_post(ctx->rx_mutex);

    /* Release a slot for the producer */
    sem_post(ctx->rx_slots);

    return 1; /* Packet received */
}

static void shm_backend_close(void *ctx_ptr) {
    shm_ctx_t *ctx = (shm_ctx_t *)ctx_ptr;
    if (!ctx) return;

    if (ctx->channel) {
        if (ctx->is_host) {
            ctx->channel->host_connected = false;
        } else {
            ctx->channel->peer_connected = false;
        }
        munmap(ctx->channel, sizeof(shm_channel_t));
        ctx->channel = NULL;
    }

    if (ctx->fd >= 0) {
        close(ctx->fd);
        ctx->fd = -1;
    }

    if (ctx->tx_mutex) sem_close(ctx->tx_mutex);
    if (ctx->tx_items) sem_close(ctx->tx_items);
    if (ctx->tx_slots) sem_close(ctx->tx_slots);
    if (ctx->rx_mutex) sem_close(ctx->rx_mutex);
    if (ctx->rx_items) sem_close(ctx->rx_items);
    if (ctx->rx_slots) sem_close(ctx->rx_slots);

    free(ctx);
}

static void shm_backend_cleanup(const char *channel_name) {
    char shm_name[128];
    snprintf(shm_name, sizeof(shm_name), "/ipc_shm_%s", channel_name);
    shm_unlink(shm_name);

    char a2b_mtx[128], a2b_itm[128], a2b_slt[128];
    char b2a_mtx[128], b2a_itm[128], b2a_slt[128];
    get_sem_names(channel_name, a2b_mtx, a2b_itm, a2b_slt, b2a_mtx, b2a_itm, b2a_slt);

    sem_unlink(a2b_mtx);
    sem_unlink(a2b_itm);
    sem_unlink(a2b_slt);
    sem_unlink(b2a_mtx);
    sem_unlink(b2a_itm);
    sem_unlink(b2a_slt);
}

const ipc_backend_t g_ipc_shm_backend = {
    .name = "shm",
    .desc = "POSIX Shared Memory (mmap) + Named Semaphores (Zero-Copy Ring Buffer)",
    .type = IPC_TYPE_SHM,
    .init = shm_backend_init,
    .send = shm_backend_send,
    .recv = shm_backend_recv,
    .close = shm_backend_close,
    .cleanup = shm_backend_cleanup
};
