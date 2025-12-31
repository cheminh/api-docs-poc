const fs = require('fs');
const path = require('path');

const apiName = process.argv[2] || 'distributionApi';

// Map API names to their doc directories
const apiDirMap = {
  distributionApi: 'distribution-api',
  policyApi: 'policy-api',
  quoteApi: 'quote-api',
  recommendationApi: 'recommendation-api',
  productApi: 'product-api'
};

const docDir = apiDirMap[apiName];
if (!docDir) {
  console.error(`❌ Unknown API: ${apiName}`);
  process.exit(1);
}

const sidebarPath = path.join(__dirname, '../docs', docDir, 'sidebar.ts');

if (!fs.existsSync(sidebarPath)) {
  console.log(`⚠️  Sidebar not found: ${sidebarPath}`);
  process.exit(0);
}

// Read the sidebar file
let content = fs.readFileSync(sidebarPath, 'utf8');

// Parse to find categories and flatten them
const lines = content.split('\n');
const newLines = [];
let inCategory = false;
let categoryItems = [];
let bracketCount = 0;
let skipUntilCloseBracket = false;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];

  // Detect category start
  if (line.includes('type: "category"') || line.includes("type: 'category'")) {
    inCategory = true;
    skipUntilCloseBracket = true;
    bracketCount = 0;
    continue;
  }

  // Track brackets to find category end
  if (skipUntilCloseBracket) {
    if (line.includes('{')) bracketCount++;
    if (line.includes('}')) bracketCount--;

    // Found the items array
    if (line.includes('items:')) {
      skipUntilCloseBracket = false;
      inCategory = true;
      continue;
    }
    continue;
  }

  // Inside items array, collect doc items
  if (inCategory) {
    if (line.includes('{') && !line.includes('items:')) bracketCount++;
    if (line.includes('}')) bracketCount--;

    // Check if we're at a doc item
    if (line.trim().startsWith('{') && lines[i + 1] && lines[i + 1].includes('type: "doc"')) {
      // Start collecting this doc item
      let docItem = [];
      let docBrackets = 1;
      docItem.push(line);

      for (let j = i + 1; j < lines.length; j++) {
        docItem.push(lines[j]);
        if (lines[j].includes('{')) docBrackets++;
        if (lines[j].includes('}')) docBrackets--;

        if (docBrackets === 0) {
          categoryItems.push(docItem.join('\n'));
          i = j;
          break;
        }
      }
      continue;
    }

    // End of category
    if (bracketCount < 0) {
      // Add collected items
      categoryItems.forEach(item => {
        newLines.push(item + ',');
      });
      categoryItems = [];
      inCategory = false;
      bracketCount = 0;
      continue;
    }
    continue;
  }

  // Keep non-category lines
  if (!skipUntilCloseBracket) {
    newLines.push(line);
  }
}

// Write back the flattened sidebar
fs.writeFileSync(sidebarPath, newLines.join('\n'), 'utf8');
console.log(`✅ Flattened sidebar for ${apiName}`);
