// pages/login.js
"use client";

import { useState } from "react";
import supabase from "../lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const emailTrimmed = email.trim().toLowerCase();
      const passwordTrimmed = password.trim();

      const { data, error: rpcError } = await supabase
        .rpc("verify_password", {
          p_email: emailTrimmed,
          p_password: passwordTrimmed,
        })
        .single();

      if (rpcError || !data) {
        console.error("Erreur RPC :", rpcError);
        setError("Mot de passe incorrect ❌");
        setLoading(false);
        return;
      }

      const userRoles =
        data.roles && data.roles.length > 0
          ? data.roles.map((r) => r.trim())
          : [data.role?.trim() || "Membre"];

      localStorage.setItem("userRole", JSON.stringify(userRoles));
      localStorage.setItem("userEmail", data.email);

      setSuccess("Connexion réussie ✅");
      setTimeout(() => {
        window.location.href = "/index";
      }, 1200);
    } catch (err) {
      console.error("Erreur de connexion :", err);
      setError("❌ Une erreur est survenue lors de la connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-yellow-50 to-blue-100 p-6">
      <div className="relative bg-white p-10 rounded-3xl shadow-lg w-full max-w-md flex flex-col items-center">

        {/* 🔔 Alertes visuelles */}
        {(error || success) && (
          <div
            className={`absolute top-4 left-1/2 transform -translate-x-1/2 px-4 py-2 rounded-lg text-white font-medium shadow-md transition-all duration-300 ${
              error
                ? "bg-red-500 animate-shake"
                : "bg-green-500 animate-fade-in"
            }`}
          >
            {error || success}
          </div>
        )}

        {/* Logo + titre */}
        <h1 className="text-5xl font-handwriting text-black-800 mb-3 flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
          <img
            src="/logo.png"
            alt="Logo SoulTrack"
            className="w-12 h-12 object-contain"
          />
          SoulTrack
        </h1>

        {/* Message de bienvenue */}
        <p className="text-center text-gray-700 mb-6">
          Bienvenue sur SoulTrack !<br />
          Une plateforme pour garder le contact, organiser les visites,
          et soutenir chaque membre dans sa vie spirituelle.
        </p>

        {/* Formulaire */}
        <form onSubmit={handleLogin} className="flex flex-col w-full gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-full text-center shadow-sm focus:outline-green-500 focus:ring-2 focus:ring-green-200 transition"
            required
            autoComplete="email"
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-full text-center shadow-sm focus:outline-green-500 focus:ring-2 focus:ring-green-200 transition"
            required
            autoComplete="current-password"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white font-bold py-3 rounded-2xl shadow-md transition-all duration-200"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>

          {/* 🔹 Lien mot de passe oublié */}
          <p className="text-center text-sm text-gray-600 hover:text-green-600 transition mt-2 cursor-pointer">
            <a href="/forgot-password">Mot de passe oublié ?</a>
          </p>
        </form>

        {/* Verset */}
        <p className="text-center italic font-semibold mt-4 text-green-600">
          "Aimez-vous les uns les autres comme je vous ai aimés." – Jean 13:34
        </p>

        {/* ✅ Animations pour les toasts */}
        <style jsx>{`
          @keyframes shake {
            0%, 100% { transform: translate(-50%, 0); }
            20%, 60% { transform: translate(-50%, -3px); }
            40%, 80% { transform: translate(-50%, 3px); }
          }
          .animate-shake {
            animation: shake 0.4s ease-in-out;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, -10px); }
            to { opacity: 1; transform: translate(-50%, 0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.5s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
}
