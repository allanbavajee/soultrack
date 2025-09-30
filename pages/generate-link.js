// pages/generate-link.js
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export default function GenerateLink({ user }) {
  const [role, setRole] = useState("add_member");
  const [link, setLink] = useState("");

  const handleGenerate = async () => {
    const token = uuidv4();

    const { error } = await supabase.from("access_tokens").insert([
      {
        token,
        role,
        created_by: user.id,
        expires_at: null, // ou ajoute une date si tu veux expiration
      },
    ]);

    if (!error) {
      setLink(`${window.location.origin}/access/${token}`);
    } else {
      alert("Erreur lors de la génération du lien");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">Générer un lien d’accès</h1>

      <div className="mb-4">
        <label className="block mb-2 font-semibold">Type de lien :</label>
        <select
          className="border p-2 rounded-lg"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        >
          <option value="add_member">Ajouter un membre</option>
          <option value="add_evangelise">Ajouter un évangélisé</option>
        </select>
      </div>

      <button
        onClick={handleGenerate}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Générer le lien
      </button>

      {link && (
        <div className="mt-4 text-center">
          <p className="font-semibold">Lien généré :</p>
          <a href={link} className="text-blue-600 underline" target="_blank">
            {link}
          </a>
        </div>
      )}
    </div>
  );
}
