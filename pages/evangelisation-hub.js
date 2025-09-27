/* pages/evangelisation-hub.js */
import Link from "next/link";
import { useRouter } from "next/router";

export default function EvangelisationHub() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 relative">
      {/* Flèche retour en haut à droite */}
      <button
        onClick={() => router.back()}
        className="absolute top-6 right-6 text-orange-500 font-semibold hover:text-orange-600 transition-colors"
      >
        ← Retour
      </button>

      {/* Titre */}
      <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">
        Évangélisation
      </h1>

      {/* Boutons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl justify-items-center">
        {/* Ajouter un évangélisé */}
        <Link
          href="/add-evangelise"
          className="bg-white p-6 w-64 h-52 rounded-3xl shadow-lg flex flex-col items-center justify-center hover:shadow-2xl transition-all duration-200 border-t-4 border-[#4285F4]"
        >
          <div className="text-5xl mb-4">➕</div>
          <h2 className="text-xl font-bold text-gray-800 text-center">
            Ajouter un évangélisé
          </h2>
        </Link>

        {/* Liste des évangélisés */}
        <Link
          href="/evangelisation"
          className="bg-white p-6 w-64 h-52 rounded-3xl shadow-lg flex flex-col items-center justify-center hover:shadow-2xl transition-all duration-200 border-t-4 border-[#34a853]"
        >
          <div className="text-5xl mb-4">👥</div>
          <h2 className="text-xl font-bold text-gray-800 text-center">
            Liste des évangélisés
          </h2>
        </Link>

        {/* Tableau de suivi cellule */}
        <Link
          href="/cellule-dashboard"
          className="bg-white p-6 w-64 h-52 rounded-3xl shadow-lg flex flex-col items-center justify-center hover:shadow-2xl transition-all duration-200 border-t-4 border-[#f06292]"
        >
          <div className="text-5xl mb-4">📋</div>
          <h2 className="text-xl font-bold text-gray-800 text-center">
            Suivi cellule
          </h2>
        </Link>
      </div>
    </div>
  );
}
