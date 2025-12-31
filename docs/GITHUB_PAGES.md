# GitHub Pages Setup

## Initial Setup

### 1. Update docusaurus.config.ts

Replace these values in your config:

```typescript
url: "https://YOUR_GITHUB_USERNAME.github.io",
baseUrl: "/tripx-api-manual/",  // Should match your repo name
organizationName: "YOUR_GITHUB_USERNAME",
projectName: "tripx-api-manual",
```

### 2. Enable GitHub Pages

1. Go to your GitHub repo
2. Click **Settings** tab
3. Click **Pages** in left sidebar
4. Under "Build and deployment":
   - Source: **GitHub Actions**
5. Click **Save**

### 3. Commit and Push

```bash
git add .github/workflows/deploy-pages.yml
git add docusaurus.config.ts
git commit -m "Setup GitHub Pages deployment"
git push origin main
```

## How It Works

**Automatic Updates:**

1. **Monitor workflow** runs every 4 hours

   - Checks API for changes
   - Regenerates docs if changed
   - Commits and pushes to `main`

2. **Deploy workflow** triggers on push
   - Builds Docusaurus site
   - Deploys to GitHub Pages
   - **Site updates automatically!**

**Result:** API changes → Auto-updated docs → Auto-deployed site ✨

## Monitoring

### View Deployments

- Go to **Actions** tab
- See both workflows:
  - "Monitor API Changes" (every 4 hours)
  - "Deploy to GitHub Pages" (on push)

### Your Site URL

After first deployment: `https://YOUR_GITHUB_USERNAME.github.io/tripx-api-manual/`

### Manual Deploy

- **Actions** tab → **Deploy to GitHub Pages** → **Run workflow**

## Workflow

```
Every 4 hours:
  ├─ Monitor agent checks API
  ├─ Detects changes?
  │   ├─ Yes: Update docs → Commit → Push
  │   │   └─ Triggers deploy workflow
  │   │       └─ Build → Deploy to Pages
  │   │           └─ Site live in ~2 minutes!
  │   └─ No: Do nothing
```

## Troubleshooting

**Site not accessible:**

- Check Pages settings: Settings → Pages → Source = "GitHub Actions"
- Verify first deployment completed: Actions tab

**Deploy failed:**

- Check build succeeds locally: `npm run build`
- Review workflow logs in Actions tab

**API updates not appearing:**

- Check monitoring workflow runs: Actions → Monitor API Changes
- View logs to see if changes detected
- Verify checksum files in `.cache/` directory

**Wrong base URL:**

- Ensure `baseUrl` in docusaurus.config.ts matches repo name
- Must include leading and trailing slashes: `/repo-name/`

## Custom Domain (Optional)

1. Add `CNAME` file to `static/` folder:

   ```
   docs.tripx.com
   ```

2. Update docusaurus.config.ts:

   ```typescript
   url: "https://docs.tripx.com",
   baseUrl: "/",
   ```

3. Configure DNS:

   - Add CNAME record pointing to `YOUR_GITHUB_USERNAME.github.io`

4. In GitHub Pages settings:
   - Enter custom domain
   - Enable "Enforce HTTPS"
