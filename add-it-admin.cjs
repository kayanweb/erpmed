const fs = require('fs');

const file = 'src/components/DashboardRouter.tsx';
if (fs.existsSync(file)) {
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes('ITAdministrationEnterprise')) {
    content = content.replace(
      /const HISImplementationDashboard = lazyWithRetry\(\(\) => import\("\.\/HISImplementationDashboard"\)\);/g,
      'const HISImplementationDashboard = lazyWithRetry(() => import("./HISImplementationDashboard"));\nconst ITAdministrationEnterprise = lazyWithRetry(() => import("./ITAdministrationEnterprise"));'
    );
    
    content = content.replace(
      /default:/,
      `case "it_admin":\n          return <ITAdministrationEnterprise language={language} />;\n        default:`
    );
    
    fs.writeFileSync(file, content, 'utf8');
    console.log("Patched Router for IT Admin");
  }
}
