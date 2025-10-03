/* pages/login.js */
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

      // Rediriger vers la vraie page index
      router.push("/home");
    } catch (err) {
      console.error(err);
      setError("Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-3xl shadow-lg flex flex-col gap-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center">Connexion SoulTrack</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded-xl px-4 py-2 w-full"
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded-xl px-4 py-2 w-full"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-2xl transition-all duration-200"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>

        {error && <p className="text-red-500 text-center">{error}</p>}
      </form>
    </div>
  );
}
