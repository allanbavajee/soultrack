"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import supabase from "../lib/supabaseClient";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 🔹 Authentification Supabase
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      const user = data.user;

      if (!user) {
        throw new Error("Utilisateur introuvable.");
      }

      // 🔹 Récupération des rôles depuis la table 'profils' (ou la table où tu stockes les rôles)
      const { data: userData, error: userError } = await supabase
        .from("profils") // <-- assure-toi que c’est bien le nom de ta table
        .select("role, roles")
        .eq("id", user.id)
        .single();

      if (userError) throw userError;

      const userRoles = userData?.roles || [userData?.role || "Membre"];
      localStorage.setItem("userRole", JSON.stringify(userRoles));

      // 🔹 Définir la redirection selon le rôle
      const mainRedirect = {
        Admin: "/index",
        ResponsableIntegration: "/membres-hub",
        ResponsableEvangelisation: "/evangelisation-hub",
        ResponsableCellule: "/cellules-hub",
        Membre: "/index",
      };

      const firstRole = userRoles[0];
      const redirectPath = mainRedirect[firstRole] || "/index";

      router.push(redirectPath);
    } catch (err) {
      console.error("Erreur de connexion :", err);
      setError(err.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-white mb-6">Connexion</h1>

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-300 text-sm mb-2">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <p className="text-red-400 text-sm text-center mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition disabled:opacity-50"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
