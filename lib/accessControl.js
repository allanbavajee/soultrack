// lib/accessControl.js

export function canAccessPage(roles, pathname) {
  if (!roles || !pathname) return false;

  const path = pathname.toLowerCase().replace(/\/$/, "");
  const roleList = Array.isArray(roles) ? roles : [roles];

  // 🔹 normalisation des rôles : supprime espaces et met en camelCase standard
  const normalizedRoles = roleList.map(r => r.trim());

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

  for (const role of normalizedRoles) {
    const allowed = accessMap[role];
    if (!allowed) continue;
    if (allowed.some(a => path.startsWith(a.toLowerCase()))) return true;
  }

  return false;
}
