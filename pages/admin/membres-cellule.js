//pages/membres-cellule.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import supabase from "../lib/supabaseClient";

export default function MembresCellule() {
  const [membres, setMembres] = useState([]);
  const [user, setUser] = useState(null);
  const [profil, setProfil] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return setLoading(false);
      setUser(user);

      // 🔍 Récupère le rôle et la cellule de l’utilisateur connecté
      const { data: profil, error: profilError } = await supabase
        .from("users")
        .select("role, cellule_id")
        .eq("id", user.id)
        .single();

      if (profilError || !profil) return setLoading(false);
      setProfil(profil);

      // 🧩 Prépare la requête des membres
      let query = supabase.from("membres").select("*");

      if (profil.role === "admin") {
        const { data, error } = await query;
        if (!error) setMembres(data);
      } else if (profil.cellule_id) {
        const { data, error } = await query.eq("cellule_id", profil.cellule_id);
        if (!error) setMembres(data);
      }

      setLoading(false);
    }

    fetchData();
  }, []);

  if (loading)
    return <div className="text-center mt-10 text-gray-600">Chargement...</div>;

  if (!membres || membres.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-indigo-50">
        <h2 className="text-gray-600 text-lg font-medium mb-3">
          Aucune cellule trouvée.
        </h2>
        <button
          onClick={() => router.push("/hub")}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md transition"
        >
          Retour au hub
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl p-6">
        {/* 🧭 En-tête */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-indigo-700">
              Membres de la cellule
            </h1>
            <p className="text-gray-500">
              {profil?.role === "admin"
                ? "Affichage de tous les membres"
                : "Affichage des membres de votre cellule"}
            </p>
          </div>

          {/* ➕ Bouton visible uniquement si admin ou responsable */}
          {(profil?.role === "admin" || profil?.cellule_id) && (
            <button
              onClick={() => router.push("/add-member")}
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-2xl font-semibold shadow-md transition-all"
            >
              ➕ Ajouter un membre
            </button>
          )}
        </div>

        {/* 📋 Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="p-3 text-left">Nom</th>
                <th className="p-3 text-left">Prénom</th>
                <th className="p-3 text-left">Téléphone</th>
                <th className="p-3 text-left">Ville</th>
                <th className="p-3 text-left">Statut</th>
                <th className="p-3 text-left">Cellule</th>
              </tr>
            </thead>
            <tbody>
              {membres.map((m) => (
                <tr
                  key={m.id}
                  className="border-b hover:bg-indigo-50 transition-all"
                >
                  <td className="p-3">{m.nom}</td>
                  <td className="p-3">{m.prenom}</td>
                  <td className="p-3">{m.telephone}</td>
                  <td className="p-3">{m.ville || "-"}</td>
                  <td className="p-3 capitalize">{m.statut || "-"}</td>
                  <td className="p-3 text-sm text-gray-600">
                    {m.cellule_id || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 🔙 Retour */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push("/hub")}
            className="text-indigo-600 hover:text-indigo-800 font-semibold transition-colors"
          >
            ← Retour au hub
          </button>
        </div>
      </div>
    </div>
  );
}
