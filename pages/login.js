// ✅ /pages/login.js
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import supabase from "../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) router.replace("/");
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log("🔍 Étape 1 : recherche de l'utilisateur...");
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .single();

      console.log("✅ Résultat profile :", profile, profileError);

      if (profileError || !profile) {
        setError("Utilisateur introuvable");
        setLoading(false);
        return;
      }

      console.log("🔍 Étape 2 : vérification du mot de passe...");
      const { data: checkPassword, error: rpcError } = await supabase.rpc(
        "verify_password",
        {
          p_password: password,
          p_hash: profile.password_hash,
        }
      );

      console.log("✅ Résultat verify_password :", checkPassword, rpcError);

      if (rpcError) {
        setError("Erreur SQL RPC : " + rpcError.message);
        setLoading(false);
        return;
      }

      const verified =
        Array.isArray(checkPassword) &&
        checkPassword.length > 0 &&
        checkPassword[0].verify === true;

      if (!verified) {
        setError("Mot de passe incorrect");
        setLoading(false);
        return;
      }

      console.log("✅ Étape 3 : authentification réussie !");
      const role = (profile.role || "Membre").trim().toLowerCase();
      const formattedRole =
        role === "admin"
          ? "Admin"
          : role === "responsableintegration"
          ? "ResponsableIntegration"
          : role.includes("évang")
          ? "ResponsableEvangelisation"
          : "Membre";

      localStorage.setItem("userId", profile.id);
      localStorage.setItem("userRole", formattedRole);

      console.log("🎉 Connexion réussie, redirection vers /");
      router.replace("/");
    } catch (err) {
      console.error("❌ Erreur inattendue :", err);
      setError("Erreur inattendue : " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-yellow-50 to-blue-100 p-6">
      <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-md flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-6 text-green-700">Connexion</h1>

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
