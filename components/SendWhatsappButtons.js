/*components/SendWhatsappButtons.js*/
/* components/SendWhatsappButtons.js */
"use client";
import { useState, useEffect } from "react";
import supabase from "../lib/supabaseClient";

export default function SendWhatsappButtons() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [people, setPeople] = useState([]);
  const [selectedPerson, setSelectedPerson] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [activeButton, setActiveButton] = useState(""); // "ajouter_membre" ou "ajouter_evangelise"
  const [showOptions, setShowOptions] = useState(false);

  // Charger les personnes existantes dans la base
  useEffect(() => {
    const fetchPeople = async () => {
      const { data, error } = await supabase
        .from("profiles") // ⚠️ adapte selon ta table
        .select("id, nom, prenom, telephone");

      if (error) {
        console.error("Erreur fetch people:", error);
        return;
      }
      setPeople(data || []);
    };

    fetchPeople();
  }, []);

  const handleButtonClick = (accessType) => {
    setActiveButton(accessType);
    setShowOptions(true); // Affiche les champs après clic
    setErrorMsg(null);
  };

  const handleSend = async () => {
    if (!phoneNumber && !selectedPerson) {
      setErrorMsg("⚠️ Entre un numéro ou choisis une personne !");
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      let finalNumber = phoneNumber;
      if (selectedPerson) {
        const person = people.find((p) => p.id === selectedPerson);
        if (person?.telephone) finalNumber = person.telephone;
      }

      // Génération du token
      const { data: token, error } = await supabase.rpc(
        "generate_access_token",
        { p_access_type: activeButton }
      );

      if (error) {
        console.error("Erreur RPC :", error.message);
        setErrorMsg("Erreur lors de la génération du token");
        setLoading(false);
        return;
      }

      const link = `https://soultrack-beta.vercel.app/access/${token}`;
      const message =
        activeButton === "ajouter_membre"
          ? `Bonjour 👋, clique ici pour ajouter un membre : ${link}`
          : `Bonjour 🙌, clique ici pour ajouter une personne évangélisée : ${link}`;

      const cleanNumber = finalNumber.replace(/\D/g, "");
      window.open(
        `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`,
        "_blank"
      );

      // Réinitialiser les champs et fermer l’interface
      setPhoneNumber("");
      setSelectedPerson("");
      setShowOptions(false);
      setActiveButton("");
    } catch (err) {
      console.error("Erreur JS :", err);
      setErrorMsg("Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 items-center">
      {/* Boutons principaux */}
      <button
        type="button"
        onClick={() => handleButtonClick("ajouter_membre")}
        className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition-all duration-200"
      >
        📲 Envoyer l’appli – Nouveau membre
      </button>

      <button
        type="button"
        onClick={() => handleButtonClick("ajouter_evangelise")}
        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition-all duration-200"
      >
        📲 Envoyer l’appli – Évangélisé
      </button>

      {/* Interface options (apparaît après clic sur un bouton) */}
      {showOptions && (
        <div className="flex flex-col gap-3 mt-4 items-center w-full max-w-md">
          <select
            value={selectedPerson}
            onChange={(e) => setSelectedPerson(e.target.value)}
            className="border rounded-xl px-4 py-2 w-full"
          >
            <option value="">-- Choisir une personne existante --</option>
            {people.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nom} {p.prenom} ({p.telephone})
              </option>
            ))}
          </select>

          <input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="Numéro WhatsApp (ex: 23052345678)"
            className="border rounded-xl px-4 py-2 w-full"
          />

          <button
            type="button"
            onClick={handleSend}
            disabled={loading}
            className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold px-6 py-3 rounded-2xl shadow-md transition-all duration-200 w-full"
          >
            {loading ? "Envoi..." : "Envoyer le lien"}
          </button>

          {errorMsg && <p className="text-red-500 mt-2">{errorMsg}</p>}
        </div>
      )}
    </div>
  );
}


