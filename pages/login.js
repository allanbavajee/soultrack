"use client";

import { useState } from "react";
import supabase from "../lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !data.user) {
      setError("❌ Email ou mot de passe incorrect.");
      setLoading(false);
      return;
    }

    console.log("✅ Login réussi, utilisateur :", data.user.email);

    // ⚡ Redirection brute (aucun routeur, aucun cache)
    window.location.assign(`${window.location.origin}/`);
  };

  return (
    <div style={{ display: "flex", height: "100vh", justifyContent: "center", alignItems: "center" }}>
      <form onSubmit={handleLogin} style={{ background: "white", padding: 30, borderRadius: 10, boxShadow: "0 0 10px #ccc" }}>
        <h1>Connexion simple</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ display: "block", marginBottom: 10, padding: 8 }}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ display: "block", marginBottom: 10, padding: 8 }}
        />
        <button type="submit" disabled={loading} style={{ width: "100%", padding: 8, background: "blue", color: "white" }}>
          {loading ? "Connexion..." : "Se connecter"}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}
