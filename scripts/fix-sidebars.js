const fs = require('fs');
const path = require('path');

// API directories to process
const apiDirs = [
  { dir: 'docs/distribution-api', name: 'Distribution API', infoFile: 'distribution-api.info.mdx' },
  { dir: 'docs/policy-api', name: 'Policy API', infoFile: 'tripx-policy-api.info.mdx' },
  { dir: 'docs/quote-api', name: 'Quote API', infoFile: 'tripx-quote-api.info.mdx' },
  { dir: 'docs/recommendation-api', name: 'Recommendation API', infoFile: 'tripx-recommendation-api.info.mdx' },
  { dir: 'docs/product-api', name: 'Product API', infoFile: 'tripx-product-api.info.mdx' }
];

apiDirs.forEach(api => {
  // Fix info.mdx file - change "Introduction" to API name
  const infoPath = path.join(__dirname, '..', api.dir, api.infoFile);
  if (fs.existsSync(infoPath)) {
    let infoContent = fs.readFileSync(infoPath, 'utf8');
    infoContent = infoContent.replace(/sidebar_label:\s*Introduction/g, `sidebar_label: ${api.name}`);
    fs.writeFileSync(infoPath, infoContent, 'utf8');
    console.log(`  ✏️  Updated ${api.name} info: "Introduction" → "${api.name}"`);
  }

  // Fix sidebar.ts file - remove category groupings
  const sidebarPath = path.join(__dirname, '..', api.dir, 'sidebar.ts');
  if (fs.existsSync(sidebarPath)) {
    let sidebarContent = fs.readFileSync(sidebarPath, 'utf8');
    
    // Check if there's a category structure
    if (sidebarContent.includes('type: "category"')) {
      // Extract the items array from the category
      const categoryMatch = sidebarContent.match(/type: "category",[\s\S]*?items: \[([\s\S]*?)\],\s*\},/);
      
      if (categoryMatch) {
        const items = categoryMatch[1].trim();
        
        // Replace the category structure with flattened items
        sidebarContent = sidebarContent.replace(
          /\{\s*type: "category",[\s\S]*?items: \[[\s\S]*?\],\s*\},/,
          items
        );
        
        fs.writeFileSync(sidebarPath, sidebarContent, 'utf8');
        console.log(`  📋 Flattened ${api.name} sidebar`);
      }
    }
  }
});

console.log('\n✨ Sidebar customizations applied!');
