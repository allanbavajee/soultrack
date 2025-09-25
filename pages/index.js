// pages/index.js
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      {/* Logos */}
      <div className="flex items-center justify-center gap-6 mb-6">
        <Image src="/icc.logo.png" alt="ICC Logo" width={90} height={90} />
        <Image src="/soul.logo.png" alt="SoulTrack Logo" width={90} height={90} />
      </div>

      {/* Slogan */}
      <h2 className="text-2xl md:text-3xl font-handwriting text-center text-gray-800 mb-10">
        Tu es précieux, tu es attendu, tu es aimé
      </h2>

      {/* Cartes colorées */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {/* Ajouter un membre */}
        <Link
          href="/add-member"
          className="bg-white p-8 rounded-3xl shadow-lg flex flex-col items-center hover:shadow-2xl transition-all duration-200 border-t-4 border-pink-400"
        >
          <div className="text-5xl mb-4">✨</div>
          <h2 className="text-xl font-bold text-gray-800">Ajouter un membre</h2>
          <p className="text-gray-500 mt-2 text-center">
            Enregistrez rapidement un nouveau venu à l’église.
          </p>
        </Link>

        {/* Liste des membres */}
        <Link
          href="/list-members"
          className="bg-white p-8 rounded-3xl shadow-lg flex flex-col items-center hover:shadow-2xl transition-all duration-200 border-t-4 border-teal-400"
        >
          <div className="text-5xl mb-4">👥</div>
          <h2 className="text-xl font-bold text-gray-800">Liste des membres</h2>
          <p className="text-gray-500 mt-2 text-center">
            Consultez et suivez tous les membres de l’église.
          </p>
        </Link>

        {/* Rapport */}
        <Link
          href="/rapport"
          className="bg-white p-8 rounded-3xl shadow-lg flex flex-col items-center hover:shadow-2xl transition-all duration-200 border-t-4 border-orange-400"
        >
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-xl font-bold text-gray-800">Rapport</h2>
          <p className="text-gray-500 mt-2 text-center">
            Visualisez l’impact et les statistiques des membres.
          </p>
        </Link>
      </div>

      {/* Message d’amour */}
      <div className="mt-10 max-w-2xl text-center">
        <p className="text-lg font-semibold text-gray-700">
          ❤️ Aimons-nous les uns les autres, comme Christ nous a aimés.
        </p>
      </div>
    </div>
  );
}
