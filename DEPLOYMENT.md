# Deployment Guide

This guide explains how to deploy your Saxophone Fingering Visualizer app using GitHub Actions, GitHub Pages (frontend), and Render (backend).

## Architecture

- **Frontend**: Deployed to GitHub Pages (static site hosting)
- **Backend**: Deployed to Render (Python/FastAPI hosting)
- **CI/CD**: GitHub Actions runs tests and deploys automatically

## Prerequisites

1. ✅ GitHub account with repository access
2. ✅ Render account linked to your GitHub account

## Setup Instructions

### 1. Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/raphk99/sax`
2. Click **Settings** → **Pages**
3. Under **Source**, select: **GitHub Actions**
4. Save the settings

### 2. Deploy Backend to Render

The backend is configured to auto-deploy from your GitHub repository using the `render.yaml` blueprint.

#### Option A: Deploy via Render Dashboard (Recommended)

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New** → **Blueprint**
3. Connect your GitHub repository: `raphk99/sax`
4. Render will automatically detect the `render.yaml` file
5. Click **Apply** to create the service
6. Wait for the first deployment to complete (~5-10 minutes)
7. Copy your backend URL (it will be something like: `https://sax-backend.onrender.com`)

#### Option B: Deploy via Render CLI

```bash
# Install Render CLI
npm install -g @render/cli

# Login to Render
render login

# Deploy using blueprint
render blueprint launch
```

### 3. Update Frontend Configuration

After deploying to Render, update the backend URL:

1. Edit `frontend/.env.production`
2. Replace `https://sax-backend.onrender.com` with your actual Render service URL
3. Commit and push:

```bash
git add frontend/.env.production
git commit -m "Update production backend URL"
git push
```

### 4. Deploy!

Once you push to the `main` branch:

1. **GitHub Actions** will automatically:
   - Run backend tests (Python/pytest)
   - Run frontend tests (Playwright)
   - Build the frontend
   - Deploy to GitHub Pages

2. **Render** will automatically:
   - Pull the latest code from `main` branch
   - Install dependencies
   - Start the FastAPI server
   - Monitor health at `/api/health`

### 5. Access Your App

- **Frontend**: `https://raphk99.github.io/sax/`
- **Backend**: `https://sax-backend.onrender.com` (or your custom Render URL)
- **API Docs**: `https://sax-backend.onrender.com/docs`

## GitHub Actions Workflows

### Test Workflow (`.github/workflows/test.yml`)

Runs on every push and pull request:
- ✅ Tests Python backend with pytest
- ✅ Tests Vue frontend with Playwright
- ✅ Uploads test reports as artifacts

### Deploy Workflow (`.github/workflows/deploy.yml`)

Runs on every push to `main`:
- 🚀 Builds the frontend with production settings
- 🚀 Deploys to GitHub Pages automatically

## Important Notes

### Render Free Tier Limitations

- **Spin-down**: Service spins down after 15 minutes of inactivity
- **Spin-up time**: First request after spin-down takes ~30-60 seconds
- **Build time**: Initial deployment takes ~5-10 minutes
- **750 hours/month**: Free tier includes 750 hours of runtime

### CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:5173` (local development)
- `https://raphk99.github.io` (production)

If you change the frontend URL, update `backend/app/main.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://your-custom-domain.com",  # Add your domain
    ],
    ...
)
```

## Monitoring & Debugging

### View GitHub Actions Logs

1. Go to your repository
2. Click **Actions** tab
3. Select a workflow run to view logs

### View Render Logs

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click on your service
3. View **Logs** tab for real-time logs
4. View **Events** tab for deployment history

### Common Issues

#### Frontend shows "Failed to parse"
- Check Render logs to see if the backend is running
- Verify the `VITE_API_BASE_URL` in `.env.production` is correct
- Check browser console for CORS errors

#### GitHub Pages shows 404
- Make sure you enabled GitHub Pages in repository settings
- Check that the deploy workflow completed successfully
- Wait a few minutes for DNS propagation

#### Render deployment fails
- Check the **Events** tab in Render Dashboard
- Verify `requirements.txt` has all dependencies
- Check that Python version matches (3.11)

## Local Development

### Run Backend Locally

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8020
```

### Run Frontend Locally

```bash
cd frontend
npm install
npm run dev
```

The frontend dev server will proxy API requests to `http://127.0.0.1:8020`.

## Updating the App

1. Make your changes locally
2. Run tests:
   ```bash
   # Backend
   cd backend
   python -m pytest tests/ -v
   
   # Frontend
   cd frontend
   npm run test:e2e
   ```
3. Commit and push:
   ```bash
   git add .
   git commit -m "Your changes"
   git push
   ```
4. GitHub Actions and Render will automatically deploy your changes!

## Custom Domain (Optional)

### For GitHub Pages (Frontend)
1. Buy a domain (e.g., from Namecheap, Google Domains)
2. Add CNAME record pointing to `raphk99.github.io`
3. In repository settings → Pages, add your custom domain

### For Render (Backend)
1. In Render Dashboard, go to your service
2. Click **Settings** → **Custom Domain**
3. Add your domain and follow DNS instructions

## Cost Estimate

- **GitHub Pages**: Free
- **GitHub Actions**: 2,000 minutes/month free (should be plenty)
- **Render**: Free tier (with spin-down)

**Total cost for this setup: $0/month** 🎉

## Support

If you encounter issues:
- Check the [Render Documentation](https://render.com/docs)
- Check the [GitHub Pages Documentation](https://docs.github.com/pages)
- Review GitHub Actions logs and Render logs
