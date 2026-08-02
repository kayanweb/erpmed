const fs = require('fs');
const content = fs.readFileSync('/src/components/HospitalInformationSystem.tsx', 'utf8');

const startStr = 'messageAr: `📡 [توجيه المشرفين]';
const endStr = '{activeSubTab === "hisprofileworkspace"';

const startIndex = content.indexOf(startStr);
const endIndex = content.indexOf(endStr);

console.log('Start index:', startIndex);
console.log('End index:', endIndex);

if (startIndex !== -1 && endIndex !== -1) {
  const slice = content.slice(startIndex, endIndex + 100);
  console.log('--- SLICE ---');
  console.log(slice);
} else {
  console.log('Could not find start or end strings.');
}
