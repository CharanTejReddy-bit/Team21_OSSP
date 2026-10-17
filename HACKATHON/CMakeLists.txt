cmake_minimum_required(VERSION 3.10)
project(ipc_chat_application C)

set(CMAKE_C_STANDARD 11)
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -Wall -Wextra -O2 -D_GNU_SOURCE")

include_directories(include)

set(CORE_SOURCES
    src/protocol.c
    src/utils/common.c
    src/ipc/ipc_shm.c
    src/ipc/ipc_mq.c
    src/ipc/ipc_fifo.c
    src/ipc/ipc_socket.c
    src/ipc/ipc_factory.c
    src/ui/ui.c
)

add_executable(ipc_chat src/main.c ${CORE_SOURCES})
target_link_libraries(ipc_chat rt pthread)

add_executable(test_protocol tests/test_protocol.c src/protocol.c src/utils/common.c)
target_link_libraries(test_protocol rt pthread)

add_executable(test_ipc_shm tests/test_ipc_shm.c ${CORE_SOURCES})
target_link_libraries(test_ipc_shm rt pthread)

add_executable(test_ipc_mq tests/test_ipc_mq.c ${CORE_SOURCES})
target_link_libraries(test_ipc_mq rt pthread)

add_executable(test_ipc_fifo tests/test_ipc_fifo.c ${CORE_SOURCES})
target_link_libraries(test_ipc_fifo rt pthread)

add_executable(test_stress tests/test_stress.c ${CORE_SOURCES})
target_link_libraries(test_stress rt pthread)

add_executable(benchmark_ipc tests/benchmark_ipc.c ${CORE_SOURCES})
target_link_libraries(benchmark_ipc rt pthread)
