const fs = require('fs');
const path = require('path');

const jsdocMermaidPath = path.join(__dirname, 'node_modules', 'jsdoc-mermaid', 'index.js');

fs.readFile(jsdocMermaidPath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading jsdoc-mermaid file:', err);
    process.exit(1);
  }

  const result = data.replace('https://unpkg.com/mermaid@7.1.0/dist/mermaid.min.js', 'https://unpkg.com/mermaid@10.9.0/dist/mermaid.min.js');

  fs.writeFile(jsdocMermaidPath, result, 'utf8', (err) => {
    if (err) {
      console.error('Error writing jsdoc-mermaid file:', err);
      process.exit(1);
    }

    console.log('jsdoc-mermaid has been patched successfully.');
  });
});
