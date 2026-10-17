/**
 * @file test_stress.c
 * @brief High-Throughput Stress Test for POSIX Shared Memory Ring Buffer
 * Course: Operating Systems & Systems Programming (OSSP 25CS2104E)
 * Team 21: CharanTej Reddy, Sathvik, Chandrakanth Reddy
 */

#include "protocol.h"
#include "ipc_interface.h"
#include "ipc_shm.h"
#include "common.h"
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <sys/wait.h>
#include <assert.h>

#define STRESS_MSG_COUNT 5000

int main(void) {
    printf("[STRESS TEST] Initiating 5,000 Rapid Packet Transfer over Shared Memory...\n");
    const char *channel = "stress_test_room";

    g_ipc_shm_backend.cleanup(channel);

    pid_t pid = fork();
    if (pid < 0) {
        perror("fork");
        return 1;
    }

    if (pid == 0) {
        /* Child Producer */
        usleep(100000);
        void *ctx = NULL;
        assert(g_ipc_shm_backend.init(&ctx, channel, false) == 0);

        for (uint32_t i = 1; i <= STRESS_MSG_COUNT; i++) {
            ipc_packet_t pkt;
            packet_init(&pkt, MSG_TEXT, getpid(), "Producer");
            pkt.seq_num = i;
            char msg[32];
            snprintf(msg, sizeof(msg), "DATA-%u", i);
            packet_set_payload(&pkt, msg, strlen(msg) + 1);

            while (g_ipc_shm_backend.send(ctx, &pkt) != 0) {
                usleep(50);
            }
        }

        g_ipc_shm_backend.close(ctx);
        exit(0);
    } else {
        /* Parent Consumer */
        void *ctx = NULL;
        assert(g_ipc_shm_backend.init(&ctx, channel, true) == 0);

        uint64_t start_time = get_current_time_us();
        uint32_t received = 0;

        for (uint32_t expected_seq = 1; expected_seq <= STRESS_MSG_COUNT; expected_seq++) {
            ipc_packet_t rx_pkt;
            int r = g_ipc_shm_backend.recv(ctx, &rx_pkt, 5000);
            assert(r == 1 && "Failed to receive packet or timeout occurred");
            assert(packet_validate(&rx_pkt) == true);
            assert(rx_pkt.seq_num == expected_seq && "Sequence out of order!");
            received++;

            if (received % 1000 == 0) {
                printf("  [PROGRESS] %u / %d packets verified...\n", received, STRESS_MSG_COUNT);
            }
        }

        uint64_t elapsed_us = get_current_time_us() - start_time;
        double elapsed_sec = elapsed_us / 1000000.0;
        double throughput_msgs = (double)STRESS_MSG_COUNT / elapsed_sec;
        double throughput_mb = (throughput_msgs * sizeof(ipc_packet_t)) / (1024.0 * 1024.0);

        int status;
        waitpid(pid, &status, 0);

        g_ipc_shm_backend.close(ctx);
        g_ipc_shm_backend.cleanup(channel);

        printf("\n[STRESS TEST RESULTS]\n");
        printf("  Packets Exchanged : %u / %d (100%% Delivery Guarantee)\n", received, STRESS_MSG_COUNT);
        printf("  Total Elapsed     : %.4f seconds (%lu µs)\n", elapsed_sec, elapsed_us);
        printf("  Throughput        : " COLOR_GREEN "%.2f msgs/sec" COLOR_RESET " (" COLOR_CYAN "%.2f MB/sec" COLOR_RESET ")\n",
               throughput_msgs, throughput_mb);
        printf("  Avg Packet Delay  : " COLOR_YELLOW "%.2f µs/msg" COLOR_RESET "\n", (double)elapsed_us / STRESS_MSG_COUNT);
        printf("[SUCCESS] Zero packet loss, Zero race condition detected!\n\n");
    }
    return 0;
}
