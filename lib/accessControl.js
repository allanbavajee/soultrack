// lib/accessControl.js
export function canAccessPage(roles, pathname) {
  if (!roles || !pathname) return false;

  const cleanPath = pathname.toLowerCase().replace(/\/$/, "");
  const roleList = Array.isArray(roles)
    ? roles.map(r => r.trim())
    : [roles.trim()];

  const accessMap = {
    Admin: ["/index", "/rapport", "/administrateur"], // restreint
    ResponsableIntegration: ["/index", "/membres-hub"],
    ResponsableEvangelisation: ["/index", "/evangelisation-hub"],
    ResponsableCellule: ["/cellules-hub"],
    Membre: ["/index"],
  };

  for (const role of roleList) {
    const allowedPaths = accessMap[role];
    if (!allowedPaths) continue;
    for (const allowed of allowedPaths) {
      if (cleanPath.startsWith(allowed.toLowerCase())) {
        return true;
      }
    }
  }

  return false;
}
