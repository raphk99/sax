# Quick Start Deployment Guide

Follow these steps to deploy your app:

## Step 1: Enable GitHub Pages
1. Go to: `https://github.com/raphk99/sax/settings/pages`
2. Under **Source**, select: **GitHub Actions**
3. Click **Save**

## Step 2: Deploy Backend to Render
1. Go to: https://dashboard.render.com/
2. Click **New** → **Blueprint**
3. Connect repository: `raphk99/sax`
4. Click **Apply**
5. Wait for deployment (~5-10 min)
6. Copy your service URL (e.g., `https://sax-backend.onrender.com`)

## Step 3: Update Backend URL
1. Edit `frontend/.env.production`
2. Change the URL to your Render service URL:
   ```
   VITE_API_BASE_URL=https://YOUR-SERVICE-NAME.onrender.com
   ```
3. Commit and push:
   ```bash
   git add frontend/.env.production
   git commit -m "Update backend URL"
   git push
   ```

## Step 4: Wait for Deployment
- GitHub Actions will automatically deploy your frontend
- Check progress: `https://github.com/raphk99/sax/actions`

## Step 5: Access Your App
- **Frontend**: https://raphk99.github.io/sax/
- **Backend API**: https://YOUR-SERVICE-NAME.onrender.com/docs

## That's it! 🎉

Your app is now live and will auto-deploy on every push to `main`.

⚠️ **Note**: Render free tier spins down after 15 min of inactivity. First request after spin-down takes ~30-60 seconds.

For more details, see [DEPLOYMENT.md](./DEPLOYMENT.md)
