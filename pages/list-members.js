// pages/list-members.js
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import Image from "next/image";

export default function ListMembers() {
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState("");
  const [detailsOpen, setDetailsOpen] = useState({});

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from("membres")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setMembers(data);
  };

  const handleChangeStatus = async (id, newStatus) => {
    await supabase.from("membres").update({ statut: newStatus }).eq("id", id);
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, statut: newStatus } : m))
    );
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const getBorderColor = (member) => {
    if (member.star) return "#FBC02D";
    if (member.statut === "actif") return "#4285F4";
    if (member.statut === "a déjà mon église") return "#EA4335";
    if (member.statut === "ancien") return "#999999";
    if (member.statut === "veut rejoindre ICC" || member.statut === "visiteur")
      return "#34A853";
  };

  // Définir nouveaux et anciens membres
  const newMembers = members.filter(
    (m) => m.statut === "visiteur" || m.statut === "veut rejoindre ICC"
  );
  const oldMembers = members
    .filter((m) => !newMembers.includes(m))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at)); // anciens triés

  // Appliquer filtre
  const filterFunc = (m) => {
    if (!filter) return true;
    if (filter === "star") return m.star === true;
    return m.statut === filter;
  };

  const filteredNewMembers = newMembers.filter(filterFunc);
  const filteredOldMembers = oldMembers.filter(filterFunc);

  return (
    <div
      className="min-h-screen flex flex-col items-center p-6"
      style={{ background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)" }}
    >
      {/* Bouton Retour */}
      <button
        onClick={() => window.history.back()}
        className="self-start mb-4 flex items-center text-orange-500 font-semibold hover:text-orange-600"
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

      {/* Message inspirant */}
      <p className="text-center text-white text-lg mb-6 font-handwriting-light">
        Chaque personne a une valeur infinie. Ensemble, nous avançons, grandissons et partageons l’amour de Christ dans chaque action ❤️
      </p>

      {/* Filtres + compte */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-4 w-full max-w-md">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-4 py-2 text-gray-700 shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">-- Filtrer par statut --</option>
          <option value="actif">Actif</option>
          <option value="ancien">Ancien</option>
          <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
          <option value="visiteur">Visiteur</option>
          <option value="a déjà mon église">A déjà mon église</option>
          <option value="star">⭐ Star</option>
        </select>
        <span className="text-white font-semibold">
          Résultats: {filteredNewMembers.length + filteredOldMembers.length}
        </span>
      </div>

      {/* Nouveaux membres */}
      {filteredNewMembers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mb-4">
          {filteredNewMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col justify-between border-t-4 border-green-500"
            >
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-1 flex justify-between items-center">
                  <span>
                    {member.prenom} {member.nom}
                    <span className="ml-2 bg-green-500 text-white px-2 py-0.5 rounded-full text-xs">
                      Nouveau
                    </span>
                    {member.star && <span className="ml-1 text-yellow-400">⭐</span>}
                  </span>
                  <select
                    value={member.statut}
                    onChange={(e) => handleChangeStatus(member.id, e.target.value)}
                    className="border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  >
                    <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
                    <option value="visiteur">Visiteur</option>
                    <option value="a déjà mon église">A déjà mon église</option>
                    <option value="evangelisé">Evangelisé</option>
                    <option value="actif">Actif</option>
                    <option value="ancien">Ancien</option>
                  </select>
                </h2>
                <p className="text-sm text-gray-600 mb-1">📱 {member.telephone || "—"}</p>
                <p className="text-sm font-semibold" style={{ color: getBorderColor(member) }}>
                  {member.statut || "—"}
                </p>
              </div>
              <p
                className="mt-2 text-blue-500 underline cursor-pointer"
                onClick={() =>
                  setDetailsOpen((prev) => ({ ...prev, [member.id]: !prev[member.id] }))
                }
              >
                {detailsOpen[member.id] ? "Fermer détails" : "Détails"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Ligne de séparation */}
      {filteredNewMembers.length > 0 && filteredOldMembers.length > 0 && (
        <hr className="border-dashed border-white w-full max-w-5xl mb-4" />
      )}

      {/* Anciens membres */}
      {filteredOldMembers.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {filteredOldMembers.map((member) => (
            <div
              key={member.id}
              className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col justify-between"
              style={{ borderTop: `4px solid ${getBorderColor(member)}` }}
            >
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-1 flex justify-between items-center">
                  <span>
                    {member.prenom} {member.nom} {member.star && <span className="ml-1 text-yellow-400">⭐</span>}
                  </span>
                  <select
                    value={member.statut}
                    onChange={(e) => handleChangeStatus(member.id, e.target.value)}
                    className="border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  >
                    <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
                    <option value="visiteur">Visiteur</option>
                    <option value="a déjà mon église">A déjà mon église</option>
                    <option value="evangelisé">Evangelisé</option>
                    <option value="actif">Actif</option>
                    <option value="ancien">Ancien</option>
                  </select>
                </h2>
                <p className="text-sm text-gray-600 mb-1">📱 {member.telephone || "—"}</p>
                <p className="text-sm font-semibold" style={{ color: getBorderColor(member) }}>
                  {member.statut || "—"}
                </p>
              </div>
              <p
                className="mt-2 text-blue-500 underline cursor-pointer"
                onClick={() =>
                  setDetailsOpen((prev) => ({ ...prev, [member.id]: !prev[member.id] }))
                }
              >
                {detailsOpen[member.id] ? "Fermer détails" : "Détails"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Bouton remonter en haut */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-5 right-5 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg flex items-center justify-center text-2xl font-bold"
        title="Remonter en haut"
      >
        ⬆
      </button>      
    </div>
  );
}
