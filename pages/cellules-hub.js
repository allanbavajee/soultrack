//pages/cellules-hub.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import supabase from "../lib/supabaseClient";
import AccessGuard from "../components/AccessGuard";

export default function CellulesHub() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifie la session actuelle
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login"); // pas de session => redirection
      } else {
        setSession(data.session);
      }
      setLoading(false);
    };

    checkSession();

    // Écoute les changements d'auth (connexion/déconnexion)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace("/login");
      else setSession(session);
    });

    // Nettoyage
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-lg">
        Vérification de la session...
      </div>
    );
  }

  if (!session) return null; // évite le flash avant redirection

  return (
    <div className="min-h-screen bg-blue-50 p-6">
      <h1 className="text-3xl font-bold text-blue-800 mb-4">
        Tableau de bord — Cellules Hub
      </h1>

      <p className="text-gray-700 mb-6">
        Bienvenue, <strong>{session.user.email}</strong> 👋
      </p>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="font-semibold text-xl mb-2 text-blue-700">Gestion des Cellules</h2>
          <p>Créez, modifiez et suivez les cellules.</p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="font-semibold text-xl mb-2 text-blue-700">Suivi des Membres</h2>
          <p>Consultez les membres rattachés à chaque cellule.</p>
        </div>

        <div className="bg-white p-4 rounded-2xl shadow">
          <h2 className="font-semibold text-xl mb-2 text-blue-700">Rapports & Statistiques</h2>
          <p>Visualisez les performances des cellules.</p>
        </div>
      </div>
    </div>
  );
}
