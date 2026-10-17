# Makefile: Inter-Process Communication (IPC) Chat Application
# Course: Operating Systems & Systems Programming (OSSP 25CS2104E)
# Team 21: CharanTej Reddy, Sathvik, Chandrakanth Reddy

CC ?= gcc
CFLAGS ?= -Wall -Wextra -O2 -std=c11 -D_GNU_SOURCE -Iinclude
LDFLAGS ?= -lrt -lpthread

BIN_DIR = bin
OBJ_DIR = obj
SRC_DIR = src

# Source files for core library and application
CORE_SRCS = $(SRC_DIR)/protocol.c \
            $(SRC_DIR)/utils/common.c \
            $(SRC_DIR)/ipc/ipc_shm.c \
            $(SRC_DIR)/ipc/ipc_mq.c \
            $(SRC_DIR)/ipc/ipc_fifo.c \
            $(SRC_DIR)/ipc/ipc_socket.c \
            $(SRC_DIR)/ipc/ipc_factory.c \
            $(SRC_DIR)/ui/ui.c

CORE_OBJS = $(patsubst $(SRC_DIR)/%.c, $(OBJ_DIR)/%.o, $(CORE_SRCS))

TARGET = $(BIN_DIR)/ipc_chat
TEST_PROTO = $(BIN_DIR)/test_protocol
TEST_SHM = $(BIN_DIR)/test_ipc_shm
TEST_MQ = $(BIN_DIR)/test_ipc_mq
TEST_FIFO = $(BIN_DIR)/test_ipc_fifo
TEST_STRESS = $(BIN_DIR)/test_stress
BENCHMARK = $(BIN_DIR)/benchmark_ipc

.PHONY: all clean test run-tests benchmark demo help

all: directories $(TARGET) $(TEST_PROTO) $(TEST_SHM) $(TEST_MQ) $(TEST_FIFO) $(TEST_STRESS) $(BENCHMARK)
	@echo "Build complete! Application binary at: $(TARGET)"

directories:
	@mkdir -p $(BIN_DIR)
	@mkdir -p $(OBJ_DIR)/ipc $(OBJ_DIR)/ui $(OBJ_DIR)/utils

# Compile core object files
$(OBJ_DIR)/%.o: $(SRC_DIR)/%.c
	@mkdir -p $(dir $@)
	$(CC) $(CFLAGS) -c $< -o $@

# Main Application
$(TARGET): $(OBJ_DIR)/main.o $(CORE_OBJS)
	$(CC) $(CFLAGS) $^ -o $@ $(LDFLAGS)

$(OBJ_DIR)/main.o: $(SRC_DIR)/main.c
	@mkdir -p $(OBJ_DIR)
	$(CC) $(CFLAGS) -c $< -o $@

# Test Binaries
$(TEST_PROTO): tests/test_protocol.c $(SRC_DIR)/protocol.c $(SRC_DIR)/utils/common.c
	$(CC) $(CFLAGS) $^ -o $@ $(LDFLAGS)

$(TEST_SHM): tests/test_ipc_shm.c $(CORE_OBJS)
	$(CC) $(CFLAGS) $^ -o $@ $(LDFLAGS)

$(TEST_MQ): tests/test_ipc_mq.c $(CORE_OBJS)
	$(CC) $(CFLAGS) $^ -o $@ $(LDFLAGS)

$(TEST_FIFO): tests/test_ipc_fifo.c $(CORE_OBJS)
	$(CC) $(CFLAGS) $^ -o $@ $(LDFLAGS)

$(TEST_STRESS): tests/test_stress.c $(CORE_OBJS)
	$(CC) $(CFLAGS) $^ -o $@ $(LDFLAGS)

$(BENCHMARK): tests/benchmark_ipc.c $(CORE_OBJS)
	$(CC) $(CFLAGS) $^ -o $@ $(LDFLAGS)

test: all run-tests

run-tests:
	@echo "=== Executing IPC Verification Test Suite ==="
	@./$(TEST_PROTO)
	@./$(TEST_SHM)
	@./$(TEST_MQ)
	@./$(TEST_FIFO)
	@./$(TEST_STRESS)
	@bash tests/test_cleanup.sh
	@echo "All tests passed successfully!"

benchmark: $(BENCHMARK)
	@./$(BENCHMARK)

demo: all
	@python3 scripts/demo_automated.py

clean:
	rm -rf $(OBJ_DIR) $(BIN_DIR)
	@rm -f /dev/shm/ipc_* /dev/shm/sem.ipc_* /tmp/ipc_fifo_* /tmp/ipc_sock_* 2>/dev/null || true
	@echo "Cleaned build artifacts and IPC kernel objects."

help:
	@echo "Available Makefile targets:"
	@echo "  make all       : Build application and all test suites"
	@echo "  make test      : Build and run all unit and stress tests"
	@echo "  make benchmark : Run the IPC latency and throughput benchmark"
	@echo "  make demo      : Run the automated live demonstration"
	@echo "  make clean     : Remove build objects and clean IPC kernel artifacts"
