/* pages/index.js */
"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import supabase from "../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Pour test rapide : uniquement username
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .single();

      if (error || !data) {
        setError("Utilisateur ou mot de passe incorrect.");
        return;
      }

      // Vérification rapide du password pour test
      if (data.password !== password) {
        setError("Utilisateur ou mot de passe incorrect.");
        return;
      }

      localStorage.setItem("userId", data.id);

      // Redirection selon rôle
      router.push("/home");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la connexion.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-50 p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md flex flex-col items-center">
        {/* Titre */}
        <h1 className="text-5xl font-extrabold text-green-700 mb-3">SoulTrack</h1>

        {/* Message */}
        <p className="text-center text-gray-700 mb-6">
          Bienvenue sur la plateforme de suivi et d’accompagnement spirituel de l’église.
          <br />
          <span className="italic font-semibold mt-2 block text-green-600">
            "Aimez-vous les uns les autres comme je vous ai aimés." – Jean 13:34
          </span>
        </p>

        {/* Formulaire */}
        <form onSubmit={handleLogin} className="flex flex-col w-full gap-4">
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            className="border border-green-300 p-3 rounded-lg w-full text-center focus:outline-green-500 focus:ring-2 focus:ring-green-300 transition"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="border border-green-300 p-3 rounded-lg w-full text-center focus:outline-green-500 focus:ring-2 focus:ring-green-300 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-200"
          >
            Se connecter
          </button>
        </form>
      </div>
    </div>
  );
}
