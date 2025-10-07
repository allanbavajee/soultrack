// pages/home.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Exemple d'utilisateurs "pré-créés"
  const users = [
    {
      id: "admin1",
      email: "soultrackadmin@soultrack.org",
      password: "@lterEg0",
      role: "Admin",
      name: "Admin"
    },
    // tu peux ajouter d'autres utilisateurs ici
  ];

  useEffect(() => {
    // Vérifier si l'utilisateur est déjà connecté
    const storedProfile = localStorage.getItem("profile");
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }
    setLoading(false);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError("");

    const user = users.find(
      (u) => u.email === loginEmail && u.password === loginPassword
    );

    if (!user) {
      setLoginError("Email ou mot de passe incorrect");
      return;
    }

    // Stocker le profil dans localStorage
    localStorage.setItem("profile", JSON.stringify(user));
    setProfile(user);
  };

  const handleLogout = () => {
    localStorage.removeItem("profile");
    setProfile(null);
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Chargement...</p>;
  }

  // Affichage du login si pas connecté
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-yellow-50 to-blue-100 p-6">
        <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-md flex flex-col items-center">
          <h1 className="text-5xl font-handwriting text-black-800 mb-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <img src="/logo.png" alt="Logo SoulTrack" className="w-12 h-12 object-contain" />
            SoulTrack
          </h1>

          <p className="text-center text-gray-700 mb-6">
            Connectez-vous pour accéder à SoulTrack
          </p>

          <form onSubmit={handleLogin} className="flex flex-col w-full gap-4">
            <input
              type="email"
              placeholder="Email"
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg w-full text-center shadow-sm focus:outline-green-500 focus:ring-2 focus:ring-green-200 transition"
              required
            />

            <input
              type="password"
              placeholder="Mot de passe"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg w-full text-center shadow-sm focus:outline-green-500 focus:ring-2 focus:ring-green-200 transition"
              required
            />

            {loginError && <p className="text-red-500 text-center">{loginError}</p>}

            <button
              type="submit"
              className="bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white font-bold py-3 rounded-2xl shadow-md transition-all duration-200"
            >
              Se connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Affichage de la page Home si connecté
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between p-6 gap-2"
      style={{ background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)" }}
    >
      {/* Header */}
      <div className="flex w-full justify-between items-center">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="SoulTrack Logo" width={80} height={80} />
          <h1 className="text-5xl sm:text-5xl font-handwriting text-white">SoulTrack</h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-semibold"
        >
          Déconnexion
        </button>
      </div>

      {/* Message d'accueil */}
      <p className="mt-4 mb-6 text-center text-white text-lg font-handwriting-light max-w-3xl">
        Chaque personne a une valeur infinie. Ensemble, nous avançons, nous grandissons, et nous partageons l’amour de Christ dans chaque action ❤️
      </p>

      {/* Cartes principales */}
      <div className="flex flex-col md:flex-row flex-wrap gap-3 justify-center w-full max-w-5xl mt-2">
        {(profile.role === "ResponsableIntegration" || profile.role === "Admin") && (
          <Link href="/membres-hub" className="flex-1 min-w-[250px]">
            <div className="w-full h-28 bg-white rounded-2xl shadow-md flex flex-col justify-center items-center border-t-4 border-blue-500 p-3 hover:shadow-lg transition-all duration-200 cursor-pointer">
              <div className="text-4xl mb-1">👤</div>
              <div className="text-lg font-bold text-gray-800 text-center">
                Suivis des membres
              </div>
            </div>
          </Link>
        )}

        {(profile.role === "ResponsableEvangelisation" || profile.role === "Admin") && (
          <Link href="/evangelisation-hub" className="flex-1 min-w-[250px]">
            <div className="w-full h-28 bg-white rounded-2xl shadow-md flex flex-col justify-center items-center border-t-4 border-green-500 p-3 hover:shadow-lg transition-all duration-200 cursor-pointer">
              <div className="text-4xl mb-1">🙌</div>
              <div className="text-lg font-bold text-gray-800 text-center">
                Évangélisation
              </div>
            </div>
          </Link>
        )}

        {profile.role === "Admin" && (
          <>
            <Link href="/rapport" className="flex-1 min-w-[250px]">
              <div className="w-full h-28 bg-white rounded-2xl shadow-md flex flex-col justify-center items-center border-t-4 border-red-500 p-3 hover:shadow-lg transition-all duration-200 cursor-pointer">
                <div className="text-4xl mb-1">📊</div>
                <div className="text-lg font-bold text-gray-800 text-center">Rapport</div>
              </div>
            </Link>

            <Link href="/admin/creation-utilisateur" className="flex-1 min-w-[250px]">
              <div className="w-full h-28 bg-white rounded-2xl shadow-md flex flex-col justify-center items-center border-t-4 border-blue-400 p-3 hover:shadow-lg transition-all duration-200 cursor-pointer">
                <div className="text-4xl mb-1">🧑‍💻</div>
                <div className="text-lg font-bold text-gray-800 text-center">
                  Créer un utilisateur
                </div>
              </div>
            </Link>
          </>
        )}
      </div>

      <div className="mt-4 mb-4 text-center text-white text-lg font-handwriting-light">
        Car le corps ne se compose pas d’un seul membre, mais de plusieurs. 1 Corinthiens 12:14 ❤️
      </div>
    </div>
  );
}
