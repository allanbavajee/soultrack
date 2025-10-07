// pages/list-members.js
"use client";
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function ListMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Charger les membres
  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from("membres")
        .select("id, nom, telephone, statut, cellule_id");

      if (error) {
        console.error("❌ Erreur fetch membres:", error);
      } else {
        setMembers(data);
      }
      setLoading(false);
    };

    fetchMembers();
  }, []);

  // 🔹 Envoyer un WhatsApp à un seul membre
  const handleWhatsAppSingle = async (member) => {
    try {
      // ⚡ Générer token d’accès
      const { data: tokenData, error: tokenError } = await supabase.rpc(
        "generate_access_token",
        { p_access_type: "ajouter_membre" }
      );

      if (tokenError) {
        console.error("❌ Erreur RPC:", tokenError);
        alert("Erreur lors de la génération du lien.");
        return;
      }

      const token = tokenData?.token;
      const link = `https://soultrack-beta.vercel.app/access/${token}`;
      const message = `Bonjour ${member.nom}, voici le lien pour remplir vos infos : 👉 ${link}`;

      // ⚡ Envoyer le message WhatsApp
      window.open(
        `https://wa.me/${member.telephone}?text=${encodeURIComponent(message)}`,
        "_blank"
      );

      // ⚡ Récupérer cellule
      const { data: cellule, error: celluleError } = await supabase
        .from("cellules")
        .select("id")
        .eq("id", member.cellule_id)
        .single();

      if (celluleError) {
        console.error("❌ Erreur récupération cellule:", celluleError);
        return;
      }

      // ⚡ Insérer suivi du membre
      const { data: insertData, error: insertError } = await supabase
        .from("suivis_membres")
        .insert([
          {
            membre_id: member.id,
            cellule_id: cellule?.id || null,
            statut: "envoye",
          },
        ])
        .select();

      if (insertError) {
        console.error("❌ Erreur insert suivis_membres:", insertError);
        alert("Impossible d’enregistrer le suivi.");
        return;
      }

      console.log("✅ Insert OK:", insertData);
      alert("Lien envoyé et suivi enregistré ✅");
    } catch (err) {
      console.error("❌ Erreur inattendue:", err);
    }
  };

  // 🔹 Rendu
  if (loading) return <p className="p-4">Chargement...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Liste des membres</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Nom</th>
            <th className="p-2 border">Téléphone</th>
            <th className="p-2 border">Statut</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => (
            <tr key={member.id} className="border">
              <td className="p-2 border">{member.nom}</td>
              <td className="p-2 border">{member.telephone}</td>
              <td className="p-2 border">{member.statut}</td>
              <td className="p-2 border text-center">
                <button
                  onClick={() => handleWhatsAppSingle(member)}
                  className="bg-green-500 text-white px-3 py-1 rounded"
                >
                  Envoyer WhatsApp
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
