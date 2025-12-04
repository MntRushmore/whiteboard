# Quick Start Guide - vMotiv8 Whiteboard

Get up and running in 5 minutes!

## Prerequisites

You need Node.js 18 or higher installed. Check with:
```bash
node --version
```

If you don't have Node.js, download it from [nodejs.org](https://nodejs.org/)

## Installation

1. **Navigate to the project folder:**
```bash
cd vmotiv8-whiteboard
```

2. **Install dependencies:**
```bash
npm install
```

This will take 2-3 minutes. Wait for it to complete.

## Running the Application

You need to run TWO servers (WebSocket + Next.js):

### Option 1: Automatic (Mac/Linux)

```bash
./start.sh
```

This starts both servers automatically!

### Option 2: Manual (All platforms)

**Terminal 1** - WebSocket Server:
```bash
npm run server
```

Keep this running. You should see:
```
WebSocket server running on ws://localhost:1234
vMotiv8 Whiteboard Server Ready
```

**Terminal 2** - Next.js:
```bash
npm run dev
```

Keep this running too. You should see:
```
- Local:        http://localhost:3000
- Ready in Xms
```

## Access the Application

Open your browser and go to:
```
http://localhost:3000
```

## Testing Multiplayer

To test the real-time collaboration:

1. Open http://localhost:3000 in your browser
2. Click "Create Room"
3. Enter your name (e.g., "Teacher") and click "Create Room"
4. **Copy the room code** (e.g., "ABC12345")
5. Open a **new browser window** (or use incognito mode)
6. Go to http://localhost:3000 again
7. Click "Join Room"
8. Enter a different name (e.g., "Student") and paste the room code
9. Click "Join Room"

Now you have two windows with the same whiteboard. Draw in one window and watch it appear in the other instantly!

## Stopping the Servers

### If you used start.sh:
Press `Ctrl+C` in the terminal

### If you used manual method:
Press `Ctrl+C` in both terminals

## Troubleshooting

### "Port 1234 is already in use"

Something is using port 1234. Either:
1. Stop that process, or
2. Change the port in `.env.local`:
   ```env
   NEXT_PUBLIC_WS_URL=ws://localhost:3000
   WS_PORT=3000
   ```
   Then restart both servers.

### "Connection to whiteboard..." hangs

Make sure the WebSocket server is running. Check Terminal 1.

### "Module not found" errors

Run `npm install` again. Delete `node_modules` first if needed:
```bash
rm -rf node_modules
npm install
```

### Changes not syncing between windows

1. Check that both windows show the same room code
2. Refresh both browser windows
3. Check WebSocket server terminal for errors
4. Make sure you're not blocking WebSocket connections (firewall/antivirus)

### Browser console errors

Open browser DevTools (F12) and check the Console tab. Common issues:
- WebSocket connection failed → Server not running
- CORS errors → Clear browser cache and refresh
- Module errors → Run `npm install` again

## Next Steps

### Learn More
- Read `README.md` for full documentation
- Read `DEPLOYMENT.md` for production deployment
- Read `PROJECT_SUMMARY.md` for technical details

### Customize
- Edit colors in `tailwind.config.ts`
- Change branding in `app/page.tsx`
- Modify whiteboard in `components/WhiteboardEditor.tsx`

### Deploy
- See `DEPLOYMENT.md` for production deployment
- Recommended: Vercel (frontend) + Railway (WebSocket)
- Cost: ~$5/month to start

## Common Questions

**Q: Can I use this over the internet?**
A: Yes! But you need to deploy it. See DEPLOYMENT.md.

**Q: How many users can join one room?**
A: Tested with 10+ users. Can handle more with proper deployment.

**Q: Is data saved?**
A: No, currently sessions are temporary. Data is lost when everyone leaves. See README.md for persistence options.

**Q: Can I add authentication?**
A: Yes! The architecture supports it. You'd need to add a login system and modify the room join flow.

**Q: Is it mobile-friendly?**
A: Yes! tldraw works on touch devices. Test on your phone/tablet.

**Q: Can I use it commercially?**
A: Check with vMotiv8. This is built for vMotiv8's internal use.

## Get Help

- Check browser console (F12) for errors
- Check WebSocket server terminal for logs
- Read error messages carefully
- Contact vMotiv8 development team

---

**You're ready to go! Create a room and start drawing!** 🎨
