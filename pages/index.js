/* /pages/index.js */
import Link from "next/link";
import { Users, UserPlus, BarChart3 } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-indigo-50 flex flex-col items-center justify-center p-6">
      {/* Titre principal */}
      <h1 className="text-4xl font-extrabold text-indigo-700 mb-2 text-center">
        SoulTrack Dashboard
      </h1>
      <p className="text-gray-600 text-lg mb-8 text-center max-w-2xl">
        Bienvenue sur votre plateforme de suivi des membres de l’église.  
        « Nous aimons, parce qu’il nous a aimés le premier. » – 1 Jean 4:19
      </p>

      {/* Liens sous forme de cartes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {/* Ajouter un membre */}
        <Link
          href="/add-member"
          className="bg-white p-8 rounded-3xl shadow-lg flex flex-col items-center hover:shadow-2xl transition-all duration-200 border-t-4 border-green-400"
        >
          <UserPlus className="w-12 h-12 text-green-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Ajouter un membre</h2>
          <p className="text-gray-500 mt-2 text-center">
            Enregistrez rapidement un nouveau venu à l’église.
          </p>
        </Link>

        {/* Liste des membres */}
        <Link
          href="/new-members"
          className="bg-white p-8 rounded-3xl shadow-lg flex flex-col items-center hover:shadow-2xl transition-all duration-200 border-t-4 border-blue-400"
        >
          <Users className="w-12 h-12 text-blue-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Liste des membres</h2>
          <p className="text-gray-500 mt-2 text-center">
            Consultez et suivez tous les membres de l’église.
          </p>
        </Link>

        {/* Rapport */}
        <Link
          href="/rapport"
          className="bg-white p-8 rounded-3xl shadow-lg flex flex-col items-center hover:shadow-2xl transition-all duration-200 border-t-4 border-purple-400"
        >
          <BarChart3 className="w-12 h-12 text-purple-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-800">Rapport</h2>
          <p className="text-gray-500 mt-2 text-center">
            Visualisez l’impact et les statistiques des membres.
          </p>
        </Link>
      </div>

      {/* Message d’amour */}
      <div className="mt-10 bg-indigo-600 text-white p-6 rounded-3xl shadow-md max-w-2xl text-center">
        <p className="text-lg font-semibold">
          ❤️ Aimons-nous les uns les autres, comme Christ nous a aimés.
        </p>
      </div>
    </div>
  );
}
