// lib/accessControl.js

export function canAccessPage(roles, pathname) {
  if (!roles || !pathname) return false;

  const cleanPath = pathname.toLowerCase().replace(/\/$/, "");
  const roleList = Array.isArray(roles) ? roles : [roles];

  const accessMap = {
    Admin: [
      "/index",
      "/admin",
      "/rapport",
      "/membres-hub",
      "/evangelisation-hub",
      "/cellules-hub",
    ],
    ResponsableIntegration: ["/index", "/membres-hub"],
    ResponsableEvangelisation: ["/index", "/evangelisation-hub"],
    ResponsableCellule: ["/index", "/cellules-hub"],
    Membre: ["/index"],
  };

  for (const role of roleList) {
    const allowedPaths = accessMap[role];
    if (!allowedPaths) continue;
    for (const allowed of allowedPaths) {
      if (cleanPath.startsWith(allowed)) return true;
    }
  }

  return false;
}

