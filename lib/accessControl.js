//lib/accessControl.js

export function canAccessPage(roles, pathname) {
  if (!roles || !pathname) return false;

  const cleanPath = pathname.toLowerCase().replace(/\/$/, ""); // 🔹 normalise le chemin
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
      "/suivis-membres",
      "/suivis-evangelisation"
    ],
    ResponsableIntegration: ["/index", "/membres-hub"],
    ResponsableEvangelisation: ["/index", "/evangelisation-hub"],
    ResponsableCellule: [
      "/index",
      "/cellules-hub",
      "/suivis-membres",
      "/suivis-evangelisation"
    ],
    Membre: ["/index"]
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
