const fs = require('fs');

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('lazyWithRetry')) {
    console.log(`Already patched: ${filePath}`);
    return;
  }

  // Add import for lazyWithRetry
  content = content.replace(/import\s+React.*?;\n/g, match => {
    return match + `import { lazyWithRetry } from "../../utils/lazyWithRetry";\n`;
  });
  if (!content.includes('lazyWithRetry')) {
    content = `import { lazyWithRetry } from "../../utils/lazyWithRetry";\n` + content;
  }

  // Replace lazy( with lazyWithRetry(
  content = content.replace(/lazy\(\(\) =>/g, 'lazyWithRetry(() =>');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Patched: ${filePath}`);
}

processFile('src/components/HISShell/HISWorkspace.tsx');

function processFileRouter(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('lazyWithRetry')) return;

  if (!content.includes('lazyWithRetry')) {
    content = `import { lazyWithRetry } from "../utils/lazyWithRetry";\n` + content;
  }

  content = content.replace(/lazy\(\(\) =>/g, 'lazyWithRetry(() =>');
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Patched: ${filePath}`);
}
processFileRouter('src/components/DashboardRouter.tsx');

