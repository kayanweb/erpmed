const fs = require('fs');

function processFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('ErrorBoundary')) {
    console.log(`Already patched: ${filePath}`);
    return;
  }

  content = `import { ErrorBoundary } from "${filePath.includes('HISShell') ? '../../' : './components/'}ErrorBoundary";\n` + content;
  
  content = content.replace(/<Suspense fallback=\{[^}]+\}>/g, match => `<ErrorBoundary>\n          ${match}`);
  content = content.replace(/<\/Suspense>/g, match => `${match}\n        </ErrorBoundary>`);
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Patched: ${filePath}`);
}

processFile('src/App.tsx');
processFile('src/components/HISShell/HISWorkspace.tsx');

