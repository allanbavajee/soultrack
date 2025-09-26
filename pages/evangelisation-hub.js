// pages/evangelisation-hub.js
import Link from "next/link";

export default function EvangelisationHub() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      <h1 className="text-3xl font-bold text-center mb-10">Évangélisation</h1>

      {/* Deux boutons principaux */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {/* Bouton Ajouter un évangélisé */}
        <Link
          href="/add-evangelise"
          className="bg-yellow-400 p-6 rounded-3xl shadow-lg flex flex-col items-center hover:shadow-2xl transition-all duration-200"
        >
          <div className="text-6xl mb-4">✨</div>
          <h2 className="text-xl font-bold text-gray-800 text-center">Ajouter un évangélisé</h2>
        </Link>

        {/* Bouton Liste / Suivi des évangélisés */}
        <Link
          href="/evangelisation"
          className="bg-green-400 p-6 rounded-3xl shadow-lg flex flex-col items-center hover:shadow-2xl transition-all duration-200"
        >
          <div className="text-6xl mb-4">👥</div>
          <h2 className="text-xl font-bold text-gray-800 text-center">Suivi des évangélisés</h2>
        </Link>
      </div>

      {/* Message d'encouragement */}
      <div className="mt-12 p-6 rounded-3xl shadow-md max-w-2xl text-center text-gray-800">
        <p className="text-lg font-handwriting font-semibold">
          ❤️ Chaque âme compte. Suivons-les avec amour et diligence.
        </p>
      </div>
    </div>
  );
}
