# Deploy vMotiv8 Whiteboard - Step by Step

Your code is now ready to deploy! Follow these steps:

## Step 1: Deploy WebSocket Server on Railway

1. Go to [railway.app](https://railway.app)
2. Click **"Login"** (use GitHub to login)
3. Click **"New Project"**
4. Click **"Deploy from GitHub repo"**
5. Select **"MntRushmore/whiteboard"**
6. Railway will automatically detect the configuration and start building
7. Wait 2-3 minutes for deployment to complete
8. Once deployed, click on your service
9. Go to **"Settings"** tab
10. Scroll down to **"Networking"** section
11. Click **"Generate Domain"**
12. **COPY THIS URL** (e.g., `vmotiv8-ws-production.up.railway.app`)
13. Add `wss://` to the beginning (e.g., `wss://vmotiv8-ws-production.up.railway.app`)

**Important:** Railway needs to know which port to expose:
- Go to **"Variables"** tab
- Click **"New Variable"**
- Name: `PORT`
- Value: `1234`
- Click **"Add"**

## Step 2: Deploy Frontend on Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click **"Sign Up"** (use GitHub)
3. After signing in, click **"Add New..."** → **"Project"**
4. Find and select **"MntRushmore/whiteboard"**
5. Click **"Import"**
6. **BEFORE deploying**, add environment variable:
   - Click **"Environment Variables"**
   - Name: `NEXT_PUBLIC_WS_URL`
   - Value: `wss://vmotiv8-ws-production.up.railway.app` (use YOUR Railway URL from Step 1)
   - Click **"Add"**
7. Click **"Deploy"**
8. Wait 2-3 minutes
9. You'll get a URL like `vmotiv8-whiteboard.vercel.app`

## Step 3: Test Your App!

1. Open the Vercel URL in your browser
2. Click **"Create Room"**
3. Enter your name and create a room
4. **Copy the room code**
5. Open a **new incognito/private window**
6. Go to the same URL
7. Click **"Join Room"**
8. Paste the room code
9. Draw in one window → it should appear in the other!

## Troubleshooting

### Railway Issues

**"Error: Cannot find module"**
- Go to Railway → Settings → Redeploy

**"WebSocket connection failed"**
- Check that you added the `PORT` variable (1234)
- Make sure you generated a domain in Railway

### Vercel Issues

**"404 NOT_FOUND"**
- Make sure you pushed the latest code to GitHub
- Try redeploying from Vercel dashboard

**"Whiteboard not connecting"**
- Check that `NEXT_PUBLIC_WS_URL` is set correctly
- Must start with `wss://` (not `ws://`)
- Must match your Railway domain exactly
- Go to Vercel → Project Settings → Environment Variables to verify

**"Build failed"**
- Check the build logs in Vercel
- Most common issue: environment variable not set

## Update Your App Later

When you make changes:

1. Make changes to your code
2. Commit: `git add -A && git commit -m "Update message"`
3. Push: `git push origin main`
4. Both Railway and Vercel automatically redeploy!

## Custom Domain (Optional)

### For Vercel (Frontend):
1. Go to Project Settings → Domains
2. Add your domain (e.g., `whiteboard.vmotiv8.com`)
3. Update your DNS as instructed

### For Railway (WebSocket):
1. Go to Settings → Networking
2. Add custom domain (e.g., `ws.vmotiv8.com`)
3. Update DNS
4. Update `NEXT_PUBLIC_WS_URL` in Vercel to use new domain

## Costs

- **Vercel**: FREE (Hobby plan includes everything you need)
- **Railway**: ~$5/month (pay for what you use)
- **Total**: ~$5/month

Railway includes $5 free credit each month, so if usage is low, it might be completely free!

## Getting Help

If something isn't working:

1. Check Railway logs: Railway → Deployments → Click latest → View logs
2. Check Vercel logs: Vercel → Project → Deployments → Click latest → View logs
3. Check browser console (F12) for frontend errors

## Your URLs

After deployment, save these:

- **Frontend**: https://____________.vercel.app
- **WebSocket**: wss://____________.up.railway.app

Share the frontend URL with your tutors and students!

---

**You're all set!** The deployment should take about 10-15 minutes total.
