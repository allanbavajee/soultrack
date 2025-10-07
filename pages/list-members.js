//pages/list-members.js
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import Image from "next/image";

export default function ListMembers() {
  const [members, setMembers] = useState([]);
  const [cellules, setCellules] = useState([]);
  const [selectedCellule, setSelectedCellule] = useState({});
  const [detailsOpen, setDetailsOpen] = useState({});

  useEffect(() => {
    fetchMembers();
    fetchCellules();
  }, []);

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from("membres")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setMembers(data);
  };

  const fetchCellules = async () => {
    const { data, error } = await supabase
      .from("cellules")
      .select("*");
    if (!error && data) setCellules(data);
  };

  const handleSelectCellule = (memberId, celluleName) => {
    setSelectedCellule((prev) => ({ ...prev, [memberId]: celluleName }));
  };

  // ⚡ Nouvelle fonction : après envoi WhatsApp, créer suivi
  const markAsSent = async (member) => {
    if (!member) return;

    // Mettre à jour statut du membre
    await supabase.from("membres").update({ statut: "actif" }).eq("id", member.id);

    // Vérifier si un suivi existe déjà
    const { data: existing } = await supabase
      .from("suivis_membres")
      .select("*")
      .eq("membre_id", member.id)
      .single();

    if (!existing) {
      await supabase.from("suivis_membres").insert({
        membre_id: member.id,
        statut: "envoye",
        cellule_id: null,
      });
    }

    fetchMembers();
  };

  const renderMembers = (membersList) =>
    membersList.map((member) => {
      const cellule = cellules.find((c) => c.cellule === selectedCellule[member.id]) || null;
      let whatsappLink = "";
      if (cellule?.telephone) {
        const message = encodeURIComponent(
          `👋 Salut ${cellule.responsable},\n\n🙏 Voici une nouvelle personne à suivre :\n- Nom: ${member.prenom} ${member.nom}\n- Tel: ${member.telephone || "—"}`
        );
        whatsappLink = `https://wa.me/${cellule.telephone.replace(/\D/g, "")}?text=${message}`;
      }

      return (
        <div key={member.id} className="bg-white p-4 rounded-xl shadow-md border-l-4 flex flex-col" style={{ borderColor: "#34A853" }}>
          <h3 className="font-bold">{member.prenom} {member.nom}</h3>
          <p>Statut: {member.statut}</p>
          {cellule && (
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 text-white px-3 py-1 rounded mt-2"
              onClick={() => markAsSent(member)}
            >
              Envoyer à {cellule.responsable} sur WhatsApp
            </a>
          )}
          <div className="mt-2">
            <label>Cellule:</label>
            <select value={selectedCellule[member.id] || ""} onChange={(e) => handleSelectCellule(member.id, e.target.value)}>
              <option value="">-- Choisir cellule --</option>
              {cellules.map((c) => (
                <option key={c.id} value={c.cellule}>{c.cellule} ({c.responsable})</option>
              ))}
            </select>
          </div>
        </div>
      );
    });

  return (
    <div className="min-h-screen p-6" style={{ background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)" }}>
      <h1 className="text-white text-4xl mb-6">Liste des membres</h1>
      <div className="space-y-4">{renderMembers(members)}</div>
    </div>
  );
}
