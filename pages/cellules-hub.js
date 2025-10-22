// pages/cellules-hub.js
"use client";

import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import { useRouter } from "next/router";
import LogoutLink from "../components/LogoutLink";

export default function CellulesHub() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [cellule, setCellule] = useState(null);
  const [membres, setMembres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Vérifie l’utilisateur et le rôle
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("userProfile"));
    if (!storedUser) {
      router.push("/login");
      return;
    }

    if (storedUser.role !== "ResponsableCellule") {
      setError("⛔ Accès non autorisé !");
      setTimeout(() => router.push("/login"), 2000);
      return;
    }

    setUser(storedUser);
  }, [router]);

  // ✅ Charge la cellule et ses membres
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        console.log("▶️ Début du chargement des données...");

        // 1️⃣ Récupère la cellule du responsable
        const { data: celluleData, error: celluleError } = await supabase
          .from("cellules")
          .select("id, cellule, ville, responsable, telephone")
          .eq("responsable_id", user.id)
          .maybeSingle();

        if (celluleError) throw celluleError;

        if (!celluleData) {
          console.log("❌ Aucune cellule assignée.");
          setCellule(null);
          setMembres([]);
          setLoading(false);
          return;
        }

        setCellule(celluleData);

        // 2️⃣ Récupère les membres liés à cette cellule
        const { data: membresData, error: membresError } = await supabase
          .from("membres")
          .select("*")
          .eq("cellule_id", celluleData.id);

        if (membresError) throw membresError;

        setMembres(membresData || []);
        setLoading(false);

        console.log("✅ Données chargées :", { celluleData, membresData });
      } catch (err) {
        console.error("❌ Erreur pendant fetchData :", err);
        setError("Erreur lors du chargement des données.");
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // 🌀 Affichage pendant chargement
  if (loading) {
    return (
      <div className="text-center mt-20 text-white text-xl animate-pulse">
        Chargement des données...
      </div>
    );
  }

  // 🚫 Affichage d’erreur d’accès
  if (error) {
    return (
      <div
        className="flex flex-col items-center justify-center min-h-screen text-center text-white p-6"
        style={{
          background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)",
        }}
      >
        <p className="text-3xl font-bold mb-4">{error}</p>
        <p className="text-lg">Redirection en cours...</p>
      </div>
    );
  }

  // ✅ Contenu principal
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center p-6"
      style={{
        background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)",
      }}
    >
      {/* 🔹 Déconnexion */}
      <div className="absolute top-4 right-4">
        <LogoutLink />
      </div>

      <h1 className="text-4xl text-white font-handwriting mb-6">
        Espace Responsable de Cellule
      </h1>

      {cellule ? (
        <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-3xl mb-10">
          <h2 className="text-2xl font-bold mb-2 text-gray-800">
            🏠 Cellule : {cellule.cellule}
          </h2>
          <p className="text-gray-700">
            📍 Ville : {cellule.ville} <br />
            📞 Téléphone : {cellule.telephone}
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-2 text-gray-800">
            👥 Membres de la cellule
          </h3>

          {membres.length > 0 ? (
            <ul className="space-y-2">
              {membres.map((m) => (
                <li
                  key={m.id}
                  className="border-b border-gray-300 pb-2 flex justify-between"
                >
                  <span>
                    {m.prenom} {m.nom}
                  </span>
                  <span className="text-sm text-gray-500">{m.telephone}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">
              Aucun membre trouvé pour cette cellule.
            </p>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-3xl text-center">
          <p className="text-gray-700">Aucune cellule assignée.</p>
        </div>
      )}

      <div className="text-white text-lg font-handwriting-light text-center max-w-2xl">
        Car le corps ne se compose pas d’un seul membre, mais de plusieurs. <br />
        1 Corinthiens 12:14 ❤️
      </div>
    </div>
  );
}
