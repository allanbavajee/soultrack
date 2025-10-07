// pages/list-members.js
"use client";
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function ListMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger les membres avec statut "visiteur" ou "veut rejoindre icc"
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase
          .from("membres")
          .select("*")
          .in("statut", ["visiteur", "veut rejoindre icc"])
          .order("created_at", { ascending: false });

        if (error) {
          console.error("❌ Erreur chargement membres:", error);
          return;
        }

        setMembers(data || []);
      } catch (err) {
        console.error("❌ Erreur inattendue fetchMembers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // Envoyer WhatsApp à un membre
  const handleWhatsAppSingle = async (member) => {
    try {
      // Générer un token
      const { data: tokenData, error: tokenError } = await supabase.rpc("generate_access_token", {
        p_access_type: "ajouter_membre",
      });

      if (tokenError) {
        console.error("❌ Erreur RPC:", tokenError);
        alert("Erreur lors de la génération du lien.");
        return;
      }

      const token = tokenData?.token;
      const link = `https://soultrack-beta.vercel.app/access/${token}`;
      const message = `Bonjour ${member.nom}, voici le lien pour remplir vos infos : 👉 ${link}`;

      // Ouvrir WhatsApp
      window.open(`https://wa.me/${member.telephone}?text=${encodeURIComponent(message)}`, "_blank");

      // Vérifier la cellule du membre
      const { data: cellule, error: celluleError } = await supabase
        .from("cellules")
        .select("id")
        .eq("id", member.cellule_id)
        .single();

      if (celluleError) {
        console.error("❌ Erreur récupération cellule:", celluleError);
      }

      // Insérer le suivi
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

      console.log("✅ Suivi inséré:", insertData);
      alert("Lien WhatsApp envoyé et suivi enregistré ✅");
    } catch (err) {
      console.error("❌ Erreur handleWhatsAppSingle:", err);
    }
  };

  if (loading) return <p className="p-4">Chargement...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📋 Liste des membres</h1>

      {members.length === 0 ? (
        <p>Aucun membre avec statut "visiteur" ou "veut rejoindre icc".</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Nom</th>
              <th className="border p-2">Téléphone</th>
              <th className="border p-2">Statut</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="border p-2">{member.nom}</td>
                <td className="border p-2">{member.telephone}</td>
                <td className="border p-2">{member.statut}</td>
                <td className="border p-2 text-center">
                  <button
                    onClick={() => handleWhatsAppSingle(member)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Envoyer WhatsApp
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
