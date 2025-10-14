"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import supabase from "../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("🚀 Connexion pour :", email);

      // 1️⃣ Récupère le profil par email
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .single();

      if (profileError || !profile) {
        setError("Utilisateur introuvable");
        setLoading(false);
        return;
      }

      // 2️⃣ Vérifie le mot de passe avec la fonction RPC
      const { data: result, error: rpcError } = await supabase.rpc(
        "verify_password",
        {
          p_password: password,
          p_hash: profile.password_hash,
        }
      );

      if (rpcError) {
        console.error("Erreur RPC:", rpcError);
        setError("Erreur de vérification du mot de passe");
        setLoading(false);
        return;
      }

      const verified =
        Array.isArray(result) &&
        result[0] &&
        result[0].verify === true;

      if (!verified) {
        setError("Mot de passe incorrect");
        setLoading(false);
        return;
      }

      // 3️⃣ Enregistre les infos dans localStorage
      const formattedRole =
        profile.role?.toLowerCase() === "admin"
          ? "Admin"
          : profile.role?.toLowerCase() === "responsableintegration"
          ? "ResponsableIntegration"
          : profile.role?.toLowerCase().includes("evangelisation")
          ? "ResponsableEvangelisation"
          : "Membre";

      localStorage.setItem("userId", profile.id);
      localStorage.setItem("userRole", formattedRole);

      // 4️⃣ Message + redirection
      alert("✅ FORMULAIRE SOUMIS !");
      router.push("/");
    } catch (err) {
      console.error("Erreur inattendue :", err);
      setError("Erreur inattendue, réessaye plus tard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-yellow-50 to-blue-100 p-6">
      <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-md flex flex-col items-center">
        <h1 className="text-4xl font-handwriting text-gray-800 mb-3 flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="w-10 h-10" />
          SoulTrack
        </h1>

        <form onSubmit={handleLogin} className="flex flex-col w-full gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg text-center"
            required
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg text-center"
            required
          />

          {error && <p className="text-red-500 text-center">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-green-400 to-blue-400 text-white font-bold py-3 rounded-lg shadow-md hover:opacity-90 transition"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
