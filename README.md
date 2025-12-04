# vMotiv8 Whiteboard

A real-time collaborative whiteboard application built for tutors and students at vMotiv8. Powered by Next.js, tldraw, and Yjs for seamless multiplayer collaboration.

## Features

- **Real-time Collaboration**: Multiple users can draw and edit simultaneously
- **Room-based Sessions**: Create or join whiteboard sessions with unique room codes
- **Role-based Access**: Separate tutor and student roles
- **Full Drawing Tools**: Complete set of drawing, text, and annotation tools from tldraw
- **vMotiv8 Branding**: Custom branded interface with vMotiv8 colors and styling
- **Zero Setup for Users**: Simple room code system - no accounts required

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Whiteboard**: tldraw v2
- **Real-time Sync**: Yjs with WebSocket provider
- **WebSocket Server**: Custom Node.js WebSocket server

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository and navigate to the project:
```bash
cd vmotiv8-whiteboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the WebSocket server (in one terminal):
```bash
npm run server
```

4. Start the Next.js development server (in another terminal):
```bash
npm run dev
```

5. Open your browser and navigate to:
```
http://localhost:3000
```

## Usage

### Creating a Room

1. Go to the homepage
2. Click "Create Room"
3. Enter your name and select your role (Tutor/Student)
4. A unique room code will be generated
5. Share the room code with participants

### Joining a Room

1. Go to the homepage
2. Click "Join Room"
3. Enter your name and the room code
4. Select your role (Tutor/Student)
5. Click "Join Room"

## Project Structure

```
vmotiv8-whiteboard/
├── app/                      # Next.js app directory
│   ├── page.tsx             # Homepage
│   ├── layout.tsx           # Root layout
│   ├── globals.css          # Global styles
│   └── room/                # Room routes
│       ├── new/             # Create room page
│       ├── join/            # Join room page
│       └── [roomId]/        # Dynamic room page
├── components/              # React components
│   └── WhiteboardEditor.tsx # Main whiteboard component
├── lib/                     # Utilities and hooks
│   └── useYjsStore.ts      # Yjs store integration
├── server/                  # WebSocket server
│   └── index.ts            # Server implementation
├── public/                  # Static assets
└── package.json            # Dependencies and scripts
```

## Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_WS_URL=ws://localhost:1234
WS_PORT=1234
```

For production, update these to your deployed WebSocket server URL.

## Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variable:
   - `NEXT_PUBLIC_WS_URL`: Your WebSocket server URL (e.g., `wss://ws.yourdomain.com`)
4. Deploy

### WebSocket Server

The WebSocket server needs to be deployed separately on a platform that supports WebSocket connections:

**Option 1: Railway**
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**Option 2: Render**
1. Create a new Web Service
2. Connect your repository
3. Set build command: `npm install`
4. Set start command: `npm run server`
5. Add environment variable `WS_PORT=1234`

**Option 3: DigitalOcean App Platform**
1. Create a new app
2. Connect your repository
3. Configure run command: `npm run server`
4. Set port to 1234

### Docker Deployment

Build and run with Docker:

```bash
# Build the WebSocket server image
docker build -t vmotiv8-ws-server -f Dockerfile.server .

# Run the container
docker run -p 1234:1234 vmotiv8-ws-server
```

## Development

### Running in Development Mode

Terminal 1 - WebSocket Server:
```bash
npm run server
```

Terminal 2 - Next.js Dev Server:
```bash
npm run dev
```

### Building for Production

```bash
npm run build
npm start
```

## Features Roadmap

- [ ] Persistent storage for whiteboard sessions
- [ ] User authentication and accounts
- [ ] Session recording and playback
- [ ] Export whiteboard as PDF/PNG
- [ ] Voice/video chat integration
- [ ] Screen sharing
- [ ] Session history and saved boards
- [ ] Enhanced permissions (view-only mode)

## Troubleshooting

### WebSocket Connection Issues

If you see "Connecting to whiteboard..." indefinitely:

1. Ensure the WebSocket server is running: `npm run server`
2. Check the WebSocket server console for errors
3. Verify the `NEXT_PUBLIC_WS_URL` environment variable is set correctly
4. Check browser console for connection errors

### Port Already in Use

If port 1234 is already in use:

1. Change `WS_PORT` in `.env.local`
2. Update `NEXT_PUBLIC_WS_URL` to match the new port
3. Restart both servers

## License

Proprietary - vMotiv8

## Support

For questions or support, contact the vMotiv8 development team.

---

Built with ❤️ for vMotiv8
