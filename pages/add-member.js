// pages/add-member.js
import dynamic from "next/dynamic";

// ✅ Empêche tout rendu serveur, build, ou SSG
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

// ✅ Désactive la génération statique
export const getStaticProps = async () => {
  return { props: {} };
};

// ✅ Désactive le rendu côté serveur
export const getServerSideProps = async () => {
  return { props: {} };
};

// ✅ Charge le composant client UNIQUEMENT dans le navigateur
const AddMemberClient = dynamic(() => import("../components/AddMemberClient"), {
  ssr: false,
});

export default function AddMemberPage() {
  return <AddMemberClient />;
}
