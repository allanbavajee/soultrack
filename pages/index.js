/* /pages/index.js */
import Image from "next/image";
import Link from "next/link";
import '../styles/globals.css';

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">

      {/* Logos */}
      <div className="flex gap-6 items-center mb-4">
        <Image src="/image/icc.logo.jpg" alt="ICC" width={90} height={90} />
        <Image src="/image/soul.logo.png" alt="SoulTrack" width={90} height={90} />
      </div>

      {/* Slogan */}
      <h2 className="text-2xl md:text-3xl font-handwriting text-center text-gray-800 mb-8">
        Tu es précieux, tu es attendu, tu es aimé
      </h2>

      {/* Cartes colorées */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">

        {/* Ajouter un membre */}
        <Link
          href="/add-member"
          className="p-6 rounded-3xl shadow-xl flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105 bg-gradient-to-br from-pink-400 to-yellow-300"
        >
          <div className="text-6xl mb-4">➕</div>
          <h2 className="text-xl font-bold text-white mb-2">Ajouter un membre</h2>
          <p className="text-white text-sm">
            Enregistre rapidement un nouveau venu à l’église.
          </p>
        </Link>

        {/* Liste des membres */}
        <Link
          href="/list-members"
          className="p-6 rounded-3xl shadow-xl flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105 bg-gradient-to-br from-blue-400 to-teal-300"
        >
          <div className="text-6xl mb-4">👥</div>
          <h2 className="text-xl font-bold text-white mb-2">Liste des membres</h2>
          <p className="text-white text-sm">
            Consulte et suis tous les membres de l’église.
          </p>
        </Link>

        {/* Rapport */}
        <Link
          href="/rapport"
          className="p-6 rounded-3xl shadow-xl flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105 bg-gradient-to-br from-orange-400 to-red-300"
        >
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-xl font-bold text-white mb-2">Rapport</h2>
          <p className="text-white text-sm">
            Visualise l’impact et les statistiques des membres.
          </p>
        </Link>

      </div>

      {/* Message d'amour */}
      <div className="mt-10 text-center px-4">
        <p className="text-lg font-semibold text-gray-800">
          ❤️ Aimons-nous les uns les autres, comme Christ nous a aimés.
        </p>
      </div>

    </div>
  );
}
