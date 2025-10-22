export function canAccessPage(roles, pathname) {
  if (!roles || !pathname) return false;

  const roleList = Array.isArray(roles)
    ? roles.map(r => r.trim())
    : [roles.trim()];

  const accessMap = {
    Admin: [
      "/index",
      "/admin",
      "/rapport",
      "/membres-hub",
      "/evangelisation-hub",
      "/cellules-hub",
      "/administrateur",
    ],
    ResponsableIntegration: ["/membres-hub"],
    ResponsableEvangelisation: ["/index", "/evangelisation-hub"],
    ResponsableCellule: ["/cellules-hub"],
    Membre: ["/index"],
  };

  for (const role of roleList) {
    const allowedPaths = accessMap[role];
    if (!allowedPaths) continue;
    for (const allowed of allowedPaths) {
      if (pathname.startsWith(allowed)) {
        return true;
      }
    }
  }

  return false;
}
