const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

content = content.replace(
`  useEffect(() => {
    if (!systemUsersLoaded) return;
    if (systemUsers.length > 0) {
      if (currentUser?.id) {
        const found = systemUsers.find((u) => u.id === currentUser.id);
        if (found) {
          setCurrentUser(found);
        }
      }
    } else {
      // Bootstrap/seed database staff profile details on first startup
      MOCK_USERS.forEach((u: AppUser) => {
        saveStaffMember(u).catch((err) => console.error(err));
      });
    }
  }, [systemUsers, systemUsersLoaded]);`,
`  const hasSeededUsers = useRef(false);
  useEffect(() => {
    if (!systemUsersLoaded) return;
    if (systemUsers.length > 0) {
      if (currentUser?.id) {
        const found = systemUsers.find((u) => u.id === currentUser.id);
        if (found) {
          setCurrentUser(found);
        }
      }
    } else if (!hasSeededUsers.current) {
      hasSeededUsers.current = true;
      // Bootstrap/seed database staff profile details on first startup
      MOCK_USERS.forEach((u: AppUser) => {
        saveStaffMember(u).catch((err) => console.error(err));
      });
    }
  }, [systemUsers, systemUsersLoaded]);`
);
fs.writeFileSync('src/App.tsx', content);
