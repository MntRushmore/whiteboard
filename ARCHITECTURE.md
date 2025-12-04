# vMotiv8 Whiteboard - Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (User A)                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              Next.js Frontend (Port 3000)             │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  React Components                               │  │  │
│  │  │  - Landing Page (/)                             │  │  │
│  │  │  - Create Room (/room/new)                      │  │  │
│  │  │  - Join Room (/room/join)                       │  │  │
│  │  │  - Whiteboard (/room/[roomId])                  │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  WhiteboardEditor Component                     │  │  │
│  │  │  ┌──────────────┐  ┌──────────────────────┐    │  │  │
│  │  │  │   tldraw     │  │  useYjsStore Hook    │    │  │  │
│  │  │  │   Canvas     │←→│  - Yjs Document      │    │  │  │
│  │  │  │              │  │  - WebSocket Provider│    │  │  │
│  │  │  └──────────────┘  └──────────────────────┘    │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │ WebSocket (ws://localhost:1234)
                        ↓
┌─────────────────────────────────────────────────────────────┐
│            WebSocket Server (Node.js, Port 1234)            │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Room Manager                                         │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  │  │
│  │  │  Room ABC   │  │  Room XYZ   │  │  Room 123   │  │  │
│  │  │  Yjs Doc    │  │  Yjs Doc    │  │  Yjs Doc    │  │  │
│  │  │  Users: 3   │  │  Users: 2   │  │  Users: 5   │  │  │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────────┘
                        │ WebSocket Broadcast
                        ↓
┌─────────────────────────────────────────────────────────────┐
│                        Browser (User B)                      │
│  (Same structure as User A)                                 │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. User Draws on Canvas

```
User A draws a circle
    ↓
tldraw updates internal state
    ↓
tldraw fires change event
    ↓
useYjsStore listener catches change
    ↓
Update pushed to Yjs document
    ↓
Yjs encodes change as binary
    ↓
WebSocket sends to server
```

### 2. Server Broadcasts Change

```
Server receives binary message
    ↓
Server identifies room (ABC12345)
    ↓
Server applies change to room's Yjs doc
    ↓
Server broadcasts to all connections in room
    ↓
All users (except sender) receive change
```

### 3. Other Users Receive Update

```
User B's WebSocket receives message
    ↓
Yjs decodes binary change
    ↓
Yjs updates local document
    ↓
useYjsStore detects Yjs change
    ↓
tldraw store is updated
    ↓
React re-renders canvas
    ↓
User B sees the circle appear
```

## Component Hierarchy

```
app/layout.tsx (Root Layout)
│
├── app/page.tsx (Landing Page)
│   └── Links to Create/Join
│
├── app/room/new/page.tsx (Create Room)
│   └── Generates room code
│   └── Redirects to /room/[roomId]
│
├── app/room/join/page.tsx (Join Room)
│   └── Accepts room code
│   └── Redirects to /room/[roomId]
│
└── app/room/[roomId]/page.tsx (Whiteboard Room)
    └── components/WhiteboardEditor.tsx
        ├── Header (Room info, User info)
        └── Tldraw Component
            └── useYjsStore Hook
                ├── Yjs Document
                └── WebSocket Provider
```

## State Management

### Local State (React)
- User name
- User role
- Room code
- UI state (loading, errors)

### Shared State (Yjs)
- Canvas drawings
- Shapes and text
- User cursors (awareness)
- Selection states

### Persistence
- **Current**: In-memory only (lost when room closes)
- **Future**: Can add Redis, PostgreSQL, or S3 storage

## Network Protocol

### WebSocket Messages

1. **Sync Protocol (Message Type 0)**
   ```
   Client → Server: "I have version X, what's new?"
   Server → Client: "Here's everything after X"
   ```

2. **Awareness Protocol (Message Type 1)**
   ```
   Client → Server: "My cursor is at (100, 200)"
   Server → All: "User A's cursor is at (100, 200)"
   ```

3. **Document Updates**
   ```
   Binary format using lib0 encoding
   Extremely efficient (10-100 bytes per change)
   ```

## Room Lifecycle

```
1. User creates room
   ↓
2. Server creates Yjs document for room
   ↓
3. User connects via WebSocket
   ↓
4. More users join (WebSocket connections)
   ↓
5. Users collaborate (document updates)
   ↓
6. Users leave (disconnect WebSocket)
   ↓
7. Last user leaves
   ↓
8. Server deletes room document (cleanup)
```

## Security Architecture

### Current Implementation
- ✅ Room isolation (users only see their room)
- ✅ WebSocket per connection
- ✅ No data persistence (privacy)
- ⚠️ No authentication
- ⚠️ No rate limiting
- ⚠️ No room permissions

### Production Recommendations
```
Add Authentication Layer
    ↓
User Login → JWT Token → Verify on Connect
    ↓
Add Rate Limiting
    ↓
Limit messages per second per user
    ↓
Add Room Permissions
    ↓
Owner, Admin, Member, Viewer roles
```

## Scaling Architecture

### Single Server (Current)
```
┌──────────────┐
│  Next.js     │ ← Users
│  + WebSocket │
└──────────────┘
Supports: ~100 concurrent users
```

### Horizontal Scaling (Future)
```
                ┌──────────────┐
            ┌──→│  Next.js 1   │
            │   └──────────────┘
┌─────────┐ │   ┌──────────────┐
│  Load   │─┼──→│  Next.js 2   │
│ Balancer│ │   └──────────────┘
└─────────┘ │   ┌──────────────┐
            └──→│  Next.js 3   │
                └──────────────┘
                       ↓
                ┌──────────────┐
                │    Redis     │ ← Shared Yjs state
                └──────────────┘
Supports: 1000+ concurrent users
```

## Performance Characteristics

### Latency
- Local development: 10-50ms
- Same region: 50-100ms
- Cross-region: 100-300ms
- Affected by: Network speed, server load, message size

### Bandwidth
- Initial sync: 1-10 KB
- Per drawing action: 10-100 bytes
- Awareness updates: 50 bytes/second
- Total per user: ~1-5 KB/minute

### Memory Usage
- Empty room: ~1 MB
- Active room (10 users, 30min): ~5-10 MB
- Server with 100 rooms: ~500 MB - 1 GB

### CPU Usage
- Mostly idle when no activity
- Spikes during heavy drawing
- Scales with number of simultaneous edits

## Technology Stack Deep Dive

### Frontend
```
Next.js 15
├── React 18 (UI rendering)
├── TypeScript (Type safety)
└── Tailwind CSS (Styling)

tldraw 2.4
├── Canvas rendering engine
├── Shape utilities
└── Event handling

Yjs 13.6
├── CRDT implementation
├── Conflict resolution
└── Binary encoding
```

### Backend
```
Node.js + TypeScript
├── ws (WebSocket server)
├── Yjs (Document management)
├── y-protocols (Sync & awareness)
└── lib0 (Binary encoding)
```

## File Organization

```
vmotiv8-whiteboard/
├── Frontend (Next.js)
│   ├── app/              # Pages and routes
│   ├── components/       # React components
│   ├── lib/              # Utilities and hooks
│   └── public/           # Static assets
│
├── Backend (WebSocket)
│   └── server/           # WebSocket server
│
├── Configuration
│   ├── next.config.js    # Next.js config
│   ├── tsconfig.json     # TypeScript config
│   ├── tailwind.config.ts # Tailwind config
│   └── .env.local        # Environment variables
│
└── Documentation
    ├── README.md         # Setup guide
    ├── QUICKSTART.md     # Quick start
    ├── DEPLOYMENT.md     # Deploy guide
    ├── PROJECT_SUMMARY.md # Overview
    └── ARCHITECTURE.md   # This file
```

## Design Patterns

### Component Pattern
```typescript
// Presentational component
function RoomPage() {
  const params = useParams();
  return <WhiteboardEditor roomId={params.roomId} />;
}

// Container component with logic
function WhiteboardEditor({ roomId }) {
  const store = useYjsStore({ roomId });
  return <Tldraw store={store} />;
}
```

### Hook Pattern
```typescript
// Custom hook for complex logic
function useYjsStore({ roomId, hostUrl }) {
  const [store, setStore] = useState(null);

  useEffect(() => {
    // Setup Yjs and WebSocket
    // Return cleanup function
  }, [roomId, hostUrl]);

  return store;
}
```

### Observer Pattern
```typescript
// Yjs observes changes
yStore.observe((event) => {
  // Update tldraw store
});

// tldraw store observes changes
store.listen((changes) => {
  // Update Yjs document
});
```

## Deployment Architecture

### Development
```
localhost:3000 (Next.js) ←→ localhost:1234 (WebSocket)
```

### Production (Recommended)
```
vmotiv8.com (Vercel) ←→ ws.vmotiv8.com (Railway)
     HTTPS                    WSS (SSL)
```

### Alternative (All-in-one)
```
DigitalOcean App Platform
├── Web Service 1: Next.js (Port 3000)
└── Web Service 2: WebSocket (Port 1234)
```

## Monitoring & Debugging

### Browser DevTools
- Console: JavaScript errors
- Network: WebSocket messages
- Performance: Rendering issues

### Server Logs
```
New connection to room: ABC12345
Connection closed for room: ABC12345
Room ABC12345 is empty, document removed
```

### Metrics to Track
- Active connections
- Rooms count
- Messages per second
- Memory usage
- Error rate

---

This architecture provides a solid foundation for real-time collaboration while remaining simple and maintainable.
