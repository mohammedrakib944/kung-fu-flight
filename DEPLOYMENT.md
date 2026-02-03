# Deployment Guide

## Quick Deploy to Vercel (Recommended)

Vercel offers the easiest deployment for React apps:

### Option 1: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts:
   - Setup and deploy? Yes
   - Which scope? Choose your account
   - Link to existing project? No
   - Project name? flight-search-engine
   - Directory? ./
   - Override settings? No

5. Your app will be live! Vercel will provide a URL.

### Option 2: Deploy via Vercel Dashboard

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Vite and configure build settings
6. Click "Deploy"

## Deploy to Netlify

### Option 1: Netlify CLI

1. Install Netlify CLI:
```bash
npm install -g netlify-cli
```

2. Build the project:
```bash
npm run build
```

3. Deploy:
```bash
netlify deploy --prod
```

4. When prompted, choose "dist" as your deploy folder

### Option 2: Netlify Dashboard

1. Push code to GitHub (same as Vercel above)
2. Go to [netlify.com](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect to GitHub and select your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

## Environment Variables (If needed)

If you move API credentials to environment variables:

### Vercel
```bash
vercel env add VITE_AMADEUS_API_KEY
vercel env add VITE_AMADEUS_API_SECRET
```

### Netlify
```bash
netlify env:set VITE_AMADEUS_API_KEY your-key-here
netlify env:set VITE_AMADEUS_API_SECRET your-secret-here
```

Or add them in the dashboard under Settings → Environment Variables

## Custom Domain (Optional)

Both Vercel and Netlify allow custom domains:

1. Go to your project settings
2. Navigate to Domains
3. Add your custom domain
4. Update DNS records as instructed

## Monitoring Deployment

After deployment:

1. Test all features on the live site
2. Check browser console for errors
3. Test on mobile devices
4. Verify API calls are working
5. Test all filters and interactions

## Troubleshooting

### Build Fails
- Check Node version (should be 16+)
- Ensure all dependencies are in package.json
- Check build logs for specific errors

### API Not Working in Production
- Verify API credentials are accessible
- Check CORS settings
- Ensure you're using HTTPS endpoints

### Blank Page After Deploy
- Check browser console for errors
- Verify build output in dist folder
- Check if all assets are being served correctly
