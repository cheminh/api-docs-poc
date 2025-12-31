#!/bin/bash
set -e

API_NAME=${1:-distributionApi}
CONFIG_FILE="api-visibility.config.json"

echo "🔄 Updating ${API_NAME}..."

# Get the swagger URL from config
if [ "$API_NAME" = "distributionApi" ]; then
    SWAGGER_URL="https://tripx-distribution-api.prd.aks.manulife.ca/swagger-ui-init.js"
else
    echo "❌ Only distributionApi is supported for now"
    exit 1
fi

# Step 1: Download swagger
echo "📥 Downloading Swagger spec..."
curl -k "${SWAGGER_URL}" -o openapi/temp/tripx-api-full.js 2>&1 | tail -1

# Step 2: Extract OpenAPI spec
echo "📦 Extracting OpenAPI spec..."
node -e "const fs = require('fs'); const content = fs.readFileSync('openapi/temp/tripx-api-full.js', 'utf8'); const match = content.match(/\"swaggerDoc\":\s*({[\s\S]*}),?\s*\"customOptions\"/); if (match) { const spec = eval('(' + match[1] + ')'); fs.writeFileSync('openapi/temp/tripx-api-downloaded.json', JSON.stringify(spec, null, 2)); console.log('✅ Extracted successfully'); } else { console.log('❌ Failed to extract'); process.exit(1); }"

# Step 3: Filter based on config
echo "🔍 Filtering endpoints..."
node scripts/filter-api-spec.js

# Step 4: Regenerate docs
echo "📝 Regenerating documentation..."
npx docusaurus clean-api-docs ${API_NAME} > /dev/null 2>&1
npx docusaurus gen-api-docs ${API_NAME} 2>&1 | grep -E "Successfully created|Error" || true

# Step 5: Flatten sidebar
echo "🔧 Flattening sidebar..."
node scripts/flatten-sidebar.js ${API_NAME}

echo "✅ ${API_NAME} updated successfully!"
