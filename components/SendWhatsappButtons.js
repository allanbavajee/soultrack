/*components/SendWhatsappButtons.js*/
"use client";
import { useState, useEffect } from "react";
import supabase from "../lib/supabaseClient";

export default function SendWhatsappButtons() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  // Charger les personnes déjà dans la base (membres ou évangélisés)
  useEffect(() => {
    const fetchPeople = async () => {
      const { data, error } = await supabase
        .from("profiles") // ⚠️ adapte au nom de ta table
        .select("id, nom, prenom, telephone");

      if (error) {
        console.error("Erreur fetch people:", error);
        return;
      }
      setPeople(data || []);
    };

    fetchPeople();
  }, []);

  const handleSend = async (accessType) => {
    setLoading(true);
    setErrorMsg(null);

    try {
      // Si une personne est choisie → on prend son numéro
      let finalNumber = phoneNumber;
      if (selectedPerson) {
        const person = people.find((p) => p.id === selectedPerson);
        if (person?.telephone) {
          finalNumber = person.telephone;
        }
      }

      if (!finalNumber) {
        setErrorMsg("⚠️ Entre un numéro ou choisis une personne !");
        setLoading(false);
        return;
      }

      // Génération du token côté Supabase
      const { data: token, error } = await supabase.rpc("generate_access_token", {
        p_access_type: accessType,
      });

      if (error) {
        console.error("Erreur RPC :", error.message);
        setErrorMsg("Erreur lors de la génération du token");
        setLoading(false);
        return;
      }

      const link = `https://soultrack-beta.vercel.app/access/${token}`;
      const message =
        accessType === "ajouter_membre"
          ? `Bonjour 👋, clique ici pour ajouter un membre : ${link}`
          : `Bonjour 🙌, clique ici pour ajouter une personne évangélisée : ${link}`;

      const cleanNumber = finalNumber.replace(/\D/g, "");
      window.open(
        `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`,
        "_blank"
      );
    } catch (err) {
      console.error("Erreur JS :", err);
      setErrorMsg("Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      {/* Sélecteur de personne déjà dans la base */}
      <select
        value={selectedPerson}
        onChange={(e) => setSelectedPerson(e.target.value)}
        className="border rounded-xl px-4 py-2 w-72"
      >
        <option value="">-- Choisir une personne existante --</option>
        {people.map((p) => (
          <option key={p.id} value={p.id}>
            {p.nom} {p.prenom} ({p.telephone})
          </option>
        ))}
      </select>

      {/* Champ numéro manuel */}
      <input
        type="text"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
        placeholder="Numéro WhatsApp (ex: 23052345678)"
        className="border rounded-xl px-4 py-2 w-72"
      />

      {/* Boutons */}
      <button
        type="button"
        onClick={() => handleSend("ajouter_membre")}
        disabled={loading}
        className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition-all duration-200"
      >
        {loading ? "Envoi..." : "📲 Envoyer l’appli – Nouveau membre"}
      </button>

      <button
        type="button"
        onClick={() => handleSend("ajouter_evangelise")}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition-all duration-200"
      >
        {loading ? "Envoi..." : "📲 Envoyer l’appli – Évangélisé"}
      </button>

      {errorMsg && <p className="text-red-500 mt-2">{errorMsg}</p>}
    </div>
  );
}

