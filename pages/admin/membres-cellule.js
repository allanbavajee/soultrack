//pages/membres-cellule.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import supabase from "../../lib/supabaseClient"; // ✅ import par défaut
import LogoutLink from "../../components/LogoutLink";

export default function MembresDeLaCellule() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [membres, setMembres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // 🔹 Récupération du profil utilisateur depuis le localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userProfile"));
    if (!storedUser) {
      router.push("/login");
      return;
    }
    setUser(storedUser);
  }, [router]);

  // 🔹 Récupération des membres
  useEffect(() => {
    if (!user) return;

    const fetchMembres = async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        console.log("🟢 Chargement des membres...");

        // Si admin → voir tous les membres
        const roles = JSON.parse(localStorage.getItem("userRole")) || [];
        const lowerRoles = Array.isArray(roles)
          ? roles.map((r) => r.toLowerCase())
          : [roles.toLowerCase()];

        let query = supabase.from("membres").select("*, cellules(cellule, ville)");

        if (!lowerRoles.includes("admin") && !lowerRoles.includes("administrateur")) {
          // Sinon, on filtre par cellule liée à ce responsable
          const { data: celluleData, error: celluleError } = await supabase
            .from("cellules")
            .select("id")
            .eq("responsable_id", user.id)
            .maybeSingle();

          if (celluleError) throw celluleError;
          if (!celluleData) {
            setErrorMsg("❌ Aucune cellule associée trouvée !");
            setMembres([]);
            setLoading(false);
            return;
          }

          query = query.eq("cellule_id", celluleData.id);
        }

        const { data, error } = await query;

        if (error) throw error;
        if (!data || data.length === 0) {
          setErrorMsg("⚠️ Aucun membre trouvé.");
        }

        setMembres(data || []);
      } catch (err) {
        console.error("❌ Erreur :", err.message);
        setErrorMsg("Erreur de chargement : " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembres();
  }, [user]);

  if (loading) return <div className="text-center mt-20">Chargement...</div>;

  return (
    <div
      className="min-h-screen p-6 flex flex-col items-center"
      style={{ background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)" }}
    >
      <div className="absolute top-4 right-4">
        <LogoutLink />
      </div>

      <h1 className="text-3xl text-white font-handwriting mb-6 text-center">
        👥 Membres de la Cellule
      </h1>

      {errorMsg ? (
        <div className="bg-white p-4 rounded-xl shadow-md text-center text-gray-700">
          {errorMsg}
        </div>
      ) : (
        <div className="bg-white p-6 rounded-3xl shadow-lg w-full max-w-4xl">
          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr className="bg-indigo-100 text-indigo-800">
                <th className="p-3 text-left">Nom</th>
                <th className="p-3 text-left">Prénom</th>
                <th className="p-3 text-left">Téléphone</th>
                <th className="p-3 text-left">Ville</th>
                <th className="p-3 text-left">Statut</th>
              </tr>
            </thead>
            <tbody>
              {membres.map((m) => (
                <tr key={m.id} className="border-b hover:bg-indigo-50">
                  <td className="p-3">{m.nom}</td>
                  <td className="p-3">{m.prenom || "-"}</td>
                  <td className="p-3">{m.telephone || "-"}</td>
                  <td className="p-3">{m.ville || "-"}</td>
                  <td className="p-3 capitalize">{m.statut || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={() => router.push("/add-member")}
        className="mt-6 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold shadow-md transition-all"
      >
        ➕ Ajouter un membre
      </button>

      <div className="text-white text-lg font-handwriting-light text-center mt-8 max-w-2xl">
        Car le corps ne se compose pas d’un seul membre, mais de plusieurs. <br />
        1 Corinthiens 12:14 ❤️
      </div>
    </div>
  );
}
