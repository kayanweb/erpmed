const fs = require('fs');

const files = [
  "src/components/AmbulanceDashboard.tsx",
  "src/components/BirthDeathRecordDashboard.tsx",
  "src/components/BloodBankDashboard.tsx",
  "src/components/DownloadCenterDashboard.tsx",
  "src/components/FinanceIncomeExpenseDashboard.tsx",
  "src/components/FrontCMSDashboard.tsx",
  "src/components/FrontOfficeDashboard.tsx",
  "src/components/GlobalSettings.tsx",
  "src/components/ICUDashboard.tsx",
  "src/components/PathologyDashboard.tsx"
];

for (const file of files) {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    content = content.replace(
      /<button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">/g,
      `<button onClick={() => toast.info(isAr ? "ميزة إضافة السجلات قيد التطوير" : "Add record feature coming soon")} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors">`
    );
    
    if (!content.includes("toast.info")) {
      content = content.replace(
        /import \{ (.*) \} from 'lucide-react';/,
        `import { $1 } from 'lucide-react';\nimport { toast } from 'sonner';`
      );
    }
    
    fs.writeFileSync(file, content, 'utf8');
  }
}
