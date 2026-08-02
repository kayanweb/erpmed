const fs = require('fs');
let content = `import React, { useState } from 'react';
export default function AdmissionCenterDashboard({ language }: { language: 'ar' | 'en' }) {
  const [test, setTest] = useState(false);
  return <div>Test</div>;
}`;
fs.writeFileSync('src/components/AdmissionCenterDashboard.tsx', content, 'utf8');
