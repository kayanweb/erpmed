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
    
    // Add toast import if missing
    if (!content.includes('import { toast } from "sonner";') && !content.includes("import { toast } from 'sonner';")) {
       content = `import { toast } from "sonner";\n` + content;
    }
    
    // Add FilterX to lucide-react imports if missing
    if (!content.includes('FilterX')) {
      content = content.replace(/import \{([\s\S]*?)\} from ["']lucide-react["'];/, (match, group1) => {
        return `import { FilterX, ${group1} } from "lucide-react";`;
      });
    }

    fs.writeFileSync(file, content, 'utf8');
  }
}
