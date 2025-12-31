const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// Read the downloaded spec
const downloadedSpec = JSON.parse(fs.readFileSync(path.join(__dirname, '../openapi/temp/tripx-api-downloaded.json'), 'utf8'));

// Read the config to get enabled endpoints
const config = JSON.parse(fs.readFileSync(path.join(__dirname, '../api-visibility.config.json'), 'utf8'));
const distributionConfig = config.distributionApi;

// Filter only the enabled endpoints
const filteredPaths = {};
const enabledPaths = distributionConfig.endpoints
  .filter(e => e.enabled)
  .map(e => e.path);

// Map endpoint paths
const pathMapping = {
  'GET /health': '/api/health',
  'GET /agents': '/api/distribution/agents',
  'PATCH /activateProfile': '/api/distribution/activateProfile'
};

enabledPaths.forEach(endpoint => {
  const apiPath = pathMapping[endpoint];
  if (downloadedSpec.paths[apiPath]) {
    filteredPaths[apiPath] = downloadedSpec.paths[apiPath];
  }
});

// Create filtered spec
const filteredSpec = {
  openapi: downloadedSpec.openapi,
  info: downloadedSpec.info || {
    title: 'TripX Distribution API',
    version: '1.0',
    description: 'Travel Insurance Distribution API'
  },
  servers: [
    {
      url: distributionConfig.baseUrl,
      description: `${distributionConfig.environment.toUpperCase()} Environment`
    }
  ],
  paths: filteredPaths,
  components: downloadedSpec.components || {}
};

// Write to YAML
const yamlContent = yaml.dump(filteredSpec, { lineWidth: -1 });
fs.writeFileSync(path.join(__dirname, '../openapi/tripx-distribution-api.yaml'), yamlContent, 'utf8');

console.log('✅ Filtered and converted OpenAPI spec successfully');
console.log(`   Included ${Object.keys(filteredPaths).length} endpoints`);
