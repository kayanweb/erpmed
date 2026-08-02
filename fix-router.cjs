const fs = require('fs');

const file = 'src/components/DashboardRouter.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/import\(\"\.\/ReportCenter\"\)/g, 'import("./EnterprisePrintCenter")');
content = content.replace(/const ReportCenter =/g, 'const EnterprisePrintCenter =');
content = content.replace(/<ReportCenter/g, '<EnterprisePrintCenter');

fs.writeFileSync(file, content, 'utf8');
console.log("Patched Router");
