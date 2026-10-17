/**
 * @file benchmark_ipc.c
 * @brief Comparative Performance Benchmark Suite across IPC Mechanisms
 * Course: Operating Systems & Systems Programming (OSSP 25CS2104E)
 * Team 21: CharanTej Reddy, Sathvik, Chandrakanth Reddy
 */

#include "protocol.h"
#include "ipc_interface.h"
#include "ipc_shm.h"
#include "ipc_mq.h"
#include "ipc_fifo.h"
#include "common.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

#define BENCH_ROUNDS 200

typedef struct {
    const char *name;
    const ipc_backend_t *backend;
    double min_rtt_us;
    double max_rtt_us;
    double avg_rtt_us;
    double throughput_msgs_sec;
    double throughput_mb_sec;
} bench_result_t;

static void run_benchmark_for_backend(const ipc_backend_t *backend, bench_result_t *res) {
    res->name = backend->name;
    res->backend = backend;
    const char *channel = "bench_channel";

    backend->cleanup(channel);

    pid_t pid = fork();
    if (pid < 0) {
        perror("fork");
        return;
    }

    if (pid == 0) {
        /* Child: Echo responder */
        usleep(100000);
        void *ctx = NULL;
        if (backend->init(&ctx, channel, false) != 0) exit(1);

        for (int i = 0; i < BENCH_ROUNDS; i++) {
            ipc_packet_t pkt;
            if (backend->recv(ctx, &pkt, 5000) == 1) {
                /* Echo back */
                backend->send(ctx, &pkt);
            }
        }
        backend->close(ctx);
        exit(0);
    } else {
        /* Parent: Initiator */
        void *ctx = NULL;
        if (backend->init(&ctx, channel, true) != 0) {
            waitpid(pid, NULL, 0);
            return;
        }

        double min_rtt = 1e9, max_rtt = 0, total_rtt = 0;
        uint64_t bench_start = get_current_time_us();

        for (int i = 0; i < BENCH_ROUNDS; i++) {
            ipc_packet_t tx_pkt;
            packet_init(&tx_pkt, MSG_PING, getpid(), "BenchHost");
            uint64_t t0 = get_current_time_us();
            tx_pkt.timestamp_us = t0;

            backend->send(ctx, &tx_pkt);

            ipc_packet_t rx_pkt;
            if (backend->recv(ctx, &rx_pkt, 5000) == 1) {
                uint64_t t1 = get_current_time_us();
                double rtt = (double)(t1 - t0);
                if (rtt < min_rtt) min_rtt = rtt;
                if (rtt > max_rtt) max_rtt = rtt;
                total_rtt += rtt;
            }
        }

        uint64_t bench_end = get_current_time_us();
        double elapsed_sec = (bench_end - bench_start) / 1000000.0;

        res->min_rtt_us = min_rtt;
        res->max_rtt_us = max_rtt;
        res->avg_rtt_us = total_rtt / BENCH_ROUNDS;
        res->throughput_msgs_sec = (BENCH_ROUNDS * 2) / elapsed_sec;
        res->throughput_mb_sec = (res->throughput_msgs_sec * sizeof(ipc_packet_t)) / (1024.0 * 1024.0);

        waitpid(pid, NULL, 0);
        backend->close(ctx);
        backend->cleanup(channel);
    }
}

int main(void) {
    printf("═══════════════════════════════════════════════════════════════════════════════════\n");
    printf("         COMPARATIVE PERFORMANCE BENCHMARK ACROSS IPC MECHANISMS                  \n");
    printf("        Operating Systems & Systems Programming (OSSP 25CS2104E) — Team 21         \n");
    printf("═══════════════════════════════════════════════════════════════════════════════════\n\n");
    printf("Benchmarking %d round-trip exchanges per IPC mechanism...\n\n", BENCH_ROUNDS);

    bench_result_t results[3];
    run_benchmark_for_backend(&g_ipc_shm_backend, &results[0]);
    run_benchmark_for_backend(&g_ipc_mq_backend, &results[1]);
    run_benchmark_for_backend(&g_ipc_fifo_backend, &results[2]);

    printf("┌───────────────────────────┬──────────────┬──────────────┬──────────────┬──────────────────┬─────────────────┐\n");
    printf("│ IPC Mechanism             │ Min RTT (µs) │ Max RTT (µs) │ Avg RTT (µs) │ Throughput (m/s) │ Bandwidth (MB/s)│\n");
    printf("├───────────────────────────┼──────────────┼──────────────┼──────────────┼──────────────────┼─────────────────┤\n");

    for (int i = 0; i < 3; i++) {
        printf("│ %-25s │ %12.2f │ %12.2f │ %12.2f │ %16.1f │ %15.2f │\n",
               results[i].backend->desc,
               results[i].min_rtt_us,
               results[i].max_rtt_us,
               results[i].avg_rtt_us,
               results[i].throughput_msgs_sec,
               results[i].throughput_mb_sec);
    }

    printf("└───────────────────────────┴──────────────┴──────────────┴──────────────┴──────────────────┴─────────────────┘\n\n");
    printf(COLOR_GREEN "[KEY TAKEAWAYS FOR OSSP EVALUATION]" COLOR_RESET "\n");
    printf("1. POSIX Shared Memory achieves lowest latency and highest throughput via zero-copy user-space memory access.\n");
    printf("2. POSIX Message Queues offer structured, priority-aware message delivery managed in kernel space.\n");
    printf("3. Named Pipes (FIFOs) provide a standard stream interface with kernel buffering and file descriptor semantics.\n\n");

    return 0;
}
