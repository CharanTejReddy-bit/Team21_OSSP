/**
 * @file ui.h
 * @brief Terminal User Interface & ANSI Formatting for IPC Chat
 * Course: Operating Systems & Systems Programming (OSSP 25CS2104E)
 * Team 21: CharanTej Reddy, Sathvik, Chandrakanth Reddy
 */

#ifndef IPC_UI_H
#define IPC_UI_H

#include "protocol.h"
#include <stdint.h>
#include <stdbool.h>

#ifdef __cplusplus
extern "C" {
#endif

typedef struct {
    uint64_t packets_sent;
    uint64_t packets_recv;
    uint64_t bytes_sent;
    uint64_t bytes_recv;
    uint64_t last_rtt_us;
    uint64_t min_rtt_us;
    uint64_t max_rtt_us;
    uint64_t total_rtt_us;
    uint32_t ping_count;
    char     peer_name[IPC_USER_MAX];
    int32_t  peer_pid;
    bool     peer_online;
} chat_stats_t;

void ui_print_banner(const char *backend_name, const char *channel, const char *username, int32_t pid, bool is_host);
void ui_print_help(void);
void ui_render_incoming(const ipc_packet_t *pkt);
void ui_render_outgoing(const char *username, int32_t pid, const char *text);
void ui_render_system(const char *msg);
void ui_render_stats(const chat_stats_t *stats, const char *backend_name);
void ui_render_prompt(const char *username, const char *backend_name);
void ui_clear_screen(void);

#ifdef __cplusplus
}
#endif

#endif /* IPC_UI_H */
