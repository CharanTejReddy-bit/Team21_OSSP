#!/bin/bash
# demo_interactive.sh: Launch Alice and Bob in side-by-side terminal windows
# Course: Operating Systems & Systems Programming (OSSP 25CS2104E) - Team 21

IPC_MODE=${1:-shm}
CHANNEL=${2:-team21}

echo "Launching Interactive IPC Chat (Backend: $IPC_MODE, Channel: $CHANNEL)..."

BIN="./bin/ipc_chat"
if [ ! -f "$BIN" ]; then
    make
fi

# If tmux is installed, use split window for a clean side-by-side view
if command -v tmux &> /dev/null; then
    SESSION="ipc_chat_demo"
    tmux kill-session -t $SESSION 2>/dev/null
    tmux new-session -d -s $SESSION "$BIN --ipc=$IPC_MODE --channel=$CHANNEL --user=Alice --host"
    tmux split-window -h "$BIN --ipc=$IPC_MODE --channel=$CHANNEL --user=Bob --client"
    tmux attach-session -t $SESSION
elif command -v gnome-terminal &> /dev/null; then
    gnome-terminal --title="Node 1 - Alice (Host)" -- bash -c "$BIN --ipc=$IPC_MODE --channel=$CHANNEL --user=Alice --host; exec bash"
    sleep 0.5
    gnome-terminal --title="Node 2 - Bob (Peer)" -- bash -c "$BIN --ipc=$IPC_MODE --channel=$CHANNEL --user=Bob --client; exec bash"
elif command -v xterm &> /dev/null; then
    xterm -title "Node 1 - Alice (Host)" -e "$BIN --ipc=$IPC_MODE --channel=$CHANNEL --user=Alice --host" &
    sleep 0.5
    xterm -title "Node 2 - Bob (Peer)" -e "$BIN --ipc=$IPC_MODE --channel=$CHANNEL --user=Bob --client" &
else
    echo "No window manager or tmux found. Please open two terminal windows and execute:"
    echo "  Window 1: $BIN --ipc=$IPC_MODE --channel=$CHANNEL --user=Alice --host"
    echo "  Window 2: $BIN --ipc=$IPC_MODE --channel=$CHANNEL --user=Bob --client"
fi
