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
      // Récupérer le profil par username et password
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username)
        .eq("password", password) // Assure-toi que le champ password existe
        .single();

      if (error || !data) {
        setError("Utilisateur ou mot de passe incorrect.");
        return;
      }

      // Stocker l'ID pour session
      localStorage.setItem("userId", data.id);

      // Redirection selon le rôle
      if (data.role === "Admin") {
        router.push("/home");
      } else if (data.role === "ResponsableIntegration" || data.role === "ResponsableEvangelisation") {
        router.push("/home");
      } else {
        setError("Profil non autorisé.");
      }
    } catch (err) {
      console.error(err);
      setError("Erreur lors de la connexion.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-3xl shadow-lg w-full max-w-md flex flex-col items-center">
        {/* Titre */}
        <h1 className="text-4xl font-bold text-gray-800 mb-2">SoulTrack</h1>

        {/* Message de bienvenue */}
        <p className="text-center text-gray-600 mb-4">
          Bienvenue sur la plateforme de suivi et d’accompagnement spirituel de l’église.
          <br />
          <span className="italic font-semibold mt-2 block">
            "Aimez-vous les uns les autres comme je vous ai aimés." – Jean 13:34
          </span>
        </p>

        {/* Formulaire login */}
        <form onSubmit={handleLogin} className="flex flex-col w-full gap-4 mt-4">
          <input
            type="text"
            placeholder="Nom d'utilisateur"
            className="border p-3 rounded-lg w-full text-center focus:outline-green-500"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Mot de passe"
            className="border p-3 rounded-lg w-full text-center focus:outline-green-500"
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
