// /pages/index.js
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-white flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">
            🙏 SoulTrack Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Bienvenue sur votre plateforme de suivi des membres de l’église.
          </p>
        </div>

        {/* Cards navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Ajouter un membre */}
          <Link href="/add-member" className="block">
            <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100">
              <div className="text-3xl mb-4">➕</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Ajouter un membre
              </h2>
              <p className="text-gray-500 text-sm">
                Enregistrez rapidement un nouveau venu avec ses informations.
              </p>
            </div>
          </Link>

          {/* Liste des membres */}
          <Link href="/members" className="block">
            <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100">
              <div className="text-3xl mb-4">📋</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Liste des membres
              </h2>
              <p className="text-gray-500 text-sm">
                Consultez et gérez les membres enregistrés dans l’église.
              </p>
            </div>
          </Link>

          {/* Rapport */}
          <Link href="/rapport" className="block">
            <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition-all border border-gray-100">
              <div className="text-3xl mb-4">📊</div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Rapport
              </h2>
              <p className="text-gray-500 text-sm">
                Analysez les données et suivez la croissance des membres.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
