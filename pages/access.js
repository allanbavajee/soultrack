import dynamic from "next/dynamic";

// ✅ Cette ligne désactive totalement le rendu serveur
const AccessPage = dynamic(() => import("../components/AccessPage"), {
  ssr: false,
});

export default AccessPage;

// ✅ Empêche Next.js de tenter de générer la page au build
export const getStaticProps = async () => {
  return {
    props: {}, // aucune donnée à pré-rendre
  };
};
