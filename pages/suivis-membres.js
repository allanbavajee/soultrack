// pages/suivis-membres.js
"use client";
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import Image from "next/image";

export default function SuivisMembres() {
  const [suivis, setSuivis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSuivis();
  }, []);

  const fetchSuivis = async () => {
    try {
      const { data, error } = await supabase
        .from("suivis_membres")
        .select(`
          id,
          statut,
          created_at,
          membres (
            id,
            prenom,
            nom,
            telephone,
            email,
            besoin,
            ville,
            infos_supplementaires,
            is_whatsapp,
            star,
            comment_est_venu
          ),
          cellules (
            id,
            cellule,
            responsable,
            telephone
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSuivis(data || []);
    } catch (err) {
      console.error("Erreur fetchSuivis:", err.message);
      setSuivis([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center mt-10">Chargement...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center p-6"
      style={{ background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)" }}
    >
      <button
        onClick={() => window.history.back()}
        className="self-start mb-4 flex items-center text-white font-semibold hover:text-gray-200"
      >
        ← Retour
      </button>

      <div className="mt-2 mb-2">
        <Image src="/logo.png" alt="SoulTrack Logo" width={80} height={80} />
      </div>

      <h1 className="text-5xl sm:text-6xl font-handwriting text-white text-center mb-3">
        Suivis Membres
      </h1>

      {suivis.length === 0 ? (
        <p className="text-white mt-6">Aucun suivi trouvé</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mt-6">
          {suivis.map((suivi) => (
            <div
              key={suivi.id}
              className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
            >
              <h2 className="text-lg font-bold text-gray-800 mb-1">
                {suivi.membres?.prenom} {suivi.membres?.nom}
                {suivi.membres?.star && <span className="ml-1 text-yellow-400">⭐</span>}
              </h2>
              <p className="text-sm text-gray-600 mb-1">
                📱 {suivi.membres?.telephone || "—"}
              </p>
              <p className="text-sm font-semibold text-blue-600 mb-1">
                {suivi.statut || "—"}
              </p>
              <p className="text-sm text-gray-700">
                Ville : {suivi.membres?.ville || "—"}
              </p>
              <p className="text-sm text-gray-700">
                Besoin : {suivi.membres?.besoin || "—"}
              </p>
              <p className="text-sm text-gray-700">
                Comment est-il venu ? {suivi.membres?.comment_est_venu || "—"}
              </p>
              <p className="text-sm text-purple-700 font-semibold">
                Cellule : {suivi.cellules?.cellule || "—"}
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Suivi créé le :{" "}
                {new Date(suivi.created_at).toLocaleDateString("fr-FR", {
                  weekday: "long",
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
