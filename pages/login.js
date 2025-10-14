"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import supabase from "../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔁 Si déjà connecté → redirige
  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role) router.replace("/");
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1️⃣ Cherche le profil
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .single();

      if (profileError || !profile) {
        setError("Utilisateur introuvable.");
        setLoading(false);
        return;
      }

      // 2️⃣ Vérifie le mot de passe (via la fonction SQL personnalisée)
      const { data: checkPassword, error: rpcError } = await supabase.rpc(
        "verify_password",
        {
          p_password: password,
          p_hash: profile.password_hash,
        }
      );

      if (rpcError) {
        console.error("Erreur RPC verify_password:", rpcError);
        setError("Erreur lors de la vérification du mot de passe.");
        setLoading(false);
        return;
      }

      const verified =
        Array.isArray(checkPassword) &&
        checkPassword[0] &&
        checkPassword[0].verify === true;

      if (!verified) {
        setError("Mot de passe incorrect.");
        setLoading(false);
        return;
      }

      // 3️⃣ Stocke les infos utilisateur
      const role = profile.role?.trim() || "Membre";
      localStorage.setItem("userId", profile.id);
      localStorage.setItem("userRole", role);

      // 4️⃣ Redirection
      router.replace("/");
    } catch (err) {
      console.error("Erreur inattendue:", err);
      setError("Erreur inattendue. Vérifie ta console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-yellow-50 to-blue-100 p-6">
      <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-md flex flex-col items-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Connexion 🔐</h1>

        <form onSubmit={handleLogin} className="flex flex-col w-full gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-full text-center"
            required
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-full text-center"
            required
          />

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg shadow-md"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
