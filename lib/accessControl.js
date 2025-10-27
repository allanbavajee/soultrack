// lib/accessControl.js

export function canAccessPage(roles, pathname) {
  if (!roles || !pathname) return false;

  const path = pathname.toLowerCase().replace(/\/$/, "");
  const roleList = Array.isArray(roles) ? roles : [roles];

  const accessMap = {
    Admin: [
      "/index",
      "/admin",
      "/rapport",
      "/membres-hub",
      "/evangelisation-hub",
      "/cellules-hub",
      "/administrateur",
      "/suivis-membres",
      "/suivis-evangelisation",
    ],
    ResponsableIntegration: ["/index", "/membres-hub"],
    ResponsableEvangelisation: ["/index", "/evangelisation-hub"],
    ResponsableCellule: ["/cellules-hub"],
    Membre: ["/index"],
  };

  for (const role of roleList) {
    const allowed = accessMap[role];
    if (!allowed) continue;
    if (allowed.some(a => path.startsWith(a.toLowerCase()))) return true;
  }

  return false;
}

