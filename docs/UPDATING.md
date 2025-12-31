# Updating API Documentation

This document explains how the API documentation is automatically updated when APIs change.

## Automated Monitoring

The system automatically monitors API endpoints for changes every 4 hours using GitHub Actions.

### How It Works

1. **Monitoring Agent** (`scripts/monitor-agent.js`) runs on schedule
2. Downloads current Swagger spec from live API
3. Calculates checksum and compares with previous version
4. If changed:
   - Updates local OpenAPI spec files
   - Regenerates documentation
   - Commits changes automatically
   - Pushes to repository

### Manual Trigger

You can manually trigger a check at any time:

```bash
npm run monitor
```

Or via GitHub Actions UI (Actions tab → Monitor API Changes → Run workflow)

### Configuration

APIs to monitor are configured in `scripts/monitor-agent.js`:

```javascript
const config = {
	distributionApi: {
		swaggerUrl:
			"https://tripx-distribution-api.prd.aks.manulife.ca/swagger-ui-init.js",
		checksumFile: ".cache/distribution-api-checksum.txt",
	},
};
```

### Checksum Storage

Change detection uses SHA-256 checksums stored in `.cache/`:

- `distribution-api-checksum.txt` - Previous Distribution API state
- Add more as needed for other APIs

### GitHub Actions Workflow

Located at `.github/workflows/monitor-api-changes.yml`:

- **Schedule**: Every 4 hours (`0 */4 * * *`)
- **Manual**: Can trigger via workflow_dispatch
- **Auto-commit**: Enabled via `AUTO_COMMIT=true`

### Notifications

To enable Slack notifications:

1. Set up Slack Incoming Webhook
2. Add webhook URL to GitHub Secrets as `SLACK_WEBHOOK_URL`
3. Uncomment notification code in `monitor-agent.js`

### Single API Update

To manually update just one API:

```bash
# Distribution API
bash scripts/update-api.sh distributionApi

# Or step by step
node scripts/filter-api-spec.js
npx docusaurus clean-api-docs distributionApi
npx docusaurus gen-api-docs distributionApi
node scripts/flatten-sidebar.js distributionApi
```

### All APIs Update

```bash
npm run gen-api-docs
```

This runs sync-api-config and regenerates all API docs.

## Troubleshooting

**No changes detected but API has changed:**

- Delete `.cache/*.txt` files to force refresh
- Check if Swagger URL is correct
- Verify API is accessible (might need VPN)

**Monitoring fails:**

- Check GitHub Actions logs
- Verify Node.js version (requires 18+)
- Ensure all npm dependencies installed

**Auto-commit not working:**

- Check `AUTO_COMMIT` environment variable
- Verify git config in workflow
- Check repository permissions

## Adding New APIs

1. Add API config to `scripts/monitor-agent.js`:

```javascript
newApi: {
  swaggerUrl: 'https://api.example.com/swagger-ui-init.js',
  checksumFile: '.cache/new-api-checksum.txt'
}
```

2. Update `filter-api-spec.js` to handle the new API

3. Test manually:

```bash
npm run monitor
```

## Disabling Auto-Updates

To disable automated monitoring:

1. Delete or disable `.github/workflows/monitor-api-changes.yml`
2. Or adjust cron schedule to less frequent interval

## Security

- SSL verification disabled for UAT (-k flag in curl)
- Production endpoints should use valid certificates
- GitHub token has minimal permissions (repo access only)
- No sensitive data logged or committed
