/* pages/membres-suivis.js */
import Link from "next/link";
import { useRouter } from "next/router";

export default function MembresSuivis() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-6">
      {/* Flèche retour */}
      <div className="w-full max-w-4xl">
        <button
          onClick={() => router.back()}
          className="flex items-center text-orange-500 font-semibold mb-6 hover:text-orange-600 transition-colors"
        >
          ← Retour
        </button>
      </div>

      {/* Titre */}
      <h1 className="text-3xl font-bold text-gray-800 mb-10 text-center">
        Suivis des Nouveaux
      </h1>

      {/* Boutons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Ajouter un membre */}
        <Link
          href="/add-member"
          className="bg-white p-6 w-64 h-52 rounded-3xl shadow-lg flex flex-col items-center justify-center hover:shadow-2xl transition-all duration-200 border-t-4 border-[#4285F4]"
        >
          <div className="text-5xl mb-4">➕</div>
          <h2 className="text-xl font-bold text-gray-800 text-center">
            Ajouter un membre
          </h2>            
        </Link>        

        {/* Liste des membres */}
        <Link
          href="/list-members"
          className="bg-white p-6 w-64 h-52 rounded-3xl shadow-lg flex flex-col items-center justify-center hover:shadow-2xl transition-all duration-200 border-t-4 border-[#34a853]"
        >
          <div className="text-5xl mb-4">👥</div>
          <h2 className="text-xl font-bold text-gray-800 text-center">
            Liste des membres
          </h2>
        </Link>
        {/* Page suivis de nouveau */}
        <Link
          href="/suivis-membres"
          className="bg-white p-6 rounded-3xl shadow-lg flex flex-col items-center hover:shadow-2xl transition-all duration-200 border-t-4 border-[#9c27b0]"
        >
          <div className="text-5xl mb-4">👤</div>
          <h2 className="text-xl font-bold text-gray-800 text-center">Membres & Suivis</h2>
        </Link>
      </div>
    </div>
  );
}
