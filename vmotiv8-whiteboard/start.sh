#!/bin/bash

echo "Starting vMotiv8 Whiteboard Application..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
    echo ""
fi

# Start WebSocket server in background
echo "Starting WebSocket server on port 1234..."
npm run server &
WS_PID=$!

# Wait a moment for WS server to start
sleep 2

# Start Next.js server
echo "Starting Next.js development server..."
npm run dev &
NEXT_PID=$!

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "Shutting down servers..."
    kill $WS_PID 2>/dev/null
    kill $NEXT_PID 2>/dev/null
    exit 0
}

# Trap Ctrl+C and cleanup
trap cleanup INT TERM

echo ""
echo "========================================="
echo "vMotiv8 Whiteboard is running!"
echo "========================================="
echo "Frontend: http://localhost:3000"
echo "WebSocket: ws://localhost:1234"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

# Wait for processes
wait
