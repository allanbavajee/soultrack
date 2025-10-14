//pages/login.js
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
    if (typeof window === "undefined") return;
    const storedRole = localStorage.getItem("userRole");
    if (storedRole) {
      console.log("🔁 Utilisateur déjà connecté → redirection vers /");
      router.replace("/");
    }
  }, [router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log("🚀 Connexion tentée pour :", email);

    try {
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .single();

      if (profileError || !profile) {
        console.error("❌ Utilisateur introuvable :", profileError);
        setError("Utilisateur introuvable");
        setLoading(false);
        return;
      }

      console.log("✅ Profil trouvé :", profile);

      const { data: checkPassword, error: rpcError } = await supabase.rpc(
        "verify_password",
        {
          p_password: password,
          p_hash: profile.password_hash,
        }
      );

      if (rpcError) {
        console.error("⚠️ Erreur RPC :", rpcError);
        setError("Erreur de vérification du mot de passe");
        setLoading(false);
        return;
      }

      const verified =
        Array.isArray(checkPassword) &&
        checkPassword[0] &&
        checkPassword[0].verify === true;

      if (!verified) {
        console.warn("❌ Mot de passe incorrect");
        setError("Mot de passe incorrect");
        setLoading(false);
        return;
      }

      console.log("✅ Mot de passe vérifié avec succès");

      const role = (profile.role || "Membre").trim().toLowerCase();
      const formattedRole =
        role === "admin"
          ? "Admin"
          : role === "responsableintegration"
          ? "ResponsableIntegration"
          : role === "responsable évangélisation" ||
            role === "responsableevangelisation"
          ? "ResponsableEvangelisation"
          : "Membre";

      localStorage.setItem("userId", profile.id);
      localStorage.setItem("userRole", formattedRole);

      console.log("💾 Données enregistrées :", {
        id: profile.id,
        role: formattedRole,
      });

      // ✅ Forçage de la redirection sûre
      setTimeout(() => {
        console.log("➡️ Redirection vers / (index.js)");
        window.location.href = "/";
      }, 500);
    } catch (err) {
      console.error("💥 Erreur inattendue :", err);
      setError("Erreur inattendue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-yellow-50 to-blue-100 p-6">
      <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-md flex flex-col items-center">
        <h1 className="text-5xl font-handwriting text-black-800 mb-3 flex flex-col sm:flex-row items-center justify-center gap-3">
          <img src="/logo.png" alt="Logo SoulTrack" className="w-12 h-12" />
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

          {error && (
            <p className="text-red-500 text-center font-semibold">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-to-r from-green-400 to-blue-400 text-white font-bold py-3 rounded-2xl shadow-md"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>

        <p className="text-center italic font-semibold mt-4 text-green-600">
          "Aimez-vous les uns les autres comme je vous ai aimés." – Jean 13:34
        </p>
      </div>
    </div>
  );
}
