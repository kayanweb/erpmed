const fs = require('fs');

const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/import ReportCenter from "\.\/components\/ReportCenter";\n/g, 'import EnterprisePrintCenter from "./components/EnterprisePrintCenter";\n');
content = content.replace(/<ReportCenter/g, '<EnterprisePrintCenter');

fs.writeFileSync(file, content, 'utf8');
console.log("Patched App");
