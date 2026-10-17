/**
 * @file common.h
 * @brief Common Macros, Logging Utilities, and Timing Functions
 * Course: Operating Systems & Systems Programming (OSSP 25CS2104E)
 * Team 21: CharanTej Reddy, Sathvik, Chandrakanth Reddy
 */

#ifndef IPC_COMMON_H
#define IPC_COMMON_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <stdint.h>
#include <stdbool.h>
#include <time.h>
#include <unistd.h>
#include <errno.h>
#include <signal.h>
#include <pthread.h>
#include <sys/time.h>
#include <sys/types.h>

#ifdef __cplusplus
extern "C" {
#endif

/* ANSI Terminal Colors */
#define COLOR_RESET       "\033[0m"
#define COLOR_BOLD        "\033[1m"
#define COLOR_DIM         "\033[2m"
#define COLOR_RED         "\033[31m"
#define COLOR_GREEN       "\033[32m"
#define COLOR_YELLOW      "\033[33m"
#define COLOR_BLUE        "\033[34m"
#define COLOR_MAGENTA     "\033[35m"
#define COLOR_CYAN        "\033[36m"
#define COLOR_WHITE       "\033[37m"
#define COLOR_BG_BLUE     "\033[44m"
#define COLOR_BG_DARK     "\033[48;5;236m"

/* Logging Macros */
#define LOG_INFO(fmt, ...) \
    fprintf(stdout, COLOR_CYAN "[INFO] " COLOR_RESET fmt "\n", ##__VA_ARGS__)

#define LOG_SUCCESS(fmt, ...) \
    fprintf(stdout, COLOR_GREEN "[SUCCESS] " COLOR_RESET fmt "\n", ##__VA_ARGS__)

#define LOG_WARN(fmt, ...) \
    fprintf(stderr, COLOR_YELLOW "[WARN] " COLOR_RESET fmt "\n", ##__VA_ARGS__)

#define LOG_ERROR(fmt, ...) \
    fprintf(stderr, COLOR_RED "[ERROR] " COLOR_RESET fmt " (%s)\n", ##__VA_ARGS__, strerror(errno))

#define LOG_DEBUG(fmt, ...) \
    do { if (g_debug_mode) fprintf(stdout, COLOR_DIM "[DEBUG] " fmt COLOR_RESET "\n", ##__VA_ARGS__); } while(0)

extern bool g_debug_mode;

/* Time measurement in microseconds */
static inline uint64_t get_current_time_us(void) {
    struct timespec ts;
    clock_gettime(CLOCK_REALTIME, &ts);
    return ((uint64_t)ts.tv_sec * 1000000ULL) + ((uint64_t)ts.tv_nsec / 1000ULL);
}

/* Format microsecond timestamp into readable string "HH:MM:SS.mmm" */
static inline void format_timestamp(uint64_t ts_us, char *buffer, size_t buf_size) {
    time_t raw_sec = (time_t)(ts_us / 1000000ULL);
    uint32_t millis = (uint32_t)((ts_us % 1000000ULL) / 1000ULL);
    struct tm tm_info;
    localtime_r(&raw_sec, &tm_info);
    snprintf(buffer, buf_size, "%02d:%02d:%02d.%03d",
             tm_info.tm_hour, tm_info.tm_min, tm_info.tm_sec, millis);
}

#ifdef __cplusplus
}
#endif

#endif /* IPC_COMMON_H */
