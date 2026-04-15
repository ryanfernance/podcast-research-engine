# Geronimo Podcast Research Engine

## Deploy to Netlify (10 minutes)

### Step 1: Push to GitHub

1. Create a new repo on GitHub (e.g. `podcast-research-engine`)
2. In your terminal:
```
cd ~/Downloads/podcast-engine
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/podcast-research-engine.git
git push -u origin main
```

### Step 2: Connect to Netlify

1. Go to [netlify.com](https://app.netlify.com) and log in
2. Click "Add new site" > "Import an existing project"
3. Select GitHub and pick your `podcast-research-engine` repo
4. Build settings should auto-detect from netlify.toml:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Click "Deploy"
6. Wait 1-2 minutes. Your site is live.

### Step 3: Set up auto-scraping

1. In your GitHub repo, go to **Settings > Secrets and variables > Actions**
2. Click **New repository secret**
3. Add: `YOUTUBE_API_KEY` with your YouTube API key as the value
4. That's it. The scraper runs automatically every Sunday at 8pm AEST.

You can also trigger it manually: go to **Actions** tab > **Weekly Podcast Scrape** > **Run workflow**.

## How it works

- `public/data.json` contains the podcast data
- The app fetches it on load and renders the cards with thumbnails
- Every Sunday, a GitHub Action runs `scrape.py`, updates `data.json`, commits, and pushes
- Netlify detects the commit and auto-redeploys (takes ~30 seconds)
- New episodes appear automatically. You never touch it.

## Files

- `src/App.jsx` — the React app
- `public/data.json` — the scraped podcast data (auto-updated weekly)
- `scrape.py` — the YouTube scraper (runs in GitHub Actions)
- `.github/workflows/scrape.yml` — the weekly auto-scrape config
