const fs = require('fs');

const file = 'src/components/HISShell/HISWorkspace.tsx';
if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('ITAdministrationEnterprise')) {
    content = content.replace(
      /const Vision2026Engine = lazyWithRetry\(\(\) => import\("\.\.\/Vision2026Engine"\)\);/g,
      'const Vision2026Engine = lazyWithRetry(() => import("../Vision2026Engine"));\nconst ITAdministrationEnterprise = lazyWithRetry(() => import("../ITAdministrationEnterprise"));'
    );
    
    content = content.replace(
      /default:/,
      `case "it_admin":\n        return <ITAdministrationEnterprise language={language} />;\n      default:`
    );
    
    fs.writeFileSync(file, content, 'utf8');
    console.log("Patched Workspace for IT Admin");
  }
}
