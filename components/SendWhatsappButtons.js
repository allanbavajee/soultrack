/* components/SendWhatsappButtons.js */
"use client";
import { useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SendWhatsappButtons({ type, profile, gradient }) {
  const [showPopup, setShowPopup] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [sending, setSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // ⚡ Crée ou récupère le membre avant de créer le suivi
  const ensureMemberExists = async (phone, profile) => {
    let memberId = profile?.id;

    if (!memberId && phone) {
      // Vérifier si le numéro existe déjà
      const { data: existing, error: selectError } = await supabase
        .from("membres")
        .select("*")
        .eq("telephone", phone.trim())
        .maybeSingle();

      if (selectError) throw selectError;

      if (existing) {
        memberId = existing.id;
        // Mettre le statut à actif
        await supabase.from("membres").update({ statut: "actif" }).eq("id", memberId);
      } else {
        // Créer un nouveau membre
        const { data: newMember, error: insertError } = await supabase
          .from("membres")
          .insert([{ telephone: phone.trim(), statut: "actif" }])
          .select()
          .single();
        if (insertError) throw insertError;
        memberId = newMember.id;
      }
    }

    return memberId;
  };

  const handleSend = async () => {
    setSending(true);
    setStatusMessage("");

    try {
      // 1️⃣ Générer token
      const { data, error } = await supabase.rpc("generate_access_token", {
        p_access_type: type,
      });
      if (error) throw error;

      const token = data?.token;
      if (!token) throw new Error("Token introuvable.");

      // 2️⃣ Vérifier/créer membre
      const memberId = await ensureMemberExists(phoneNumber, profile);
      if (!memberId) throw new Error("Impossible d'identifier ou créer le membre.");

      // 3️⃣ Créer un suivi
      const { error: insertError } = await supabase.from("suivis_membres").insert([
        {
          membre_id: memberId,
          cellule_id: profile?.cellule_id || null,
          statut: "envoye",
        },
      ]);
      if (insertError) throw insertError;

      // 4️⃣ Préparer message WhatsApp
      const link = `https://soultrack-beta.vercel.app/access/${token}`;
      const message =
        type === "ajouter_membre"
          ? `Voici le lien pour ajouter un nouveau membre : 👉 ${link}`
          : `Voici le lien pour ajouter un nouvel évangélisé : 👉 ${link}`;

      const cleanedPhone = phoneNumber.replace(/\D/g, "");
      const waUrl = cleanedPhone
        ? `https://wa.me/${cleanedPhone}?text=${encodeURIComponent(message)}`
        : `https://wa.me/?text=${encodeURIComponent(message)}`;

      window.open(waUrl, "_blank");

      setStatusMessage("✅ Suivi créé et lien envoyé !");
      setPhoneNumber("");
      setShowPopup(false);
    } catch (err) {
      console.error(err);
      setStatusMessage("❌ Impossible de créer le suivi. Envoi annulé.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full">
      <button
        onClick={() => setShowPopup(true)}
        style={{ background: gradient }}
        className="text-white font-bold py-2 px-4 rounded-xl w-full transition-all duration-200"
      >
        {type === "ajouter_membre" ? "Envoyer l'appli – Nouveau membre" : "Envoyer l'appli – Évangélisé"}
      </button>

      {statusMessage && (
        <p className={`mt-2 font-semibold ${statusMessage.startsWith("✅") ? "text-green-600" : "text-red-600"}`}>
          {statusMessage}
        </p>
      )}

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl p-6 w-80 relative flex flex-col gap-4 shadow-lg">
            <button
              onClick={() => setShowPopup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
            >
              ❌
            </button>

            <h3 className="text-lg font-semibold text-gray-800 text-center">Saisir le numéro WhatsApp</h3>
            <input
              type="tel"
              placeholder="+230XXXXXXXX"
              className="border p-2 rounded w-full text-center"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <button
              onClick={handleSend}
              disabled={sending}
              style={{ background: gradient }}
              className="text-white font-bold py-2 px-4 rounded-xl w-full transition-all duration-200"
            >
              {sending ? "Envoi..." : "Envoyer"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
