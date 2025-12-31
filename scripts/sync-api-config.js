const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Read the API visibility config
const configPath = path.join(__dirname, '../api-visibility.config.json');
const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));

// Mapping of config keys to OpenAPI spec files
const apiMapping = {
  distributionApi: 'openapi/tripx-distribution-api.yaml',
  policyApi: 'openapi/tripx-policy-api.yaml',
  quoteApi: 'openapi/tripx-quote-api.yaml',
  recommendationApi: 'openapi/tripx-recommendation-api.yaml',
  productApi: 'openapi/tripx-product-api.yaml'
};

// Update each OpenAPI spec with the configured baseUrl
Object.keys(apiMapping).forEach(apiKey => {
  const apiConfig = config[apiKey];
  const specPath = path.join(__dirname, '..', apiMapping[apiKey]);

  if (!apiConfig || !fs.existsSync(specPath)) {
    console.log(`⚠️  Skipping ${apiKey} - config or spec file not found`);
    return;
  }

  try {
    // Read the OpenAPI spec
    const specContent = fs.readFileSync(specPath, 'utf8');
    const spec = yaml.load(specContent);

    // Update the servers section with the configured baseUrl
    if (!spec.servers) {
      spec.servers = [];
    }

    // Clear existing servers and add the configured one
    spec.servers = [
      {
        url: apiConfig.baseUrl,
        description: `${apiConfig.environment.toUpperCase()} Environment`
      }
    ];

    // Handle path overrides and custom descriptions/summaries for endpoints
    if (apiConfig.endpoints && spec.paths) {
      apiConfig.endpoints.forEach(endpoint => {
        const [method, originalPath] = endpoint.path.split(' ');
        const methodLower = method.toLowerCase();

        // Find the original path in the spec (try with and without /api prefix and /api/{service} prefix)
        let fullOriginalPath = null;
        Object.keys(spec.paths).forEach(specPath => {
          // Remove all variations of /api prefix
          const normalizedSpecPath = specPath.replace(/^\/api(\/[^\/]+)?/, '');
          const normalizedOriginal = originalPath.replace(/^\/api(\/[^\/]+)?/, '');

          if (normalizedSpecPath === normalizedOriginal || specPath === originalPath) {
            fullOriginalPath = specPath;
          }
        });

        // Apply path override if specified
        if (endpoint.pathOverride && fullOriginalPath && fullOriginalPath !== endpoint.pathOverride) {
          // Copy the path definition to the new path
          spec.paths[endpoint.pathOverride] = spec.paths[fullOriginalPath];
          // Delete the old path
          delete spec.paths[fullOriginalPath];
          console.log(`  ↪️  Overriding path: ${fullOriginalPath} → ${endpoint.pathOverride}`);
          fullOriginalPath = endpoint.pathOverride;
        }

        // Apply custom summary and description, using the path as default sidebar label
        if (fullOriginalPath && spec.paths[fullOriginalPath] && spec.paths[fullOriginalPath][methodLower]) {
          const operation = spec.paths[fullOriginalPath][methodLower];

          // Use the endpoint path (e.g., "GET /health") as the summary for sidebar display
          operation.summary = endpoint.path;
          console.log(`  🏷️  Set sidebar label to "${endpoint.path}" for ${method} ${fullOriginalPath}`);

          if (endpoint.description && !operation.description) {
            operation.description = endpoint.description;
            console.log(`  📝 Added description for ${method} ${fullOriginalPath}`);
          }
        }
      });
    }

    // Write the updated spec back
    const updatedYaml = yaml.dump(spec, { lineWidth: -1 });
    fs.writeFileSync(specPath, updatedYaml, 'utf8');

    console.log(`✅ Updated ${apiKey}: ${apiConfig.baseUrl}`);
  } catch (error) {
    console.error(`❌ Error updating ${apiKey}:`, error.message);
  }
});

console.log('\n✨ API configuration sync complete!');
console.log('Run "npm run gen-api-docs" to regenerate the documentation.');
