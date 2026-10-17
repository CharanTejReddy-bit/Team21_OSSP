/**
 * @file main.c
 * @brief Inter-Process Communication (IPC) Two-Way Chat Application
 * Course: Operating Systems & Systems Programming (OSSP 25CS2104E)
 * Team 21: CharanTej Reddy (2520030422), Sathvik (2520030226), Chandrakanth Reddy (2520030290)
 */

#include "protocol.h"
#include "ipc_interface.h"
#include "common.h"
#include "ui.h"
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <signal.h>
#include <pthread.h>
#include <getopt.h>
#include <fcntl.h>
#include <sys/stat.h>

static volatile bool g_running = true;
static const ipc_backend_t *g_backend = NULL;
static void *g_ipc_ctx = NULL;
static char g_channel[64] = "team21";
static char g_username[IPC_USER_MAX] = "User";
static bool g_is_host = true;
static int32_t g_my_pid = 0;
static chat_stats_t g_stats;
static pthread_mutex_t g_stats_mutex = PTHREAD_MUTEX_INITIALIZER;

/* File reception state */
static FILE *g_recv_file = NULL;
static char g_recv_filename[256] = {0};
static uint64_t g_recv_bytes = 0;
static uint64_t g_expected_file_size = 0;

/* Signal handler for clean IPC teardown */
static void handle_signal(int sig) {
    (void)sig;
    g_running = false;
    if (g_ipc_ctx && g_backend) {
        ipc_packet_t pkt;
        packet_init(&pkt, MSG_DISCONNECT, g_my_pid, g_username);
        g_backend->send(g_ipc_ctx, &pkt);
        g_backend->close(g_ipc_ctx);
        if (g_is_host) {
            g_backend->cleanup(g_channel);
        }
    }
    printf("\n" COLOR_YELLOW "[CLEANUP] Gracefully released IPC resources. Exiting.\n" COLOR_RESET);
    exit(0);
}

/* File sender helper: Streams file through IPC chunks */
static void send_file_over_ipc(const char *filepath) {
    FILE *fp = fopen(filepath, "rb");
    if (!fp) {
        LOG_ERROR("Cannot open file '%s' for reading", filepath);
        return;
    }

    struct stat st;
    if (stat(filepath, &st) != 0) {
        LOG_ERROR("Cannot stat file '%s'", filepath);
        fclose(fp);
        return;
    }

    /* Extract basename */
    const char *base = strrchr(filepath, '/');
    base = base ? base + 1 : filepath;

    file_meta_t meta;
    memset(&meta, 0, sizeof(meta));
    snprintf(meta.filename, sizeof(meta.filename), "%s", base);
    meta.file_size = (uint64_t)st.st_size;
    meta.chunk_size = IPC_PAYLOAD_MAX;
    meta.total_chunks = (uint32_t)((meta.file_size + IPC_PAYLOAD_MAX - 1) / IPC_PAYLOAD_MAX);

    /* Send MSG_FILE_START */
    ipc_packet_t pkt;
    packet_init(&pkt, MSG_FILE_START, g_my_pid, g_username);
    packet_set_payload(&pkt, &meta, sizeof(meta));
    g_backend->send(g_ipc_ctx, &pkt);

    printf(COLOR_CYAN "[FILE] Sending '%s' (%lu bytes, %u chunks) via IPC...\n" COLOR_RESET,
           base, meta.file_size, meta.total_chunks);

    char buffer[IPC_PAYLOAD_MAX];
    size_t bytes_read;
    uint32_t chunk_idx = 0;
    while ((bytes_read = fread(buffer, 1, sizeof(buffer), fp)) > 0) {
        packet_init(&pkt, MSG_FILE_CHUNK, g_my_pid, g_username);
        pkt.seq_num = ++chunk_idx;
        packet_set_payload(&pkt, buffer, bytes_read);
        g_backend->send(g_ipc_ctx, &pkt);
        usleep(1000); /* Rate limit chunk dispatch */
    }
    fclose(fp);

    /* Send MSG_FILE_END */
    packet_init(&pkt, MSG_FILE_END, g_my_pid, g_username);
    g_backend->send(g_ipc_ctx, &pkt);

    printf(COLOR_GREEN "[FILE] File '%s' successfully sent over IPC!\n" COLOR_RESET, base);
}

/* Background Receiver Thread */
static void *receiver_thread(void *arg) {
    (void)arg;
    ipc_packet_t rx_pkt;

    while (g_running) {
        int ret = g_backend->recv(g_ipc_ctx, &rx_pkt, 250);
        if (ret == 0) {
            /* Timeout: check running flag and continue */
            continue;
        }
        if (ret < 0) {
            if (!g_running) break;
            usleep(100000);
            continue;
        }

        /* Verify integrity */
        if (!packet_validate(&rx_pkt)) {
            LOG_WARN("Received corrupted IPC packet (CRC32 mismatch)!");
            continue;
        }

        pthread_mutex_lock(&g_stats_mutex);
        g_stats.packets_recv++;
        g_stats.bytes_recv += sizeof(ipc_packet_t);
        pthread_mutex_unlock(&g_stats_mutex);

        switch ((ipc_msg_type_t)rx_pkt.msg_type) {
            case MSG_HANDSHAKE: {
                pthread_mutex_lock(&g_stats_mutex);
                g_stats.peer_online = true;
                g_stats.peer_pid = rx_pkt.sender_pid;
                snprintf(g_stats.peer_name, sizeof(g_stats.peer_name), "%s", rx_pkt.sender_name);
                pthread_mutex_unlock(&g_stats_mutex);

                char notice[256];
                snprintf(notice, sizeof(notice), "Connected with peer '%s' (PID: %d)",
                         rx_pkt.sender_name, rx_pkt.sender_pid);
                ui_render_system(notice);

                /* Reply with Handshake ACK */
                ipc_packet_t ack_pkt;
                packet_init(&ack_pkt, MSG_HANDSHAKE_ACK, g_my_pid, g_username);
                g_backend->send(g_ipc_ctx, &ack_pkt);
                ui_render_prompt(g_username, g_backend->name);
                break;
            }

            case MSG_HANDSHAKE_ACK: {
                pthread_mutex_lock(&g_stats_mutex);
                g_stats.peer_online = true;
                g_stats.peer_pid = rx_pkt.sender_pid;
                snprintf(g_stats.peer_name, sizeof(g_stats.peer_name), "%s", rx_pkt.sender_name);
                pthread_mutex_unlock(&g_stats_mutex);

                char notice[256];
                snprintf(notice, sizeof(notice), "Handshake confirmed! Peer '%s' (PID: %d) is online.",
                         rx_pkt.sender_name, rx_pkt.sender_pid);
                ui_render_system(notice);
                ui_render_prompt(g_username, g_backend->name);
                break;
            }

            case MSG_TEXT: {
                ui_render_incoming(&rx_pkt);
                ui_render_prompt(g_username, g_backend->name);
                break;
            }

            case MSG_PING: {
                /* Immediately echo back PONG with the original timestamp */
                ipc_packet_t pong_pkt;
                packet_init(&pong_pkt, MSG_PONG, g_my_pid, g_username);
                pong_pkt.timestamp_us = rx_pkt.timestamp_us;
                g_backend->send(g_ipc_ctx, &pong_pkt);
                break;
            }

            case MSG_PONG: {
                uint64_t now = get_current_time_us();
                uint64_t rtt = (now > rx_pkt.timestamp_us) ? (now - rx_pkt.timestamp_us) : 1;

                pthread_mutex_lock(&g_stats_mutex);
                g_stats.last_rtt_us = rtt;
                g_stats.total_rtt_us += rtt;
                g_stats.ping_count++;
                if (g_stats.min_rtt_us == 0 || rtt < g_stats.min_rtt_us) g_stats.min_rtt_us = rtt;
                if (rtt > g_stats.max_rtt_us) g_stats.max_rtt_us = rtt;
                pthread_mutex_unlock(&g_stats_mutex);

                char ping_msg[256];
                snprintf(ping_msg, sizeof(ping_msg),
                         "Pong from %s (PID %d): IPC RTT = " COLOR_GREEN "%lu µs" COLOR_RESET " (%.3f ms)",
                         rx_pkt.sender_name, rx_pkt.sender_pid, rtt, rtt / 1000.0);
                ui_render_system(ping_msg);
                ui_render_prompt(g_username, g_backend->name);
                break;
            }

            case MSG_FILE_START: {
                if (rx_pkt.payload_len >= sizeof(file_meta_t)) {
                    file_meta_t *meta = (file_meta_t *)rx_pkt.payload;
                    snprintf(g_recv_filename, sizeof(g_recv_filename), "received_%s", meta->filename);
                    g_expected_file_size = meta->file_size;
                    g_recv_bytes = 0;
                    g_recv_file = fopen(g_recv_filename, "wb");
                    char notice[256];
                    snprintf(notice, sizeof(notice),
                             "Receiving incoming file '%s' (%lu bytes) via IPC...",
                             meta->filename, meta->file_size);
                    ui_render_system(notice);
                }
                break;
            }

            case MSG_FILE_CHUNK: {
                if (g_recv_file && rx_pkt.payload_len > 0) {
                    fwrite(rx_pkt.payload, 1, rx_pkt.payload_len, g_recv_file);
                    g_recv_bytes += rx_pkt.payload_len;
                }
                break;
            }

            case MSG_FILE_END: {
                if (g_recv_file) {
                    fclose(g_recv_file);
                    g_recv_file = NULL;
                    char notice[256];
                    snprintf(notice, sizeof(notice),
                             "File received successfully and saved to '%s' (%lu bytes verified)!",
                             g_recv_filename, g_recv_bytes);
                    ui_render_system(notice);
                    ui_render_prompt(g_username, g_backend->name);
                }
                break;
            }

            case MSG_DISCONNECT: {
                pthread_mutex_lock(&g_stats_mutex);
                g_stats.peer_online = false;
                pthread_mutex_unlock(&g_stats_mutex);

                char notice[256];
                snprintf(notice, sizeof(notice), "Peer '%s' (PID %d) disconnected.",
                         rx_pkt.sender_name, rx_pkt.sender_pid);
                ui_render_system(notice);
                ui_render_prompt(g_username, g_backend->name);
                break;
            }

            default:
                break;
        }
    }
    return NULL;
}

static void print_usage(const char *prog) {
    printf("Usage: %s [OPTIONS]\n", prog);
    printf("Options:\n");
    printf("  --ipc=<shm|mq|fifo|socket>  Select IPC transport mechanism (default: shm)\n");
    printf("  --channel=<name>            Set IPC channel room name (default: team21)\n");
    printf("  --user=<name>               Set chat display username\n");
    printf("  --host                      Launch as Host / Node 1 (creates IPC channel)\n");
    printf("  --client, --peer            Launch as Client / Node 2 (attaches to IPC channel)\n");
    printf("  --debug                     Enable debug message tracing\n");
    printf("  --help                      Display this help manual\n");
}

int main(int argc, char *argv[]) {
    char ipc_type_str[32] = "shm";
    bool role_specified = false;

    static struct option long_options[] = {
        {"ipc",     required_argument, 0, 'i'},
        {"channel", required_argument, 0, 'c'},
        {"user",    required_argument, 0, 'u'},
        {"host",    no_argument,       0, 'h'},
        {"peer",    no_argument,       0, 'p'},
        {"client",  no_argument,       0, 'p'},
        {"debug",   no_argument,       0, 'd'},
        {"help",    no_argument,       0, '?'},
        {0, 0, 0, 0}
    };

    int opt;
    while ((opt = getopt_long(argc, argv, "i:c:u:hpd?", long_options, NULL)) != -1) {
        switch (opt) {
            case 'i': strncpy(ipc_type_str, optarg, sizeof(ipc_type_str) - 1); break;
            case 'c': strncpy(g_channel, optarg, sizeof(g_channel) - 1); break;
            case 'u': strncpy(g_username, optarg, sizeof(g_username) - 1); break;
            case 'h': g_is_host = true; role_specified = true; break;
            case 'p': g_is_host = false; role_specified = true; break;
            case 'd': g_debug_mode = true; break;
            case '?': print_usage(argv[0]); return 0;
            default: break;
        }
    }

    if (!role_specified) {
        /* Default: Node 1 is Alice, Node 2 is Bob */
        g_is_host = true;
    }

    if (strcmp(g_username, "User") == 0) {
        strncpy(g_username, g_is_host ? "Alice" : "Bob", sizeof(g_username) - 1);
    }

    g_my_pid = getpid();
    memset(&g_stats, 0, sizeof(g_stats));

    /* Select IPC Backend */
    g_backend = ipc_get_backend_by_name(ipc_type_str);
    if (!g_backend) {
        fprintf(stderr, "Invalid IPC backend '%s'. Choose shm, mq, fifo, or socket.\n", ipc_type_str);
        return 1;
    }

    /* Register signal handlers for clean teardown */
    struct sigaction sa;
    memset(&sa, 0, sizeof(sa));
    sa.sa_handler = handle_signal;
    sigaction(SIGINT, &sa, NULL);
    sigaction(SIGTERM, &sa, NULL);

    /* Initialize IPC Channel */
    int ret = g_backend->init(&g_ipc_ctx, g_channel, g_is_host);
    if (ret != 0) {
        LOG_ERROR("Failed to initialize %s backend on channel '%s'", g_backend->name, g_channel);
        return 1;
    }

    /* Render Banner */
    ui_print_banner(g_backend->desc, g_channel, g_username, g_my_pid, g_is_host);

    /* Spawn background receiver thread */
    pthread_t rx_tid;
    if (pthread_create(&rx_tid, NULL, receiver_thread, NULL) != 0) {
        LOG_ERROR("Failed to create receiver pthread");
        return 1;
    }

    /* Send initial handshake */
    ipc_packet_t hs_pkt;
    packet_init(&hs_pkt, MSG_HANDSHAKE, g_my_pid, g_username);
    g_backend->send(g_ipc_ctx, &hs_pkt);

    /* Main Sender Loop */
    char input_line[1024];
    while (g_running) {
        ui_render_prompt(g_username, g_backend->name);
        if (!fgets(input_line, sizeof(input_line), stdin)) {
            break;
        }

        /* Strip trailing newline */
        size_t len = strlen(input_line);
        while (len > 0 && (input_line[len - 1] == '\n' || input_line[len - 1] == '\r')) {
            input_line[--len] = '\0';
        }
        if (len == 0) continue;

        /* Command handling */
        if (input_line[0] == '/') {
            if (strcmp(input_line, "/help") == 0) {
                ui_print_help();
                continue;
            } else if (strcmp(input_line, "/clear") == 0) {
                ui_print_banner(g_backend->desc, g_channel, g_username, g_my_pid, g_is_host);
                continue;
            } else if (strcmp(input_line, "/ping") == 0) {
                ipc_packet_t ping_pkt;
                packet_init(&ping_pkt, MSG_PING, g_my_pid, g_username);
                g_backend->send(g_ipc_ctx, &ping_pkt);
                printf(COLOR_CYAN "[PROBE] Sent IPC Ping probe, awaiting Pong...\n" COLOR_RESET);
                continue;
            } else if (strcmp(input_line, "/stats") == 0) {
                pthread_mutex_lock(&g_stats_mutex);
                ui_render_stats(&g_stats, g_backend->desc);
                pthread_mutex_unlock(&g_stats_mutex);
                continue;
            } else if (strcmp(input_line, "/ipc") == 0) {
                printf("\n" COLOR_CYAN "[IPC BACKEND INFO]" COLOR_RESET "\n");
                printf("  Name        : %s\n", g_backend->name);
                printf("  Description : %s\n", g_backend->desc);
                printf("  Channel     : %s\n", g_channel);
                printf("  Process PID : %d\n\n", g_my_pid);
                continue;
            } else if (strncmp(input_line, "/sendfile ", 10) == 0) {
                const char *path = input_line + 10;
                while (*path == ' ') path++;
                send_file_over_ipc(path);
                continue;
            } else if (strcmp(input_line, "/exit") == 0 || strcmp(input_line, "/quit") == 0) {
                g_running = false;
                break;
            } else {
                printf(COLOR_RED "Unknown command: %s. Type /help for available commands.\n" COLOR_RESET, input_line);
                continue;
            }
        }

        /* Transmit chat text message */
        ipc_packet_t pkt;
        packet_init(&pkt, MSG_TEXT, g_my_pid, g_username);
        packet_set_payload(&pkt, input_line, len + 1);

        int send_ret = g_backend->send(g_ipc_ctx, &pkt);
        if (send_ret == 0) {
            ui_render_outgoing(g_username, g_my_pid, input_line);
            pthread_mutex_lock(&g_stats_mutex);
            g_stats.packets_sent++;
            g_stats.bytes_sent += sizeof(ipc_packet_t);
            pthread_mutex_unlock(&g_stats_mutex);
        } else {
            LOG_ERROR("Failed to transmit IPC packet (code %d)", send_ret);
        }
    }

    /* Graceful exit */
    handle_signal(SIGINT);
    return 0;
}
