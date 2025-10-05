// pages/list-members.js
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import Image from "next/image";

export default function ListMembers() {
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState("");
  const [detailsOpen, setDetailsOpen] = useState({});
  const [cellules, setCellules] = useState([]);
  const [selectedCellules, setSelectedCellules] = useState({});
  const [selectedEvangelises, setSelectedEvangelises] = useState({});
  const [viewType, setViewType] = useState("card");

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

  const handleChangeStatus = async (id, newStatus) => {
    await supabase.from("membres").update({ statut: newStatus }).eq("id", id);
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, statut: newStatus } : m))
    );
  };

  const filteredMembers = members.filter((m) => {
    if (!filter) return true;
    if (filter === "star") return m.star === true;
    return m.statut === filter;
  });

  const countFiltered = filteredMembers.length;

  const getBorderColor = (member) => {
    if (member.star) return "         
    if (member.statut === "actif") return "#4285F4";
    if (member.statut === "a déjà mon église") return "         
    if (member.statut === "ancien") return "#999999";
    if (member.statut === "veut rejoindre ICC" || member.statut === "visiteur")
      return "         
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const nouveaux = filteredMembers.filter(
    (m) => m.statut === "visiteur" || m.statut === "veut rejoindre ICC"
  );
  const anciens = filteredMembers.filter(
    (m) => m.statut !== "visiteur" && m.statut !== "veut rejoindre ICC"
  );

  return (
    <div
      className="min-h-screen flex flex-col items-center p-6"
      style={{
        background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)",
      }}
    >
      {/* Bouton de retour */}
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

      {/* Message inspirant */}
      <p className="text-center text-white text-lg mb-6 font-handwriting-light">
        Chaque personne a une valeur infinie. Ensemble, nous avançons, grandissons
        et partageons l’amour de Christ dans chaque action ❤️
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
        <span className="text-white italic text-opacity-80">
          Résultats: {countFiltered}
        </span>
      </div>

      {/* Boutons de vue */}
      <div className="flex justify-end mb-4 w-full max-w-md">
        <button
          className={`mr-2 ${
            viewType === "card"
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-500"
          } hover:bg-blue-500 hover:text-white p-2 rounded`}
          onClick={() => setViewType("card")}
        >
          Card
        </button>
        <button
          className={`${
            viewType === "list"
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-500"
          } hover:bg-blue-500 hover:text-white p-2 rounded`}
          onClick={() => setViewType("list")}
        >
          Liste
        </button>
      </div>

      {/* Liste des membres */}
      <div className="w-full max-w-5xl">
        {viewType === "card" ? (
          <>
            {/* Nouveaux membres */}
            {nouveaux.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-2">
                {nouveaux.map((member) => (
                  <div key={member.id}>
                    <div
                      className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
                      style={{
                        borderTop: `4px solid ${getBorderColor(member)}`,
                      }}
                    >
                      <div>
                        <h2 className="text-lg font-bold text-gray-800 mb-1 flex items-center justify-between">
                          <span>
                            {member.prenom} {member.nom}
                            <span className="ml-1 text-green-500 font-semibold text-sm">
                              Nouveau
                            </span>
                            {member.star && (
                              <span className="ml-1 text-yellow-400">⭐</span>
                            )}
                          </span>
                          <select
                            value={member.statut}
                            onChange={(e) =>
                              handleChangeStatus(member.id, e.target.value)
                            }
                            className="border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
                          >
                            <option value="veut rejoindre ICC">
                              Veut rejoindre ICC
                            </option>
                            <option value="visiteur">Visiteur</option>
                            <option value="a déjà mon église">
                              A déjà mon église
                            </option>
                            <option value="evangelisé">Evangelisé</option>
                            <option value="actif">Actif</option>
                            <option value="ancien">Ancien</option>
                          </select>
                        </h2>
                        <p className="text-sm text-gray-600 mb-1">
                          📱 {member.telephone || "—"}
                        </p>
                        <p
                          className="text-sm font-semibold"
                          style={{ color: getBorderColor(member) }}
                        >
                          {member.statut || "—"}
                        </p>
                      </div>
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
                        <div className="mt-2 text-sm text-gray-700 space-y-2">
                          {/* Détails et bouton WhatsApp */}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Ligne de séparation */}
            {nouveaux.length > 0 && (
              <hr className="border-white border-t w-full my-4" />
            )}

            {/* Anciens membres */}
            {anciens.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {anciens.map((member) => (
                  <div key={member.id}>
                    <div
                      className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col justify
