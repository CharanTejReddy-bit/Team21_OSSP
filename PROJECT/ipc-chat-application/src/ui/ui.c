/**
 * @file ui.c
 * @brief Terminal User Interface & ANSI Formatting for IPC Chat
 * Course: Operating Systems & Systems Programming (OSSP 25CS2104E)
 * Team 21: CharanTej Reddy, Sathvik, Chandrakanth Reddy
 */

#include "ui.h"
#include "common.h"
#include <stdio.h>
#include <string.h>

void ui_clear_screen(void) {
    printf("\033[2J\033[H");
    fflush(stdout);
}

void ui_print_banner(const char *backend_name, const char *channel, const char *username, int32_t pid, bool is_host) {
    ui_clear_screen();
    printf(COLOR_CYAN COLOR_BOLD);
    printf("╔════════════════════════════════════════════════════════════════════════════╗\n");
    printf("║         TWO-WAY INTER-PROCESS COMMUNICATION (IPC) CHAT ENGINE              ║\n");
    printf("║     Operating Systems & Systems Programming (OSSP 25CS2104E) — Team 21     ║\n");
    printf("╚════════════════════════════════════════════════════════════════════════════╝\n");
    printf(COLOR_RESET);

    printf(COLOR_DIM " Team Members: CharanTej Reddy (2520030422) | Sathvik (2520030226) | Chandrakanth (2520030290)\n" COLOR_RESET);
    printf("────────────────────────────────────────────────────────────────────────────\n");
    printf(COLOR_BOLD " Active IPC Backend : " COLOR_GREEN "%s" COLOR_RESET "\n", backend_name);
    printf(COLOR_BOLD " Channel Room       : " COLOR_YELLOW "%s" COLOR_RESET "\n", channel);
    printf(COLOR_BOLD " Process Identity   : " COLOR_MAGENTA "%s" COLOR_RESET " (Role: %s, PID: " COLOR_CYAN "%d" COLOR_RESET ")\n",
           username, is_host ? "Host / Node 1" : "Peer / Node 2", pid);
    printf(COLOR_BOLD " Commands Available : " COLOR_YELLOW "/help" COLOR_RESET ", " COLOR_YELLOW "/ping" COLOR_RESET ", " COLOR_YELLOW "/sendfile" COLOR_RESET ", " COLOR_YELLOW "/stats" COLOR_RESET ", " COLOR_YELLOW "/clear" COLOR_RESET ", " COLOR_YELLOW "/exit" COLOR_RESET "\n");
    printf("────────────────────────────────────────────────────────────────────────────\n\n");
    fflush(stdout);
}

void ui_print_help(void) {
    printf("\n" COLOR_CYAN COLOR_BOLD "╭─── IPC Chat Command Reference ──────────────────────────────────────────╮" COLOR_RESET "\n");
    printf(COLOR_CYAN "│" COLOR_RESET "  " COLOR_YELLOW "/ping" COLOR_RESET "               : Measure real-time IPC round-trip latency (RTT µs)  " COLOR_CYAN "│\n" COLOR_RESET);
    printf(COLOR_CYAN "│" COLOR_RESET "  " COLOR_YELLOW "/sendfile <path>" COLOR_RESET "    : Stream binary/text file directly through IPC chunks " COLOR_CYAN "│\n" COLOR_RESET);
    printf(COLOR_CYAN "│" COLOR_RESET "  " COLOR_YELLOW "/stats" COLOR_RESET "              : Display packet telemetry, bytes transferred & stats " COLOR_CYAN "│\n" COLOR_RESET);
    printf(COLOR_CYAN "│" COLOR_RESET "  " COLOR_YELLOW "/ipc" COLOR_RESET "                : View details of the active IPC kernel mechanism     " COLOR_CYAN "│\n" COLOR_RESET);
    printf(COLOR_CYAN "│" COLOR_RESET "  " COLOR_YELLOW "/clear" COLOR_RESET "              : Clear the terminal chat window                     " COLOR_CYAN "│\n" COLOR_RESET);
    printf(COLOR_CYAN "│" COLOR_RESET "  " COLOR_YELLOW "/help" COLOR_RESET "               : Display this command help guide                    " COLOR_CYAN "│\n" COLOR_RESET);
    printf(COLOR_CYAN "│" COLOR_RESET "  " COLOR_YELLOW "/exit" COLOR_RESET " or " COLOR_YELLOW "/quit" COLOR_RESET "      : Gracefully notify peer, unlink IPC and exit        " COLOR_CYAN "│\n" COLOR_RESET);
    printf(COLOR_CYAN COLOR_BOLD "╰─────────────────────────────────────────────────────────────────────────╯" COLOR_RESET "\n\n");
    fflush(stdout);
}

void ui_render_incoming(const ipc_packet_t *pkt) {
    char time_str[32];
    format_timestamp(pkt->timestamp_us, time_str, sizeof(time_str));

    printf("\r\033[K"); /* Clear current input prompt line */
    printf(COLOR_DIM "[%s] " COLOR_RESET, time_str);
    printf(COLOR_MAGENTA COLOR_BOLD "◄ %s " COLOR_RESET, pkt->sender_name);
    printf(COLOR_DIM "(PID:%d)" COLOR_RESET ": ", pkt->sender_pid);
    printf("%s\n", pkt->payload);
    fflush(stdout);
}

void ui_render_outgoing(const char *username, int32_t pid, const char *text) {
    char time_str[32];
    format_timestamp(get_current_time_us(), time_str, sizeof(time_str));

    printf("\033[A\r\033[K"); /* Move up to overwrite typed line with styled message */
    printf(COLOR_DIM "[%s] " COLOR_RESET, time_str);
    printf(COLOR_GREEN COLOR_BOLD "► %s " COLOR_RESET, username);
    printf(COLOR_DIM "(PID:%d)" COLOR_RESET ": ", pid);
    printf("%s\n", text);
    fflush(stdout);
}

void ui_render_system(const char *msg) {
    char time_str[32];
    format_timestamp(get_current_time_us(), time_str, sizeof(time_str));

    printf("\r\033[K");
    printf(COLOR_DIM "[%s] " COLOR_RESET, time_str);
    printf(COLOR_CYAN "[SYSTEM] " COLOR_RESET "%s\n", msg);
    fflush(stdout);
}

void ui_render_stats(const chat_stats_t *stats, const char *backend_name) {
    printf("\n" COLOR_BLUE COLOR_BOLD "╔═══════════════════ IPC TELEMETRY & PERFORMANCE ═══════════════════╗" COLOR_RESET "\n");
    printf("  Active IPC Mechanism   : " COLOR_GREEN "%s" COLOR_RESET "\n", backend_name);
    printf("  Peer Connected         : %s\n", stats->peer_online ? COLOR_GREEN "YES (Online)" COLOR_RESET : COLOR_RED "NO (Waiting)" COLOR_RESET);
    printf("  Peer Identity          : " COLOR_MAGENTA "%s" COLOR_RESET " (PID: %d)\n", stats->peer_name, stats->peer_pid);
    printf("  Packets Transmitted    : " COLOR_CYAN "%lu" COLOR_RESET " packets (" COLOR_DIM "%lu bytes" COLOR_RESET ")\n", stats->packets_sent, stats->bytes_sent);
    printf("  Packets Received       : " COLOR_CYAN "%lu" COLOR_RESET " packets (" COLOR_DIM "%lu bytes" COLOR_RESET ")\n", stats->packets_recv, stats->bytes_recv);
    
    if (stats->ping_count > 0) {
        double avg_rtt = (double)stats->total_rtt_us / stats->ping_count;
        printf("  Last IPC RTT Latency   : " COLOR_YELLOW "%lu µs" COLOR_RESET " (%.3f ms)\n", stats->last_rtt_us, stats->last_rtt_us / 1000.0);
        printf("  Min / Max / Avg RTT    : " COLOR_GREEN "%lu µs" COLOR_RESET " / " COLOR_RED "%lu µs" COLOR_RESET " / " COLOR_YELLOW "%.2f µs" COLOR_RESET "\n",
               stats->min_rtt_us, stats->max_rtt_us, avg_rtt);
    } else {
        printf("  IPC Latency            : " COLOR_DIM "No pings yet. Type /ping to measure RTT." COLOR_RESET "\n");
    }
    printf(COLOR_BLUE COLOR_BOLD "╚═══════════════════════════════════════════════════════════════════╝" COLOR_RESET "\n\n");
    fflush(stdout);
}

void ui_render_prompt(const char *username, const char *backend_name) {
    printf(COLOR_DIM "[" COLOR_CYAN "%s" COLOR_DIM "@" COLOR_YELLOW "%s" COLOR_DIM "]> " COLOR_RESET, username, backend_name);
    fflush(stdout);
}
