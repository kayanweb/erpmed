const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// rolesList
content = content.replace(
`  useEffect(() => {
    if (rolesList.length === 0) {`,
`  const hasSeededRoles = useRef(false);
  useEffect(() => {
    if (rolesList.length === 0 && !hasSeededRoles.current) {
      hasSeededRoles.current = true;`
);

// permissionsList
content = content.replace(
`  useEffect(() => {
    if (permissionsList.length === 0) {`,
`  const hasSeededPermissions = useRef(false);
  useEffect(() => {
    if (permissionsList.length === 0 && !hasSeededPermissions.current) {
      hasSeededPermissions.current = true;`
);

// rosterList
content = content.replace(
`  useEffect(() => {
    if (!rosterListLoaded) return;
    if (rosterList.length === 0) {`,
`  const hasSeededRosters = useRef(false);
  useEffect(() => {
    if (!rosterListLoaded) return;
    if (rosterList.length === 0 && !hasSeededRosters.current) {
      hasSeededRosters.current = true;`
);

// rosterWishes
content = content.replace(
`  useEffect(() => {
    if (!rosterWishesLoaded) return;
    if (rosterWishes.length === 0) {`,
`  const hasSeededWishes = useRef(false);
  useEffect(() => {
    if (!rosterWishesLoaded) return;
    if (rosterWishes.length === 0 && !hasSeededWishes.current) {
      hasSeededWishes.current = true;`
);

fs.writeFileSync('src/App.tsx', content);
