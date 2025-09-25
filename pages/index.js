/* /pages/index.js */
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start p-4 sm:p-6">
      {/* Header coloré avec logos + slogan */}
      <div className="w-full bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-500 text-white py-8 rounded-b-3xl shadow-lg flex flex-col items-center">
        <div className="flex space-x-4 sm:space-x-6 mb-4">
          <Image src="/logo1.png" alt="Logo 1" width={70} height={70} />
          <Image src="/logo2.png" alt="Logo 2" width={70} height={70} />
        </div>
        <h2 className="text-lg sm:text-2xl font-extrabold text-center px-4">
          ✨ Tu es précieux, tu es attendu, tu es aimé ✨
        </h2>
      </div>

      {/* Titre principal */}
      <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-700 mt-6 text-center">
        SoulTrack Dashboard
      </h1>
      <p className="text-gray-600 text-base sm:text-lg mt-2 mb-6 text-center max-w-xl px-2">
        Bienvenue sur votre plateforme de suivi des membres de l’église.  
        « Nous aimons, parce qu’il nous a aimés le premier. » – 1 Jean 4:19
      </p>

      {/* Liens sous forme de cartes responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg">
        <Link
          href="/add-member"
          className="bg-gradient-to-br from-green-100 to-green-50 p-6 rounded-2xl shadow-md flex flex-col items-center hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          <div className="text-5xl mb-2">➕</div>
          <h2 className="text-xl font-bold text-gray-800 text-center">Ajouter un membre</h2>
          <p className="text-gray-600 mt-1 text-center text-sm">
            Enregistrez rapidement un nouveau venu à l’église.
          </p>
        </Link>

        <Link
          href="/list-members"
          className="bg-gradient-to-br from-blue-100 to-blue-50 p-6 rounded-2xl shadow-md flex flex-col items-center hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          <div className="text-5xl mb-2">👥</div>
          <h2 className="text-xl font-bold text-gray-800 text-center">Liste des membres</h2>
          <p className="text-gray-600 mt-1 text-center text-sm">
            Consultez et suivez tous les membres de l’église.
          </p>
        </Link>

        <Link
          href="/rapport"
          className="bg-gradient-to-br from-purple-100 to-purple-50 p-6 rounded-2xl shadow-md flex flex-col items-center hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          <div className="text-5xl mb-2">📊</div>
          <h2 className="text-xl font-bold text-gray-800 text-center">Rapport</h2>
          <p className="text-gray-600 mt-1 text-center text-sm">
            Visualisez l’impact et les statistiques des membres.
          </p>
        </Link>
      </div>

      {/* Message d'amour en bas */}
      <div className="mt-8 bg-indigo-600 text-white p-4 sm:p-6 rounded-2xl shadow-md max-w-md text-center">
        <p className="text-sm sm:text-lg font-semibold">
          ❤️ Aimons-nous les uns les autres, comme Christ nous a aimés.
        </p>
      </div>
    </div>
  );
}
