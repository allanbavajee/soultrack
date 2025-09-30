// pages/generate-link.js
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

// Fonction pour générer un UUID en JS natif
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function GenerateLink() {
  const [selectedUser, setSelectedUser] = useState("");
  const [accessType, setAccessType] = useState("add_member");
  const [generatedLink, setGeneratedLink] = useState("");

  const handleGenerateLink = async () => {
    if (!selectedUser) return alert("Veuillez choisir un utilisateur");

    const token = generateUUID();

    // Insérer le token dans la table access_tokens
    const { error } = await supabase.from("access_tokens").insert([
      {
        user_id: selectedUser,
        token: token,
        access_type: accessType,
      },
    ]);

    if (error) {
      alert("Erreur lors de la génération du lien : " + error.message);
    } else {
      const link = `${window.location.origin}/access?token=${token}`;
      setGeneratedLink(link);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Générer un lien d'accès</h1>

      <div className="max-w-md mx-auto space-y-4">
        <div>
          <label className="block mb-2 font-semibold">Utilisateur :</label>
          <select
            className="w-full p-2 border rounded-lg"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">-- Choisir un utilisateur --</option>
            <option value="7021fc57-bf07-48cb-8050-99d0db8e8e7d">Conseiller</option>
            <option value="f9fc287b-a3fb-43d5-a1c4-ed4a316204b2">Evangeliste</option>
            <option value="7eb31af6-b448-48d8-be81-16176bed2784">Lucie Des Jardins (Responsable)</option>
            <option value="9e73c6e1-f03f-4dd5-b7eb-6c047bebe0e4">Clency Ravina (Responsable)</option>
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold">Type d'accès :</label>
          <select
            className="w-full p-2 border rounded-lg"
            value={accessType}
            onChange={(e) => setAccessType(e.target.value)}
          >
            <option value="add_member">Ajouter membre</option>
            <option value="add_evangelise">Ajouter evangelisé</option>
          </select>
        </div>

        <button
          onClick={handleGenerateLink}
          className="w-full py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
        >
          Générer le lien
        </button>

        {generatedLink && (
          <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
            <p className="font-semibold mb-2">Lien généré :</p>
            <a
              href={generatedLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline break-all"
            >
              {generatedLink}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
