# vMotiv8 Whiteboard - Deployment Guide

This guide covers deploying the vMotiv8 Whiteboard application to production.

## Architecture Overview

The application consists of two components:

1. **Next.js Frontend** - Serves the web interface
2. **WebSocket Server** - Handles real-time collaboration

Both need to be deployed separately.

## Quick Deployment (Recommended)

### Frontend: Vercel

1. Push your code to GitHub/GitLab
2. Visit [vercel.com](https://vercel.com)
3. Click "New Project" and import your repository
4. Configure environment variables:
   ```
   NEXT_PUBLIC_WS_URL=wss://your-websocket-server.com
   ```
5. Click "Deploy"

### WebSocket Server: Railway

1. Visit [railway.app](https://railway.app)
2. Create a new project
3. Click "Deploy from GitHub repo"
4. Select your repository
5. Configure:
   - Build Command: `npm install`
   - Start Command: `npm run server`
   - Port: `1234`
6. After deployment, copy the public URL
7. Update Vercel environment variable with this URL

## Alternative Deployment Options

### Option 1: All-in-One on DigitalOcean App Platform

Deploy both frontend and backend together:

1. Create a DigitalOcean account
2. Go to App Platform
3. Create new app from GitHub
4. Add two components:
   - **Web Service** (Frontend):
     - Build: `npm run build`
     - Run: `npm start`
     - Port: 3000
   - **Web Service** (Backend):
     - Build: `npm install`
     - Run: `npm run server`
     - Port: 1234
5. Set environment variables in Frontend:
   ```
   NEXT_PUBLIC_WS_URL=wss://[backend-url]
   ```

Cost: ~$10-15/month

### Option 2: Docker + Any VPS

Deploy using Docker on any VPS (AWS, DigitalOcean, Linode, etc.):

1. SSH into your VPS
2. Install Docker and Docker Compose
3. Clone your repository
4. Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  websocket:
    build:
      context: .
      dockerfile: Dockerfile.server
    ports:
      - "1234:1234"
    environment:
      - WS_PORT=1234
    restart: unless-stopped

  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_WS_URL=wss://your-domain.com
    depends_on:
      - websocket
    restart: unless-stopped
```

5. Create `Dockerfile` for frontend:

```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]
```

6. Run: `docker-compose up -d`
7. Set up Nginx reverse proxy with SSL

### Option 3: Render (Separate Services)

**WebSocket Server:**
1. Create new Web Service
2. Connect GitHub repo
3. Settings:
   - Build: `npm install`
   - Start: `npm run server`
   - Port: 1234
4. Deploy and copy URL

**Frontend:**
1. Create new Web Service
2. Connect same GitHub repo
3. Settings:
   - Build: `npm run build`
   - Start: `npm start`
4. Add environment variable:
   ```
   NEXT_PUBLIC_WS_URL=wss://[websocket-url]
   ```

Cost: ~$14/month (2x $7 services)

## SSL/TLS Configuration

For production, you MUST use WSS (WebSocket Secure):

### If using Railway/Render
SSL is automatic - just use the `wss://` URL provided

### If using your own domain with Nginx

Add to your Nginx configuration:

```nginx
# WebSocket Server
server {
    listen 443 ssl http2;
    server_name ws.vmotiv8.com;

    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

    location / {
        proxy_pass http://localhost:1234;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Frontend
server {
    listen 443 ssl http2;
    server_name whiteboard.vmotiv8.com;

    ssl_certificate /path/to/fullchain.pem;
    ssl_certificate_key /path/to/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Get free SSL certificates from [Let's Encrypt](https://letsencrypt.org/) using Certbot.

## Environment Variables

### Production Frontend (.env.production)
```env
NEXT_PUBLIC_WS_URL=wss://ws.vmotiv8.com
```

### Production WebSocket Server
```env
WS_PORT=1234
NODE_ENV=production
```

## DNS Configuration

Point your domains to your servers:

1. **Frontend**: `whiteboard.vmotiv8.com` → Frontend server IP
2. **WebSocket**: `ws.vmotiv8.com` → WebSocket server IP

Or use a subdomain:
- `vmotiv8.com` → Frontend
- `ws.vmotiv8.com` → WebSocket

## Health Checks

Add health check endpoints:

**WebSocket Server** - Add to `server/index.ts`:
```typescript
import http from 'http';

const healthServer = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200);
    res.end('OK');
  }
});
healthServer.listen(8080);
```

## Monitoring

### Basic Monitoring

1. **Uptime Monitoring**: Use [UptimeRobot](https://uptimerobot.com/) (free)
   - Monitor both frontend and WebSocket URLs
   - Get alerts if services go down

2. **Error Tracking**: Use [Sentry](https://sentry.io/) (free tier available)
   - Add to Next.js for frontend errors
   - Add to WebSocket server for backend errors

### Logs

Access logs:
- **Vercel**: View in Vercel dashboard
- **Railway**: View in Railway dashboard
- **Docker**: `docker-compose logs -f`
- **VPS**: Check logs with `pm2 logs` if using PM2

## Scaling

### Horizontal Scaling

For high traffic, you can scale horizontally:

1. Use Redis as a persistence layer for Yjs
2. Deploy multiple WebSocket server instances
3. Use a load balancer with sticky sessions

See [y-redis](https://github.com/yjs/y-redis) for Redis integration.

### Vertical Scaling

Minimum requirements:
- 512MB RAM (small usage)
- 1GB RAM (recommended)
- 2GB RAM (high usage)

## Backup Strategy

The current implementation doesn't persist data. For production, consider:

1. **Redis Persistence**: Store documents in Redis
2. **Database Storage**: Save snapshots to PostgreSQL
3. **S3 Storage**: Export and save completed sessions

## Cost Estimates

### Budget Option (~$5-10/month)
- Vercel: Free (Hobby)
- Railway: $5/month
- Total: ~$5/month

### Recommended Option (~$15-20/month)
- Vercel: Free (Hobby)
- Railway: $5/month
- DigitalOcean Droplet: $12/month (1GB)
- Total: ~$17/month

### Enterprise Option (~$50+/month)
- Vercel: $20/month (Pro)
- DigitalOcean Droplet: $24/month (2GB)
- Database: $15/month
- Monitoring: Free (Sentry/UptimeRobot)
- Total: ~$60/month

## Troubleshooting

### WebSocket Connection Fails

1. Check if WSS is enabled (production requires SSL)
2. Verify firewall allows port 1234
3. Check CORS settings if different domains
4. Verify `NEXT_PUBLIC_WS_URL` is correct

### High Memory Usage

1. Implement document cleanup (current implementation does this)
2. Add Redis persistence to offload memory
3. Scale vertically (more RAM)

### Slow Performance

1. Enable Next.js caching
2. Use CDN for static assets
3. Deploy WebSocket server closer to users
4. Consider multiple regional WebSocket servers

## Security Checklist

- [ ] Use WSS (not WS) in production
- [ ] Enable CORS restrictions
- [ ] Add rate limiting
- [ ] Implement room size limits
- [ ] Add authentication if needed
- [ ] Enable HTTPS for frontend
- [ ] Keep dependencies updated
- [ ] Monitor for security vulnerabilities

## Support

For deployment issues, check:
- Next.js deployment docs: https://nextjs.org/docs/deployment
- Vercel docs: https://vercel.com/docs
- Railway docs: https://docs.railway.app

---

Need help? Contact the vMotiv8 development team.
