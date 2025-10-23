// pages/login.js
"use client";

import { useState } from "react";
import { useRouter } from "next/router";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Liste des utilisateurs (en dur)
  const users = [
    {
      email: "admin@soultrack.com",
      password: "admin123",
      roles: ["Admin"],
      redirect: "/",
    },
    {
      email: "cellule@soultrack.com",
      password: "cellule123",
      roles: ["ResponsableCellule"],
      redirect: "/cellules-hub",
    },
    {
      email: "integration@soultrack.com",
      password: "integration123",
      roles: ["ResponsableIntegration"],
      redirect: "/membres-hub",
    },
    {
      email: "evangelisation@soultrack.com",
      password: "evangelisation123",
      roles: ["ResponsableEvangelisation"],
      redirect: "/evangelisation-hub",
    },
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Cherche l'utilisateur
    const user = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!user) {
      setError("Email ou mot de passe incorrect ❌");
      setLoading(false);
      return;
    }

    // Stocker les infos dans localStorage
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userRole", JSON.stringify(user.roles));

    // Redirection
    router.push(user.redirect);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-blue-50">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-blue-600 mb-6">Connexion</h1>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Adresse e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-3 w-full rounded-xl mb-4"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-3 w-full rounded-xl mb-4"
          />

          {error && <p className="text-red-600 font-semibold mb-3">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full p-3 rounded-xl transition-all duration-200"
          >
            {loading ? "Connexion..." : "Se connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
