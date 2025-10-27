// lib/accessControl.js

export function canAccessPage(roles, pathname) {
  if (!roles || !pathname) return false;

  // Normalise le chemin (minuscule, sans / final)
  const cleanPath = pathname.toLowerCase().replace(/\/$/, "");
  const roleList = Array.isArray(roles)
    ? roles.map(r => r.trim())
    : [roles.trim()];

  // Table des accès par rôle
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
    ResponsableCellule: ["/index", "/cellules-hub"],
    Membre: ["/index"],
  };

  // Vérifie les accès
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

