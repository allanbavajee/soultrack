//pages/loign.js
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
      // 🔹 Appel à la fonction Postgres verify_password
      const { data, error: rpcError } = await supabase.rpc("verify_password", {
        p_email: email,
        p_password: password,
      });

      if (rpcError) throw rpcError;
      if (!data || data.length === 0) {
        setError("Email ou mot de passe incorrect.");
        setLoading(false);
        return;
      }

      const user = data[0];

      // ✅ Normalisation des rôles
      const roles =
        Array.isArray(user.roles) && user.roles.length > 0
          ? user.roles
          : user.role
          ? [user.role]
          : [];

      // ✅ Stockage cohérent dans localStorage
      const profileToStore = {
        id: user.id,
        email: user.email,
        role: user.role || (roles.length > 0 ? roles[0] : null),
        roles,
      };

      localStorage.setItem("userProfile", JSON.stringify(profileToStore));
      localStorage.setItem("userRole", JSON.stringify(roles));
      localStorage.setItem("userEmail", user.email);

      console.log("✅ Utilisateur connecté :", profileToStore);

      // ✅ Redirection selon rôle
      if (roles.includes("Admin")) {
        router.push("/administrateur");
      } else if (roles.includes("ResponsableIntegration")) {
        router.push("/integration");
      } else if (roles.includes("ResponsableCellule")) {
        router.push("/cellules-hub");
      } else if (roles.includes("ResponsableEvangelisation")) {
        router.push("/evangelisation");
      } else {
        router.push("/login"); // fallback
      }
    } catch (err) {
      console.error("Erreur lors du login :", err);
      setError("Une erreur est survenue lors de la connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6"
      style={{ background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)" }}
    >
      <h1 className="text-4xl font-bold text-white mb-6">Connexion</h1>

      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md flex flex-col gap-4"
      >
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold rounded-xl py-2 hover:opacity-90 transition"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
