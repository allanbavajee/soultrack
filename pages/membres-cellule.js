//pages/membres-cellule.js"
"use client";

import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function MembresCellule() {
  const [user, setUser] = useState(null);
  const [membres, setMembres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  // 🔹 Récupère la session et l'utilisateur
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (!session) {
          setErrorMsg("Utilisateur non connecté");
          setLoading(false);
          return;
        }

        setUser(session.user);
      } catch (err) {
        console.error("Erreur récupération user :", err);
        setErrorMsg("Erreur récupération utilisateur");
        setLoading(false);
      }
    };

    fetchUser();

    // Écoute les changements de session (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  // 🔹 Récupère les membres selon le rôle
  useEffect(() => {
    if (!user) return;

    const fetchMembres = async () => {
      setLoading(true);

      try {
        // 🔹 Récupère le rôle depuis la table profiles
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        let query = supabase
          .from("membres")
          .select(`
            id,
            nom,
            prenom,
            telephone,
            ville,
            cellule_id,
            cellules (cellule, responsable)
          `)
          .not("cellule_id", "is", null);

        // 🔹 Si ce n'est pas un admin, filtre par cellule
        if (profile.role === "ResponsableCellule") {
          // Récupère la cellule du responsable
          const { data: cellule, error: celluleError } = await supabase
            .from("cellules")
            .select("id")
            .eq("responsable_id", user.id)
            .single();

          if (celluleError) throw celluleError;

          query = query.eq("cellule_id", cellule.id);
        }

        const { data: membresData, error: membresError } = await query;

        if (membresError) throw membresError;

        setMembres(membresData || []);
      } catch (err) {
        console.error("Erreur récupération membres :", err);
        setErrorMsg("Impossible de récupérer les membres");
      } finally {
        setLoading(false);
      }
    };

    fetchMembres();
  }, [user]);

  if (loading) return <p className="text-center mt-10">Chargement...</p>;
  if (errorMsg) return <p className="text-center mt-10 text-red-600">{errorMsg}</p>;
  if (membres.length === 0)
    return <p className="text-center text-gray-600 mt-10">Aucun membre assigné à une cellule.</p>;

  return (
    <div className="p-6 min-h-screen bg-gradient-to-b from-indigo-100 to-indigo-50">
      <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
        👥 Membres des Cellules
      </h2>

      <div className="overflow-x-auto bg-white rounded-3xl shadow-2xl p-6">
        <table className="min-w-full text-sm">
          <thead className="bg-indigo-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Nom complet</th>
              <th className="py-3 px-4 text-left">Téléphone</th>
              <th className="py-3 px-4 text-left">Ville</th>
              <th className="py-3 px-4 text-left">Cellule</th>
            </tr>
          </thead>
          <tbody>
            {membres.map((membre) => (
              <tr key={membre.id} className="border-b hover:bg-indigo-50 transition-all">
                <td className="py-3 px-4 font-semibold text-gray-700">
                  {membre.nom} {membre.prenom}
                </td>
                <td className="py-3 px-4">{membre.telephone}</td>
                <td className="py-3 px-4">{membre.ville || "—"}</td>
                <td className="py-3 px-4 text-indigo-700 font-medium">
                  {membre.cellules?.cellule || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

