//pages/login.js

"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import supabase from "../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e) {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    console.log("Tentative de login :", email, password);

    const { data, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      console.error("Erreur de connexion Supabase :", loginError);
      setError("Email ou mot de passe incorrect ❌");
      return;
    }

    const user = data.user;

    console.log("✅ Connexion réussie :", user);

    // 🔁 Récupère le profil depuis la table "profiles"
    const { data: profileData } = await supabase
      .from("profiles")
      .select("nom, prenom, roles, role")
      .eq("id", user.id)
      .single();

    if (!profileData) {
      setError("Profil utilisateur introuvable ❌");
      return;
    }

    // ✅ Stocke dans localStorage
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userName", `${profileData.prenom || ""} ${profileData.nom || ""}`.trim());
    localStorage.setItem("userRole", JSON.stringify(profileData.roles || [profileData.role || "Membre"]));

    console.log("✅ Rôle détecté :", profileData.roles);

    // 🔀 Redirection selon rôle
    let redirectPath = "/index"; // défaut
    if (profileData.roles?.includes("Admin")) redirectPath = "/index";
    else if (profileData.roles?.includes("ResponsableCellule")) redirectPath = "/cellules-hub";
    else if (profileData.roles?.includes("ResponsableIntegration")) redirectPath = "/membres-hub";
    else if (profileData.roles?.includes("ResponsableEvangelisation")) redirectPath = "/evangelisation-hub";

    console.log("🔀 Redirection vers :", redirectPath);
    router.push(redirectPath);

  } catch (err) {
    console.error("Erreur de connexion :", err);
    setError("Erreur interne ❌");
  } finally {
    setLoading(false);
  }
}


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-900">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-800">Connexion</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              required
            />
          </div>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2 rounded-lg font-semibold transition"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}


