import dynamic from "next/dynamic";

// ✅ Import uniquement côté client, jamais côté serveur
const AccessPage = dynamic(() => import("../components/AccessPage"), {
  ssr: false,
});

// ✅ Export par défaut
export default AccessPage;

// ✅ Empêche Next.js de pré-rendre la page pendant le build
export const getStaticProps = async () => ({
  props: {}, // aucune donnée à précharger
});
