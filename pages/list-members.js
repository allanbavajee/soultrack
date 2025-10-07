// pages/list-members.js
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import Image from "next/image";
import SendWhatsappButtons from "../components/SendWhatsappButtons";

export default function ListMembers() {
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState("");
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

  // ⚡ Nouvelle fonction pour changer le statut d’un membre à "envoye"
  const markAsSent = async (memberId) => {
    if (!memberId) return;
    await supabase.from("membres").update({ statut: "envoye" }).eq("id", memberId);
    // Mise à jour locale
    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, statut: "envoye" } : m))
    );
  };

  const handleChangeStatus = async (id, newStatus) => {
    await supabase.from("membres").update({ statut: newStatus }).eq("id", id);
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, statut: newStatus } : m))
    );
  };

  const handleSelectCellule = (memberId, celluleName) => {
    setSelectedCellule((prev) => ({
      ...prev,
      [memberId]: celluleName,
    }));
  };

  const filteredMembers = members.filter((m) => {
    if (!filter) return true;
    if (filter === "star") return m.star === true;
    return m.statut === filter;
  });

  const getBorderColor = (member) => {
    if (member.star) return "#FBC02D";
    if (member.statut === "actif") return "#4285F4";
    if (member.statut === "a déjà mon église") return "#EA4335";
    if (member.statut === "ancien") return "#999999";
    if (member.statut === "veut rejoindre ICC" || member.statut === "visiteur")
      return "#34A853";
    return "#ccc";
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // ⚡ Séparer les membres nouveaux et anciens
  const nouveaux = filteredMembers.filter(
    (m) => m.statut === "visiteur" || m.statut === "veut rejoindre ICC"
  );
  const anciens = filteredMembers.filter(
    (m) => m.statut !== "visiteur" && m.statut !== "veut rejoindre ICC"
  );

  const renderMembers = (membersList) =>
    membersList.map((member) => {
      const cellule =
        cellules.find((c) => c.cellule === selectedCellule[member.id]) || null;

      return (
        <div
          key={member.id}
          className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border-l-4 flex flex-col justify-between"
          style={{ borderColor: getBorderColor(member) }}
        >
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-1 flex justify-between items-center">
              <span className="flex items-center gap-2">
                {member.prenom} {member.nom}
                {member.star && <span className="text-yellow-400">⭐</span>}
                {(member.statut === "visiteur" ||
                  member.statut === "veut rejoindre ICC") && (
                  <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                    Nouveau
                  </span>
                )}
              </span>

              <select
                value={member.statut}
                onChange={(e) => handleChangeStatus(member.id, e.target.value)}
                className="border rounded-lg px-2 py-1 text-sm h-8 focus:outline-none focus:ring-1 focus:ring-indigo-400"
              >
                <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
                <option value="visiteur">Visiteur</option>
                <option value="a déjà mon église">A déjà mon église</option>
                <option value="evangelisé">Evangelisé</option>
                <option value="actif">Actif</option>
                <option value="ancien">Ancien</option>
              </select>
            </h3>

            <p className="text-sm text-gray-600 mb-1">📱 {member.telephone || "—"}</p>
            <p className="text-sm font-semibold" style={{ color: getBorderColor(member) }}>
              {member.statut || "—"}
            </p>

            {/* Bouton WhatsApp */}
            <div className="mt-2">
              <SendWhatsappButtons
                type="ajouter_membre"
                profile={member}
                gradient="linear-gradient(to right, #34D399, #10B981)"
                onSent={() => markAsSent(member.id)} // ⚡ ici on change le statut à "envoye"
              />
            </div>
          </div>
        </div>
      );
    });

  return (
    <div
      className="min-h-screen flex flex-col items-center p-6"
      style={{
        background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)",
      }}
    >
      {/* Retour */}
      <button
        onClick={() => window.history.back()}
        className="self-start mb-4 flex items-center text-white font-semibold hover:text-gray-200"
      >
        ← Retour
      </button>

      {/* Logo */}
      <div className="mt-2 mb-2">
        <Image src="/logo.png" alt="SoulTrack Logo" width={80} height={80} />
      </div>

      {/* Titre */}
      <h1 className="text-5xl sm:text-6xl font-handwriting text-white text-center mb-3">
        SoulTrack
      </h1>

      {/* Filtres */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6 w-full max-w-md">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-4 py-2 text-gray-700 shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 h-10"
        >
          <option value="">-- Filtrer par statut --</option>
          <option value="actif">Actif</option>
          <option value="ancien">Ancien</option>
          <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
          <option value="visiteur">Visiteur</option>
          <option value="a déjà mon église">A déjà mon église</option>
          <option value="star">⭐ Star</option>
        </select>
        <span className="text-white italic text-opacity-80">
          Résultats: {filteredMembers.length}
        </span>
      </div>

      {/* Nouveaux membres */}
      {nouveaux.length > 0 && (
        <>
          <h2 className="text-2xl text-white font-semibold mb-2">
            Nouveaux membres arrivés le{" "}
            {new Date(nouveaux[0].created_at).toLocaleDateString()}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {renderMembers(nouveaux)}
          </div>
        </>
      )}

      {/* Ligne de séparation */}
      <div className="my-8 h-1 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 rounded-full"></div>

      {/* Anciens membres */}
      {anciens.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {renderMembers(anciens)}
        </div>
      )}

      {/* Bouton retour haut */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-5 right-5 text-white text-2xl font-bold bg-transparent hover:text-gray-200"
      >
        ↑
      </button>
    </div>
  );
}

