// pages/list-members.js
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import Image from "next/image";

export default function ListMembers() {
  const [members, setMembers] = useState([]);
  const [detailsOpen, setDetailsOpen] = useState({});
  const [cellules, setCellules] = useState([]);
  const [selectedCellule, setSelectedCellule] = useState({});

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

  // 🔹 Marquer comme envoyé + créer un suivi
  const markAsSent = async (memberId) => {
    if (!memberId) return;

    await supabase
      .from("membres")
      .update({ statut: "actif" })
      .eq("id", memberId);

    const { data: existing } = await supabase
      .from("suivis_membres")
      .select("*")
      .eq("membre_id", memberId)
      .single();

    if (!existing) {
      await supabase.from("suivis_membres").insert({
        membre_id: memberId,
        statut: "envoye",
        cellule_id: null, // mettre la cellule si nécessaire
      });
    }

    fetchMembers();
  };

  const handleSelectCellule = (memberId, celluleName) => {
    setSelectedCellule((prev) => ({
      ...prev,
      [memberId]: celluleName,
    }));
  };

  const getBorderColor = (member) => {
    if (member.statut === "actif") return "#34A853";
    if (member.statut === "visiteur" || member.statut === "veut rejoindre ICC") return "#4285F4";
    return "#ccc";
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // 🔹 Filtrer les nouveaux membres uniquement
  const nouveaux = members.filter(
    (m) => m.statut === "visiteur" || m.statut === "veut rejoindre ICC"
  );

  const renderMembers = (membersList) =>
    membersList.map((member) => {
      const cellule =
        cellules.find((c) => c.cellule === selectedCellule[member.id]) || null;

      let whatsappLink = "";
      if (cellule?.telephone) {
        const message = encodeURIComponent(
          `👋 Salut ${cellule.responsable},\n\n🙏 Voici une nouvelle âme à suivre.\n- Nom: ${member.prenom} ${member.nom}\n- Téléphone: ${member.telephone || "—"}`
        );
        whatsappLink = `https://wa.me/${cellule.telephone.replace(/\D/g, "")}?text=${message}`;
      }

      return (
        <div
          key={member.id}
          className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border-l-4 flex flex-col justify-between"
          style={{ borderColor: getBorderColor(member) }}
        >
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-1 flex justify-between items-center">
              <span>
                {member.prenom} {member.nom}
              </span>
              <select
                value={member.statut}
                onChange={(e) =>
                  supabase
                    .from("membres")
                    .update({ statut: e.target.value })
                    .eq("id", member.id)
                    .then(() => fetchMembers())
                }
                className="border rounded-lg px-2 py-1 text-sm h-8 focus:outline-none focus:ring-1 focus:ring-indigo-400"
              >
                <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
                <option value="visiteur">Visiteur</option>
                <option value="actif">Actif</option>
              </select>
            </h3>

            <p className="text-sm text-gray-600 mb-1">📱 {member.telephone || "—"}</p>
            <p className="text-sm font-semibold" style={{ color: getBorderColor(member) }}>
              {member.statut || "—"}
            </p>

            <p
              className="mt-2 text-blue-500 underline cursor-pointer"
              onClick={() =>
                setDetailsOpen((prev) => ({
                  ...prev,
                  [member.id]: !prev[member.id],
                }))
              }
            >
              {detailsOpen[member.id] ? "Fermer détails" : "Détails"}
            </p>

            {detailsOpen[member.id] && (
              <div className="mt-3 text-sm text-gray-700 space-y-2 border-t pt-2">
                <p>📧 Email: {member.email || "—"}</p>
                <p>🏙 Ville: {member.ville || "—"}</p>
                <p>📝 Infos supplémentaires: {member.infos_supplementaires || "—"}</p>

                <select
                  value={selectedCellule[member.id] || ""}
                  onChange={(e) => handleSelectCellule(member.id, e.target.value)}
                  className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 truncate mt-2"
                >
                  <option value="">-- Choisir une cellule --</option>
                  {cellules.map((c) => (
                    <option key={c.id} value={c.cellule}>
                      {c.cellule} ({c.responsable})
                    </option>
                  ))}
                </select>

                {cellule && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg font-semibold mt-3 w-full text-center"
                    onClick={() => markAsSent(member.id)}
                  >
                    📲 Envoyer à {cellule.responsable} sur WhatsApp
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      );
    });

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <h1 className="text-5xl font-handwriting text-white text-center mb-6">
        SoulTrack
      </h1>

      <div className="w-full max-w-6xl space-y-8">
        {nouveaux.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderMembers(nouveaux)}
          </div>
        )}
      </div>

      <button
        onClick={scrollToTop}
        className="fixed bottom-5 right-5 text-white text-2xl font-bold bg-transparent hover:text-gray-200"
      >
        ↑
      </button>
    </div>
  );
}
