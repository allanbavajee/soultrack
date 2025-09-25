import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      
      {/* Logos */}
      <div className="flex gap-6 items-center mb-4">
        <Image src="/image/icc.logo.jpg" alt="soultrack" width={90} height={90} />
        <Image src="/image/icc.logo.png" alt="icc" width={90} height={90} />
      </div>

      {/* Slogan */}
      <h2 className="text-2xl md:text-3xl font-handwriting text-center text-gray-800 mb-8">
        Tu es précieux, tu es attendu, tu es aimé
      </h2>

      {/* Cartes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
        <Link
          href="/add-member"
          className="bg-yellow-200 p-6 rounded-3xl shadow-lg flex flex-col items-center hover:scale-105 transition-transform duration-300"
        >
          <div className="text-6xl mb-4">✚</div>
          <h2 className="text-xl font-bold text-gray-800 text-center">Ajouter un membre</h2>
        </Link>

        <Link
          href="/list-members"
          className="bg-blue-200 p-6 rounded-3xl shadow-lg flex flex-col items-center hover:scale-105 transition-transform duration-300"
        >
          <div className="text-6xl mb-4">👥</div>
          <h2 className="text-xl font-bold text-gray-800 text-center">Liste des membres</h2>
        </Link>

        <Link
          href="/rapport"
          className="bg-orange-300 p-6 rounded-3xl shadow-lg flex flex-col items-center hover:scale-105 transition-transform duration-300"
        >
          <div className="text-6xl mb-4">📊</div>
          <h2 className="text-xl font-bold text-gray-800 text-center">Rapport</h2>
        </Link>
      </div>

      {/* Message d'amour */}
      <div className="mt-10 text-center">
        <p className="text-lg font-semibold text-gray-700">
          ❤️ Aimons-nous les uns les autres, comme Christ nous a aimés.
        </p>
      </div>
    </div>
  );
}
