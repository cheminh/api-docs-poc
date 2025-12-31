const fs = require('fs');
const path = require('path');
const glob = require('glob');

// Find all API MDX files
const apiDirs = [
  'docs/distribution-api',
  'docs/policy-api',
  'docs/quote-api',
  'docs/recommendation-api',
  'docs/product-api'
];

apiDirs.forEach(dir => {
  const files = glob.sync(path.join(__dirname, '..', dir, '*.api.mdx'));

  files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Remove the Request heading
    content = content.replace(
      /<Heading\s+id=\{"request"\}[\s\S]*?<\/Heading>/g,
      ''
    );

    // Remove ParamsDetails component
    content = content.replace(
      /<ParamsDetails[\s\S]*?<\/ParamsDetails>/g,
      ''
    );

    // Remove RequestSchema component
    content = content.replace(
      /<RequestSchema[\s\S]*?<\/RequestSchema>/g,
      ''
    );

    // Remove StatusCodes component (Response section)
    content = content.replace(
      /<StatusCodes[\s\S]*?<\/StatusCodes>/g,
      ''
    );

    // Remove the imports that are no longer needed
    content = content.replace(
      /import ParamsDetails from "@theme\/ParamsDetails";\n?/g,
      ''
    );
    content = content.replace(
      /import RequestSchema from "@theme\/RequestSchema";\n?/g,
      ''
    );
    content = content.replace(
      /import StatusCodes from "@theme\/StatusCodes";\n?/g,
      ''
    );

    // Clean up extra blank lines
    content = content.replace(/\n{3,}/g, '\n\n');

    fs.writeFileSync(file, content, 'utf8');
    console.log(`✅ Cleaned ${path.basename(file)}`);
  });
});

console.log('\n✨ Request and Response sections removed from all API docs!');
