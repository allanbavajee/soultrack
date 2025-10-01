// components/SendWhatsappButtons.js
import { FaWhatsapp } from "react-icons/fa";
import supabase from "../lib/supabaseClient";

export default function SendWhatsappButtons({ userId, phoneNumber }) {
  const baseUrl = "https://soultrack-beta.vercel.app/access";

  const handleSend = async (type) => {
    if (!phoneNumber) {
      alert("⚠️ Aucun numéro de téléphone pour ce responsable !");
      return;
    }

    // Génération du token via la fonction RPC
    const { data, error } = await supabase.rpc("generate_access_token", {
      p_user_id: userId,
      p_access_type: type,
    });

    if (error) {
      alert("Erreur lors de la génération du token : " + error.message);
      return;
    }

    const token = data?.token;
    const link = `${baseUrl}/${token}`;

    // URL WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      "Voici ton lien d'accès : " + link
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleSend("ajouter_membre")}
        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-3 py-1 rounded-lg"
      >
        <FaWhatsapp />
        Envoyer l’appli – Membre
      </button>
      <button
        onClick={() => handleSend("ajouter_evangelise")}
        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-1 rounded-lg"
      >
        <FaWhatsapp />
        Envoyer l’appli – Évangélisé
      </button>
    </div>
  );
}
