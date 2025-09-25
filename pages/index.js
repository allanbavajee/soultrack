// pages/index.js
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      {/* Logos */}
      <div className="flex gap-6 items-center mb-6">
        <Image src="/soul.logo.png" alt="SoulTrack Logo" width={90} height={90} />
        <Image src="/icc.logo.png" alt="ICC Logo" width={90} height={90} />
      </div>

      {/* Slogan */}
      <h2 className="text-2xl md:text-3xl text-center mb-10 font-handwriting text-indigo-700">
        Tu es précieux, tu es attendu, tu es aimé
      </h2>

      {/* Cartes colorées */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full max-w-6xl">
        {/* Ajouter un membre */}
        <Link
          href="/add-member"
          className="bg-pink-100 p-8 rounded-3xl shadow-lg flex flex-col items-center hover:shadow-2xl transition-all duration-200 border-t-4 border-pink-400"
        >
          <div className="text-5xl mb-4">➕</div>
          <h2 className="text-xl font-bold text-gray-800">Ajouter un membre</h2>
        </Link>

        {/* Liste des membres */}
        <Link
          href="/list-members"
          className="bg-green-100 p-8 rounded-3xl shadow-lg flex flex-col items-center hover:shadow-2xl transition-all duration-200 border-t-4 border-green-400"
        >
          <div className="text-5xl mb-4">👥</div>
          <h2 className="text-xl font-bold text-gray-800">Liste des membres</h2>
        </Link>

        {/* Rapport */}
        <Link
          href="/rapport"
          className="bg-blue-100 p-8 rounded-3xl shadow-lg flex flex-col items-center hover:shadow-2xl transition-all duration-200 border-t-4 border-blue-400"
        >
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-xl font-bold text-gray-800">Rapport</h2>
        </Link>

        {/* Ajouter évangélisé */}
        <Link
          href="/add-evangelise"
          className="bg-yellow-100 p-8 rounded-3xl shadow-lg flex flex-col items-center hover:shadow-2xl transition-all duration-200 border-t-4 border-yellow-400"
        >
          <div className="text-5xl mb-4">🌟</div> {/* icône spécifique */}
          <h2 className="text-xl font-bold text-gray-800">Ajouter évangélisé</h2>
        </Link>
      </div>

      {/* Message d’amour */}
      <div className="mt-10 p-6 rounded-3xl shadow-md max-w-2xl text-center">
        <p className="text-lg font-semibold text-gray-700">
          ❤️ Aimons-nous les uns les autres, comme Christ nous a aimés.
        </p>
      </div>
    </div>
  );
}
