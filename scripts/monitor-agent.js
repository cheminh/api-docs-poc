const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

// Configuration
const config = {
  distributionApi: {
    swaggerUrl: 'https://tripx-distribution-api.prd.aks.manulife.ca/swagger-ui-init.js',
    checksumFile: '.cache/distribution-api-checksum.txt'
  }
  // Add other APIs here as needed
};

// Ensure cache directory exists
const cacheDir = path.join(__dirname, '../.cache');
if (!fs.existsSync(cacheDir)) {
  fs.mkdirSync(cacheDir, { recursive: true });
}

function calculateChecksum(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

function downloadSwagger(url) {
  console.log(`📥 Downloading from ${url}...`);
  try {
    const result = execSync(`curl -k -s "${url}"`, { encoding: 'utf8' });
    return result;
  } catch (error) {
    console.error(`❌ Failed to download: ${error.message}`);
    return null;
  }
}

function extractSpec(swaggerJs) {
  try {
    const match = swaggerJs.match(/"swaggerDoc":\s*({[\s\S]*}),?\s*"customOptions"/);
    if (match) {
      const spec = eval('(' + match[1] + ')');
      return JSON.stringify(spec);
    }
  } catch (error) {
    console.error(`❌ Failed to extract spec: ${error.message}`);
  }
  return null;
}

function hasChanged(apiName, currentChecksum) {
  const checksumFile = config[apiName].checksumFile;
  const checksumPath = path.join(__dirname, '..', checksumFile);

  if (!fs.existsSync(checksumPath)) {
    console.log(`📝 No previous checksum found for ${apiName}`);
    return true;
  }

  const previousChecksum = fs.readFileSync(checksumPath, 'utf8').trim();
  const changed = previousChecksum !== currentChecksum;

  if (changed) {
    console.log(`🔄 ${apiName} has changed!`);
    console.log(`   Previous: ${previousChecksum.substring(0, 12)}...`);
    console.log(`   Current:  ${currentChecksum.substring(0, 12)}...`);
  } else {
    console.log(`✅ ${apiName} is up to date`);
  }

  return changed;
}

function saveChecksum(apiName, checksum) {
  const checksumFile = config[apiName].checksumFile;
  const checksumPath = path.join(__dirname, '..', checksumFile);
  fs.writeFileSync(checksumPath, checksum, 'utf8');
}

function updateDocs(apiName) {
  console.log(`\n🔄 Updating ${apiName} documentation...`);

  try {
    // Run the update process
    execSync('node scripts/filter-api-spec.js', { stdio: 'inherit' });
    execSync(`npx docusaurus clean-api-docs ${apiName}`, { stdio: 'pipe' });
    execSync(`npx docusaurus gen-api-docs ${apiName}`, { stdio: 'inherit' });
    execSync(`node scripts/flatten-sidebar.js ${apiName}`, { stdio: 'inherit' });

    console.log(`✅ ${apiName} documentation updated successfully`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to update docs: ${error.message}`);
    return false;
  }
}

function commitChanges(apiName, message) {
  console.log(`\n📝 Committing changes...`);

  try {
    execSync('git add .', { stdio: 'pipe' });
    execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
    console.log(`✅ Changes committed`);
    return true;
  } catch (error) {
    if (error.message.includes('nothing to commit')) {
      console.log(`ℹ️  No changes to commit`);
      return true;
    }
    console.error(`❌ Failed to commit: ${error.message}`);
    return false;
  }
}

function sendNotification(apiName, changes) {
  // TODO: Implement notifications (Slack, email, etc.)
  console.log(`\n🔔 Notification: ${apiName} has been updated`);
  console.log(`   Changes detected and documentation regenerated`);

  // Example: Send to Slack webhook
  // const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  // if (webhookUrl) {
  //   const payload = {
  //     text: `🤖 API Documentation Updated`,
  //     blocks: [
  //       {
  //         type: "section",
  //         text: { type: "mrkdwn", text: `*${apiName}* documentation has been automatically updated.` }
  //       }
  //     ]
  //   };
  //   execSync(`curl -X POST -H 'Content-type: application/json' --data '${JSON.stringify(payload)}' ${webhookUrl}`);
  // }
}

async function monitorAPI(apiName) {
  console.log(`\n🔍 Checking ${apiName}...`);

  const swaggerUrl = config[apiName].swaggerUrl;

  // Download current swagger
  const swaggerJs = downloadSwagger(swaggerUrl);
  if (!swaggerJs) {
    console.error(`❌ Failed to download swagger for ${apiName}`);
    return false;
  }

  // Extract spec
  const specJson = extractSpec(swaggerJs);
  if (!specJson) {
    console.error(`❌ Failed to extract spec for ${apiName}`);
    return false;
  }

  // Save for processing
  fs.writeFileSync('openapi/tripx-api-downloaded.json', JSON.stringify(JSON.parse(specJson), null, 2), 'utf8');

  // Calculate checksum
  const currentChecksum = calculateChecksum(specJson);

  // Check if changed
  if (!hasChanged(apiName, currentChecksum)) {
    return false; // No changes
  }

  // Update documentation
  const updated = updateDocs(apiName);
  if (!updated) {
    return false;
  }

  // Save new checksum
  saveChecksum(apiName, currentChecksum);

  // Commit changes (optional)
  const autoCommit = process.env.AUTO_COMMIT === 'true';
  if (autoCommit) {
    commitChanges(apiName, `🤖 Auto-update ${apiName} documentation`);
  }

  // Send notification
  sendNotification(apiName, { checksum: currentChecksum });

  return true;
}

// Main execution
async function main() {
  console.log('🤖 API Documentation Monitor Agent');
  console.log('==================================\n');

  const apisToMonitor = Object.keys(config);
  let changesDetected = false;

  for (const apiName of apisToMonitor) {
    const changed = await monitorAPI(apiName);
    if (changed) {
      changesDetected = true;
    }
  }

  console.log('\n==================================');
  if (changesDetected) {
    console.log('✅ Monitoring complete - Changes detected and applied');
    process.exit(0);
  } else {
    console.log('✅ Monitoring complete - No changes detected');
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { monitorAPI };
