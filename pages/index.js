/* /pages/index.js */
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start p-6">

      {/* Header avec 2 logos */}
      <div className="flex flex-col md:flex-row items-center justify-center mt-8 gap-6">
        <Image src="/images/icc.logo.jpg" alt="Logo 1" width={100} height={100} />
        <Image src="/images/second.logo.png" alt="Logo 2" width={100} height={100} />
      </div>

      {/* Slogan */}
      <h2 className="text-2xl md:text-3xl mt-4 text-center font-handwriting text-indigo-700">
        ✨ Tu es précieux, tu es attendu, tu es aimé ✨
      </h2>

      {/* Introduction */}
      <p className="text-gray-600 text-center mt-6 mb-8 max-w-md">
        Bienvenue sur ta plateforme de suivi des membres de l’église.
        « Nous aimons, parce qu’il nous a aimés le premier. » – 1 Jean 4:19
      </p>

      {/* Cartes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">

        {/* Ajouter un membre */}
        <Link
          href="/add-member"
          className="bg-gradient-to-br from-yellow-300 via-yellow-200 to-yellow-400 p-6 rounded-3xl shadow-2xl flex flex-col items-center hover:scale-105 transition-transform duration-300"
        >
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-xl font-bold text-gray-800 text-center">Ajouter un membre</h2>
          <p className="text-gray-700 mt-2 text-center text-sm">
            Enregistre rapidement un nouveau venu à l’église.
          </p>
        </Link>

        {/* Liste des membres */}
        <Link
          href="/list-members"
          className="bg-gradient-to-br from-blue-300 via-blue-200 to-blue-400 p-6 rounded-3xl shadow-2xl flex flex-col items-center hover:scale-105 transition-transform duration-300"
        >
          <div className="text-6xl mb-4">👥</div>
          <h2 className="text-xl font-bold text-gray-800 text-center">Liste des membres</h2>
          <p className="text-gray-700 mt-2 text-center text-sm">
            Consulte et suis tous les membres de l’église.
          </p>
        </Link>

        {/* Rapport */}
        <Link
          href="/rapport"
          className="bg-gradient-to-br from-pink-300 via-pink-200 to-pink-400 p-6 rounded-3xl shadow-2xl flex flex-col items-center hover:scale-105 transition-transform duration-300"
        >
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-xl font-bold text-gray-800 text-center">Rapport</h2>
          <p className="text-gray-700 mt-2 text-center text-sm">
            Visualise l’impact et les statistiques des membres.
          </p>
        </Link>

      </div>

      {/* Message d’amour */}
      <div className="mt-10 p-6 max-w-md text-center">
        <p className="text-lg font-semibold text-indigo-700">
          ❤️ Aimons-nous les uns les autres, comme Christ nous a aimés.
        </p>
      </div>

    </div>
  );
}
