// pages/login.js

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

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const emailTrimmed = email.trim().toLowerCase();
      const passwordTrimmed = password.trim();

      // 🔐 Utiliser Supabase Auth moderne
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: emailTrimmed,
        password: passwordTrimmed,
      });

      if (signInError) {
        // cas fréquent : utilisateur non confirmé, mauvais mot de passe, etc.
        console.error("Erreur signIn:", signInError);
        setError(signInError.message || "Mot de passe incorrect ❌");
        setLoading(false);
        return;
      }

      // si ok : on récupère le user id
      const user = signInData.user;
      if (!user) {
        setError("Impossible de récupérer l'utilisateur après connexion.");
        setLoading(false);
        return;
      }

      // 🔎 Récupérer le profil et rôles depuis la table profiles
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("id, email, role, roles, prenom, nom")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        // si pas de profile, fallback : créer un objet minimal
        console.warn("Profil introuvable :", profileError);
        const userRoles = ["Membre"];
        localStorage.setItem("userRole", JSON.stringify(userRoles));
        localStorage.setItem("userEmail", emailTrimmed);
        router.push("/index");
        setLoading(false);
        return;
      }

      // Normaliser rôles
      const userRoles =
        (profile.roles && profile.roles.length > 0
          ? profile.roles.map((r) => r.trim())
          : profile.role
          ? [profile.role.trim()]
          : ["Membre"]
        ).map(r => r);

      localStorage.setItem("userRole", JSON.stringify(userRoles));
      localStorage.setItem("userEmail", profile.email || emailTrimmed);
      localStorage.setItem("userProfile", JSON.stringify(profile));

      router.push("/index");
    } catch (err) {
      console.error("Erreur de connexion :", err);
      setError("❌ Une erreur est survenue lors de la connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-blue-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6">Se connecter</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        {error && <p className="mt-4 text-red-500">{error}</p>}
      </form>
    </div>
  );
}

