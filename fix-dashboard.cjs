const fs = require('fs');
let content = fs.readFileSync('src/components/AdmissionCenterDashboard.tsx', 'utf8');
content = content.replace(
  /const \[activeTab, setActiveTab\] = useState<\'pending\' \| \'admitted\' \| \'discharges\' \| \'transfers\'>\(\'pending\'\);/,
  `console.log("Calling activeTab useState");\n  const [activeTab, setActiveTab] = useState<'pending' | 'admitted' | 'discharges' | 'transfers'>('pending');`
);
fs.writeFileSync('src/components/AdmissionCenterDashboard.tsx', content, 'utf8');
