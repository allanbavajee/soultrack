/*pages/index.js*/
import Link from "next/link";
import Image from "next/image";
import SendWhatsappButtons from "../components/SendWhatsappButtons";

export default function Home() {
  // Ici tu peux mettre un token pré-généré pour test ou récupérer depuis Supabase
  const testToken = "f2a103d8-f6c0-48c1-892c-3a4bd974c321";
  const phoneNumber = "+230XXXXXXXX"; // Remplace par le numéro du destinataire

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      {/* Logos */}
      <div className="flex flex-col md:flex-row items-center justify-center mt-8 gap-6">
        <Image src="/soul.logo.png" alt="SoulTrack Logo" width={90} height={90} />
        <Image src="/icc.logo.png" alt="ICC Logo" width={90} height={90} />
      </div>

      {/* Slogan */}
      <h2 className="mt-4 text-2xl md:text-3xl font-handwriting text-center text-gray-800">
        Tu es précieux, tu es attendu, tu es aimé
      </h2>

      {/* Boutons WhatsApp */}
      <div className="mt-6">
        <SendWhatsappButtons token={testToken} phoneNumber={phoneNumber} />
      </div>

      {/* Cartes d'actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl mt-10 justify-items-center">
        <Link href="/membres-hub" className="bg-white p-6 w-64 h-52 rounded-3xl shadow-lg flex flex-col items-center justify-center hover:shadow-2xl transition-all duration-200 border-t-4 border-[#4285F4]">
          <div className="text-5xl mb-4">👤</div>
          <h2 className="text-xl font-bold text-gray-800 text-center">Membres & Suivis</h2>
        </Link>

        <Link href="/evangelisation-hub" className="bg-white p-6 w-64 h-52 rounded-3xl shadow-lg flex flex-col items-center justify-center hover:shadow-2xl transition-all duration-200 border-t-4 border-[#34a853]">
          <div className="text-5xl mb-4">🙌</div>
          <h2 className="text-xl font-bold text-gray-800 text-center">Évangélisation</h2>
        </Link>

        <Link href="/rapport" className="bg-white p-6 w-64 h-52 rounded-3xl shadow-lg flex flex-col items-center justify-center hover:shadow-2xl transition-all duration-200 border-t-4 border-[#ea4335]">
          <div className="text-5xl mb-4">📊</div>
          <h2 className="text-xl font-bold text-gray-800 text-center">Rapport</h2>
        </Link>
      </div>

      {/* Message d'amour */}
      <div className="mt-10 p-6 rounded-3xl shadow-md max-w-2xl text-center text-gray-800">
        <p className="text-lg font-handwriting font-semibold">
          ❤️ Aimons-nous les uns les autres, comme Christ nous a aimés.
        </p>
      </div>
    </div>
  );
}
