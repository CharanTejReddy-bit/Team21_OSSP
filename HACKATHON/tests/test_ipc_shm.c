/**
 * @file test_ipc_shm.c
 * @brief Unit test for POSIX Shared Memory IPC mechanism
 * Course: Operating Systems & Systems Programming (OSSP 25CS2104E)
 * Team 21: CharanTej Reddy, Sathvik, Chandrakanth Reddy
 */

#include "protocol.h"
#include "ipc_interface.h"
#include "ipc_shm.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>
#include <assert.h>

int main(void) {
    printf("[TEST] Starting POSIX Shared Memory IPC Test...\n");
    const char *test_channel = "test_shm_suite";

    /* Ensure channel is clean */
    g_ipc_shm_backend.cleanup(test_channel);

    pid_t pid = fork();
    if (pid < 0) {
        perror("fork failed");
        return 1;
    }

    if (pid == 0) {
        /* Child Process: Peer (Client) */
        usleep(150000); /* Wait for host to initialize */
        void *ctx = NULL;
        int ret = g_ipc_shm_backend.init(&ctx, test_channel, false);
        assert(ret == 0 && "Child failed to attach to SHM");

        for (int i = 1; i <= 5; i++) {
            ipc_packet_t pkt;
            packet_init(&pkt, MSG_TEXT, getpid(), "ChildProcess");
            char msg[64];
            snprintf(msg, sizeof(msg), "SHM Test Message #%d", i);
            packet_set_payload(&pkt, msg, strlen(msg) + 1);
            pkt.seq_num = i;
            assert(g_ipc_shm_backend.send(ctx, &pkt) == 0);
        }

        g_ipc_shm_backend.close(ctx);
        exit(0);
    } else {
        /* Parent Process: Host */
        void *ctx = NULL;
        int ret = g_ipc_shm_backend.init(&ctx, test_channel, true);
        assert(ret == 0 && "Parent failed to create SHM");

        for (int i = 1; i <= 5; i++) {
            ipc_packet_t rx_pkt;
            int r = g_ipc_shm_backend.recv(ctx, &rx_pkt, 3000);
            assert(r == 1 && "Parent failed to receive packet from SHM");
            assert(packet_validate(&rx_pkt) == true);
            assert(rx_pkt.seq_num == (uint32_t)i);
            printf("  [PASS] SHM Received packet #%u: '%s' from PID %d\n",
                   rx_pkt.seq_num, rx_pkt.payload, rx_pkt.sender_pid);
        }

        int status;
        waitpid(pid, &status, 0);

        g_ipc_shm_backend.close(ctx);
        g_ipc_shm_backend.cleanup(test_channel);
        printf("[SUCCESS] POSIX Shared Memory IPC Test Passed!\n\n");
    }
    return 0;
}
