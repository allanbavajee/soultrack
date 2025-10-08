// pages/list-members.js
"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Image from "next/image";

export default function ListMembers() {
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState("");
  const [detailsOpen, setDetailsOpen] = useState({});
  const [cellules, setCellules] = useState([]);
  const [selectedCellules, setSelectedCellules] = useState({});
  const [errorMessage, setErrorMessage] = useState(null); // pour afficher l'erreur
  const [rawData, setRawData] = useState(null); // pour debug

  useEffect(() => {
    fetchMembers();
    fetchCellules();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase.from("membres").select("*").order("created_at", { ascending: false });
      if (error) {
        console.error("Exception fetchMembers:", error);
        setErrorMessage(error.message || JSON.stringify(error));
        return;
      }
      setMembers(data);
      setRawData(data); // debug: afficher toutes les données récupérées
    } catch (err) {
      console.error("Exception fetchMembers:", err);
      setErrorMessage(err.message);
    }
  };

  const fetchCellules = async () => {
    try {
      const { data, error } = await supabase.from("cellules").select("id, cellule, responsable, telephone");
      if (error) {
        console.error("Exception fetchCellules:", error);
        return;
      }
      setCellules(data);
    } catch (err) {
      console.error("Exception fetchCellules:", err);
    }
  };

  const handleChangeStatus = async (id, newStatus) => {
    await supabase.from("membres").update({ statut: newStatus }).eq("id", id);
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, statut: newStatus } : m)));
  };

  // filtrage simple
  const filteredMembers = members.filter((m) => {
    if (!filter) return true;
    if (filter === "star") return m.star === true;
    return m.statut === filter;
  });

  const countFiltered = filteredMembers.length;

  const getBorderColor = (member) => {
    if (member.star) return "#FBC02D";
    if (member.statut === "actif") return "#4285F4";
    if (member.statut === "a déjà mon église") return "#EA4335";
    if (member.statut === "ancien") return "#999999";
    if (member.statut === "veut rejoindre ICC" || member.statut === "visiteur") return "#34A853";
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6" style={{ background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)" }}>
      
      {/* Affichage debug */}
      {errorMessage && (
        <div className="bg-red-200 text-red-800 p-4 rounded mb-4">
          ⚠️ Erreur Supabase : {errorMessage}
        </div>
      )}
      {rawData && (
        <div className="bg-white text-gray-800 p-4 rounded mb-4 w-full max-w-md">
          <strong>Données récupérées (debug) :</strong>
          <pre>{JSON.stringify(rawData, null, 2)}</pre>
        </div>
      )}

      <button onClick={() => window.history.back()} className="self-start mb-4 flex items-center text-white font-semibold hover:text-gray-200">
        ← Retour
      </button>

      <div className="mt-2 mb-2">
        <Image src="/logo.png" alt="SoulTrack Logo" width={80} height={80} />
      </div>

      <h1 className="text-5xl sm:text-6xl font-handwriting text-white text-center mb-3">SoulTrack</h1>
      <p className="text-center text-white text-lg mb-6 font-handwriting-light">
        Chaque personne a une valeur infinie. Ensemble, nous avançons, grandissons et partageons l’amour de Christ dans chaque action ❤️
      </p>

      {/* Filtre */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-4 w-full max-w-md">
        <select value={filter} onChange={(e) => setFilter(e.target.value)} className="border rounded-lg px-4 py-2 text-gray-700 shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-400">
          <option value="">-- Filtrer par statut --</option>
          <option value="actif">Actif</option>
          <option value="ancien">Ancien</option>
          <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
          <option value="visiteur">Visiteur</option>
          <option value="a déjà mon église">A déjà mon église</option>
          <option value="star">⭐ Star</option>
        </select>
        <span className="text-white italic text-opacity-80">Résultats: {countFiltered}</span>
      </div>

      {/* Ici tu peux continuer à afficher tes membres comme avant */}
      <p className="text-white mt-4 mb-4">⚡ Debug terminé. Les contacts doivent apparaître ci-dessous si Supabase renvoie des données.</p>
    </div>
  );
}
