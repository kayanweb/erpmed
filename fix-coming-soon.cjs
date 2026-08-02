const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components');
const files = fs.readdirSync(componentsDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(componentsDir, file);
  let content = fs.readFileSync(filePath, 'utf8');

  if (content.includes("Add record feature coming soon")) {
    console.log(`Fixing ${file}...`);
    
    // 1. Add import if not present
    if (!content.includes('GenericAddRecordModal')) {
      content = content.replace(
        /(import React.*?)\n/,
        `$1\nimport { GenericAddRecordModal } from "./GenericAddRecordModal";\n`
      );
    }
    
    // 2. Add state
    if (!content.includes('isAddModalOpen')) {
      content = content.replace(
        /const isAr = language === "ar";\n/,
        `const isAr = language === "ar";\n  const [isAddModalOpen, setIsAddModalOpen] = useState(false);\n`
      );
    }
    
    // 3. Replace toast
    content = content.replace(
      /toast\.info\(isAr \? "ميزة إضافة السجلات قيد التطوير" : "Add record feature coming soon"\)/g,
      `setIsAddModalOpen(true)`
    );
    
    // 4. Append modal
    if (!content.includes('<GenericAddRecordModal')) {
      // Find the last closing div. A bit tricky, let's just insert before the last </something>
      content = content.replace(
        /(\s*)(\<\/[a-zA-Z0-9_]+\>\s*)$/,
        `$1  {isAddModalOpen && <GenericAddRecordModal language={language} moduleName="${file.replace('.tsx', '')}" onClose={() => setIsAddModalOpen(false)} onSave={() => {}} />}\n$1$2`
      );
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
  }
}
