/* pages/index.js */
"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import supabase from "../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Vérifier l'utilisateur dans la table profiles
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .single();

      if (error || !profile) {
        setError("Utilisateur introuvable");
        setLoading(false);
        return;
      }

      // Vérifier le mot de passe via la fonction RPC verify_password
      const { data: checkPassword } = await supabase.rpc("verify_password", {
        p_password: password,
        p_hash: profile.password_hash,
      });

      if (!checkPassword || checkPassword[0].verify !== true) {
        setError("Mot de passe incorrect");
        setLoading(false);
        return;
      }

      // Stocker l'ID du profil dans localStorage
      localStorage.setItem("userId", profile.id);

      // Rediriger vers la page principale (home)
      router.push("/home");
    } catch (err) {
      console.error(err);
      setError("Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-green-50 p-6">
      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md flex flex-col items-center">
        {/* Titre */}
        <h1 className="text-5xl font-extrabold text-green-700 mb-3 text-center">
          SoulTrack
        </h1>

        {/* Message de bienvenue */}
        <p className="text-center text-gray-700 mb-6">
          Bienvenue sur la plateforme de suivi et d’accompagnement spirituel de l’église.
          <br />
          <span className="italic font-semibold mt-2 block text-green-600">
            "Aimez-vous les uns les autres comme je vous ai aimés." – Jean 13:34
          </span>
        </p>

        {/* Formulaire login */}
        <form onSubmit={handleLogin} className="flex flex-col w-full gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-green-300 p-3 rounded-lg w-full text-center focus:outline-green-500 focus:ring-2 focus:ring-green-300 transition"
            required
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-green-300 p-3 rounded-lg w-full text-center focus:outline-green-500 focus:ring-2 focus:ring-green-300 transition"
            required
          />

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-2xl transition-all duration-200"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
