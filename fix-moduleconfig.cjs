const fs = require('fs');
let content = fs.readFileSync('src/components/HISShell/moduleConfig.ts', 'utf8');

if (!content.includes('id: "meals"')) {
  content = content.replace(
    /\{ id: "transport", labelAr: "نقل المرضى", labelEn: "Patient Transport" \}/,
    `{ id: "transport", labelAr: "نقل المرضى", labelEn: "Patient Transport" },\n      { id: "meals", labelAr: "شيت وجبات المرضى والموظفين", labelEn: "Meals Delivery Log" }`
  );
  fs.writeFileSync('src/components/HISShell/moduleConfig.ts', content, 'utf8');
}
