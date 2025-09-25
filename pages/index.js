/* /pages/index.js */
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start p-6">
      
      {/* Header avec 2 logos */}
      <div className="flex flex-col md:flex-row items-center justify-center mt-8 gap-6">
        <Image src="/image/icc.logo.png" alt="Logo 1" width={100} height={100} />
        <Image src="/image/second.logo.png" alt="Logo 2" width={100} height={100} />
      </div>

      {/* Slogan */}
      <h2 className="text-2xl md:text-3xl font-handwriting text-indigo-700 text-center mt-4">
        ✨ Tu es précieux, tu es attendu, tu es aimé ✨
      </h2>

      {/* Introduction */}
      <p className="text-gray-600 text-center mt-6 mb-8 max-w-md">
        Bienvenue sur ta plateforme de suivi des membres de l’église.
        « Nous aimons, parce qu’il nous a aimés le premier. » – 1 Jean 4:19
      </p>

      {/* Cartes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        {/* Ajouter un membre */}
        <Link
          href="/add-member"
          className="bg-gradient-to-br from-green-200 to-green-400 p-6 rounded-3xl shadow-lg flex flex-col items-center hover:shadow-2xl transition-all duration-200"
        >
          <div className="text-5xl mb-4">📝</div>
          <h2 className="text-xl font-bold text-gray-800">Ajouter un membre</h2>
          <p className="text-gray-700 mt-2 text-center text-sm">
            Enregistre rapidement un nouveau venu à l’église.
          </p>
        </Link>

        {/* Liste des membres */}
        <Link
          href="/list-members"
          className="bg-gradient-to-br from-blue-200 to-blue-400 p-6 rounded-3xl shadow-lg flex flex-col items-center hover:shadow-2xl transition-all duration-200"
        >
          <div className="text-5xl mb-4">👥</div>
          <h2 className="text-xl font-bold text-gray-800">Liste des membres</h2>
          <p className="text-gray-700 mt-2 text-center text-sm">
            Consulte et suis tous les membres de l’église.
          </p>
        </Link>

        {/* Rapport */}
        <Link
          href="/rapport"
          className="bg-gradient-to-br from-purple-200 to-purple-400 p-6 rounded-3xl shadow-lg flex flex-col items-center hover:shadow-2xl transition-all duration-200"
        >
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-xl font-bold text-gray-800">Rapport</h2>
          <p className="text-gray-700 mt-2 text-center text-sm">
            Visualise l’impact et les statistiques des membres.
          </p>
        </Link>
      </div>

      {/* Message d’amour */}
      <div className="mt-10 bg-indigo-100 text-indigo-800 p-6 rounded-3xl shadow-md max-w-md text-center">
        <p className="text-lg font-semibold">
          ❤️ Aimons-nous les uns les autres, comme Christ nous a aimés.
        </p>
      </div>
    </div>
  );
}
