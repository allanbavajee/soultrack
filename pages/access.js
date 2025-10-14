"use client";

import dynamic from "next/dynamic";

// ✅ Empêche complètement Next.js de pré-rendre la page (CSR only)
const AccessPage = dynamic(() => import("../components/AccessPage"), {
  ssr: false,
});

export default AccessPage;
