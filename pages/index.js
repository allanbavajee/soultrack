/* /pages/index.js */
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start p-6">
      
      {/* Logos + slogan */}
      <div className="flex flex-col items-center mt-12 mb-8">
        <div className="flex space-x-6 mb-4">
          <Image src="/image/icc.logo.png" alt="Logo 1" width={90} height={90} />
          <Image src="/icc.logo.png" alt="Logo 2" width={90} height={90} />
        </div>
        <h2 className="text-2xl md:text-3xl font-handwriting text-center text-indigo-700">
          ✨ Tu es précieux, tu es attendu, tu es aimé ✨
        </h2>
      </div>

      {/* Titre principal */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-indigo-700 mb-4 text-center">
        SoulTrack Dashboard
      </h1>
      <p className="text-gray-600 text-base md:text-lg mb-8 text-center max-w-md px-4">
        Bienvenue sur votre plateforme de suivi des membres de l’église.  
        « Nous aimons, parce qu’il nous a aimés le premier. » – 1 Jean 4:19
      </p>

      {/* Liens sous forme de cartes mobile-friendly */}
      <div className="grid grid-cols-1 gap-6 w-full max-w-md">
        
        <Link
          href="/add-member"
          className="bg-gradient-to-br from-green-100 to-green-50 p-6 rounded-2xl shadow-md flex items-center space-x-4 hover:shadow-xl transition-all duration-300"
        >
          <div className="text-4xl">📝</div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Ajouter un membre</h2>
            <p className="text-gray-600 text-sm mt-1">
              Enregistre rapidement un nouveau venu.
            </p>
          </div>
        </Link>

        <Link
          href="/list-members"
          className="bg-gradient-to-br from-blue-100 to-blue-50 p-6 rounded-2xl shadow-md flex items-center space-x-4 hover:shadow-xl transition-all duration-300"
        >
          <div className="text-4xl">👥</div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Liste des membres</h2>
            <p className="text-gray-600 text-sm mt-1">
              Consulte tous les membres et leur suivi.
            </p>
          </div>
        </Link>

        <Link
          href="/rapport"
          className="bg-gradient-to-br from-purple-100 to-purple-50 p-6 rounded-2xl shadow-md flex items-center space-x-4 hover:shadow-xl transition-all duration-300"
        >
          <div className="text-4xl">📊</div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Rapport</h2>
            <p className="text-gray-600 text-sm mt-1">
              Visualise l’impact et les statistiques.
            </p>
          </div>
        </Link>

      </div>
    </div>
  );
}
