const fs = require('fs');

const files = [
  "src/components/FrontOfficeDashboard.tsx",
  "src/components/BirthDeathRecordDashboard.tsx",
  "src/components/FinanceIncomeExpenseDashboard.tsx",
  "src/components/DownloadCenterDashboard.tsx",
  "src/components/GlobalSettings.tsx",
  "src/components/ICUDashboard.tsx",
  "src/components/FrontCMSDashboard.tsx",
  "src/components/BloodBankDashboard.tsx",
  "src/components/AmbulanceDashboard.tsx",
  "src/components/PathologyDashboard.tsx"
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace the placeholder div
  const regex = /<div className="bg-white rounded-\[32px\] border border-slate-200 p-10 shadow-sm h-full flex flex-col items-center justify-center">[\s\S]*?<\/div>/g;
  
  if (content.match(regex)) {
    content = content.replace(regex, `<DynamicModuleRenderer \n                       language={language} \n                       moduleId={activeMainTab} \n                       moduleNameEn={mainTabs.find(t => t.id === activeMainTab)?.en || activeMainTab}\n                       moduleNameAr={mainTabs.find(t => t.id === activeMainTab)?.ar || activeMainTab}\n                    />`);
    
    // Add import statement
    if (!content.includes("DynamicModuleRenderer")) {
      content = content.replace(/import React.*?;\n/, match => match + `import DynamicModuleRenderer from "./DynamicModuleRenderer";\n`);
    } else {
        // Just make sure it is imported
        if (!content.includes('import DynamicModuleRenderer from "./DynamicModuleRenderer";')) {
            content = content.replace(/import React.*?;\n/, match => match + `import DynamicModuleRenderer from "./DynamicModuleRenderer";\n`);
        }
    }
    
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  } else {
    console.log(`Could not find regex match in ${file}`);
  }
}
