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
      .select("id, cellule, responsable, telephone");
    if (!error && data) setCellules(data);
  };

  const handleSelectCellule = (memberId, celluleName) => {
    setSelectedCellule((prev) => ({
      ...prev,
      [memberId]: celluleName,
    }));
  };

  // ⚡ Fonction principale pour envoyer WhatsApp et créer suivi
  const markAsSent = async (member) => {
    if (!member) return;

    // 1️⃣ Mettre le statut du membre à "actif"
    await supabase
      .from("membres")
      .update({ statut: "actif" })
      .eq("id", member.id);

    // 2️⃣ Vérifier si une entrée existe déjà dans suivis_membres
    const { data: existing } = await supabase
      .from("suivis_membres")
      .select("*")
      .eq("membre_id", member.id)
      .single();

    if (!existing) {
      // Créer l'entrée dans suivis_membres
      await supabase.from("suivis_membres").insert({
        membre_id: member.id,
        statut: "envoye",
        cellule_id: null,
      });
    }

    alert("Membre envoyé et suivi créé !");
  };

  const getBorderColor = (member) => {
    if (member.statut === "visiteur" || member.statut === "veut rejoindre ICC")
      return "#34A853";
    if (member.statut === "actif") return "#4285F4";
    return "#ccc";
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6" style={{ background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)" }}>
      <button onClick={() => window.history.back()} className="self-start mb-4 flex items-center text-white font-semibold hover:text-gray-200">← Retour</button>
      <div className="mt-2 mb-2">
        <Image src="/logo.png" alt="SoulTrack Logo" width={80} height={80} />
      </div>
      <h1 className="text-5xl sm:text-6xl font-handwriting text-white text-center mb-3">SoulTrack</h1>

      <div className="w-full max-w-6xl space-y-4">
        {members.map((member) => {
          const cellule = cellules.find(c => c.cellule === selectedCellule[member.id]) || null;

          return (
            <div key={member.id} className="bg-white p-4 rounded-xl shadow-md border-l-4 flex flex-col" style={{ borderColor: getBorderColor(member) }}>
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-800">{member.prenom} {member.nom}</h3>
                {(member.statut === "visiteur" || member.statut === "veut rejoindre ICC") && (
                  <button
                    className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm"
                    onClick={() => markAsSent(member)}
                  >
                    📲 Envoyer WhatsApp
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">Statut: {member.statut}</p>
              <p className="text-sm text-gray-600">Ville: {member.ville || "—"}</p>
              {/* Détails collapsibles */}
              <button
                className="mt-2 text-blue-500 underline text-sm"
                onClick={() => setDetailsOpen(prev => ({ ...prev, [member.id]: !prev[member.id] }))}
              >
                {detailsOpen[member.id] ? "Fermer détails" : "Détails"}
              </button>
              {detailsOpen[member.id] && (
                <div className="mt-2 text-sm text-gray-700">
                  <p>Email: {member.email || "—"}</p>
                  <p>Besoins: {member.besoin || "—"}</p>
                  <p>Infos: {member.infos_supplementaires || "—"}</p>
                  <div className="mt-2">
                    <label>Cellule:</label>
                    <select
                      value={selectedCellule[member.id] || ""}
                      onChange={(e) => handleSelectCellule(member.id, e.target.value)}
                      className="border rounded-lg px-2 py-1 w-full"
                    >
                      <option value="">-- Choisir cellule --</option>
                      {cellules.map(c => <option key={c.id} value={c.cellule}>{c.cellule} ({c.responsable})</option>)}
                    </select>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
