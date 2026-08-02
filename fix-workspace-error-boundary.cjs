const fs = require('fs');
const file = 'src/components/HISShell/HISWorkspace.tsx';
let content = fs.readFileSync(file, 'utf8');

// The script left `</ErrorBoundary>` dangling. Let's remove it and wrap properly.
content = content.replace(/<\/ErrorBoundary>/g, '');
content = content.replace(/<ErrorBoundary>\s*/g, '');

content = content.replace(/<Suspense /g, '<ErrorBoundary>\n      <Suspense ');
content = content.replace(/<\/Suspense>/g, '</Suspense>\n      </ErrorBoundary>');

fs.writeFileSync(file, content, 'utf8');
console.log("Fixed Workspace ErrorBoundary.");
