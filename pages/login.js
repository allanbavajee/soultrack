// pages/login.js

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import supabase from "../lib/supabaseClient";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    // Charger la liste des utilisateurs pour test/affichage
    const loadProfiles = async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) console.error("Erreur chargement profiles:", error.message);
      else setProfiles(data);
    };
    loadProfiles();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // ✅ Vérifier l'utilisateur dans la table "profiles"
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .single();

      if (error || !data) {
        setError("Mot de passe incorrect ❌");
        setLoading(false);
        return;
      }

      // ✅ Vérifier le mot de passe (hashé dans la table)
      const validPassword = await verifyPassword(password, data.password);
      if (!validPassword) {
        setError("Mot de passe incorrect ❌");
        setLoading(false);
        return;
      }

      // ✅ Sauvegarder dans localStorage
      localStorage.setItem("user", JSON.stringify(data));
      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setError("Une erreur est survenue ❌");
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour vérifier le mot de passe hashé en local
  async function verifyPassword(plain, hash) {
    const response = await fetch("/api/verifyPassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plain, hash }),
    });
    const result = await response.json();
    return result.valid;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-blue-600">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Connexion 🔐</h1>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Mot de passe"
            className="w-full border p-3 rounded mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-red-500 text-center mb-3 font-semibold">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>

      {/* Petit debug - liste des profils */}
      <div className="mt-8 text-white">
        <h2 className="font-semibold mb-2">Utilisateurs enregistrés :</h2>
        {profiles.length > 0 ? (
          <ul>
            {profiles.map((p) => (
              <li key={p.id}>
                {p.email} — {p.role}
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun utilisateur trouvé</p>
        )}
      </div>
    </div>
  );
}

