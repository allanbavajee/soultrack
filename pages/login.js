//pages/login.js
"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import supabase from "../lib/supabaseClient";
import AccessGuard from "../components/AccessGuard";

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

      // 🔹 Vérification via ta fonction RPC
      const { data, error: rpcError } = await supabase.rpc("verify_password", {
        user_email: email,
        user_password: password,
      });

      if (rpcError) {
        console.error("Erreur Supabase :", rpcError);
        throw new Error("Erreur interne Supabase");
      }

      const user = data?.[0];
      if (!user) {
        setError("Email ou mot de passe incorrect ❌");
        return;
      }

      // ✅ Stockage des infos utilisateur
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userName", `${user.prenom || ""} ${user.nom || ""}`.trim());
      localStorage.setItem("userRole", JSON.stringify(user.roles || [user.role || "Membre"]));

      const roles = user.roles || [user.role || "Membre"];
      const firstRole = roles[0];
      console.log("✅ Rôle détecté :", firstRole);

      // 🔁 Redirection selon le rôle
      let redirectUrl = "/index"; // par défaut

      switch (firstRole) {
        case "Admin":
          redirectUrl = "/index";
          break;

        case "ResponsableIntegration":
          redirectUrl = "/membres-hub";
          break;

        case "ResponsableEvangelisation":
          redirectUrl = "/evangelisation-hub";
          break;

        case "ResponsableCellule":
          // ✅ Redirection vers la page principale du responsable de cellule
          redirectUrl = "/cellules-hub";
          break;

        case "Membre":
        default:
          redirectUrl = "/index";
          break;
      }

      console.log("🔀 Redirection vers :", redirectUrl);

      // 🧠 Nouvelle méthode : attendre un petit instant avant navigation
      setTimeout(() => {
        router.push(redirectUrl);
      }, 200);
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
