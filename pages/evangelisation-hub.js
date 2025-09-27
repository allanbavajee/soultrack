/* pages/evangelisation-hub.js */
import Link from "next/link";

export default function EvangelisationHub() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      {/* Titre */}
      <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">
        Évangélisation
      </h1>

      {/* Boutons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl justify-items-center">
        {/* Ajouter un évangélisé */}
        <Link
          href="/add-evangelise"
          className="bg-white p-6 rounded-3xl shadow-lg flex flex-col items-center hover:shadow-2xl transition-all duration-200 border-t-4 border-[#4285F4]"
        >
          <div className="text-5xl mb-4">➕</div>
          <h2 className="text-xl font-bold text-gray-800 text-center">
            Ajouter un évangélisé
          </h2>
        </Link>

        {/* Liste des évangélisés */}
        <Link
          href="/evangelisation"
          className="bg-white p-6 rounded-3xl shadow-lg flex flex-col items-center hover:shadow-2xl transition-all duration-200 border-t-4 border-[#34a853]"
        >
          <div className="text-5xl mb-4">👥</div>
          <h2 className="text-xl font-bold text-gray-800 text-center">
            Liste des évangélisés
          </h2>
        </Link>
      </div>
    </div>
  );
}
