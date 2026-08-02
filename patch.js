const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');
content = content.replace(
`  // Seeding default AccessMatrix mappings if empty
  useEffect(() => {
    if (
      accessMatrix.length === 0 &&
      rolesList.length > 0 &&
      permissionsList.length > 0
    ) {`,
`  const hasSeededAccessMatrix = useRef(false);
  // Seeding default AccessMatrix mappings if empty
  useEffect(() => {
    if (
      accessMatrix.length === 0 &&
      rolesList.length > 0 &&
      permissionsList.length > 0 &&
      !hasSeededAccessMatrix.current
    ) {
      hasSeededAccessMatrix.current = true;`
);
fs.writeFileSync('src/App.tsx', content);
