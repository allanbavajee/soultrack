import dynamic from "next/dynamic";

// On importe le composant AccessPage sans le rendre côté serveur
const AccessPage = dynamic(() => import("../components/AccessPage"), {
  ssr: false,
});

export default function Access() {
  return <AccessPage />;
}
