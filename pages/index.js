// pages/index.js
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import supabase from "../lib/supabaseClient";
import SendLinkPopup from "../components/SendLinkPopup";

export default function Home() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(null);
  const [loadingLogin, setLoadingLogin] = useState(false);

  // Vérifier si déjà connecté
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchProfile(userId);
    } else {
      setLoadingProfile(false); // pas connecté
    }
  }, []);

  const fetchProfile = async (userId) => {
    const { data: profileData, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (!error && profileData) {
      setProfile(profileData);
    }
    setLoadingProfile(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setLoadingLogin(true);

    try {
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", email)
        .single();

      if (error || !profileData) {
        setLoginError("Utilisateur introuvable");
        setLoadingLogin(false);
        return;
      }

      // Vérification du mot de passe
      const { data: checkPassword } = await supabase.rpc("verify_password", {
        p_password: password,
        p_hash: profileData.password_hash,
      });

      if (!checkPassword || checkPassword[0].verify !== true) {
        setLoginError("Mot de passe incorrect");
        setLoadingLogin(false);
        return;
      }

      localStorage.setItem("userId", profileData.id);
      setProfile(profileData);
    } catch (err) {
      console.error(err);
      setLoginError("Erreur inattendue");
    } finally {
      setLoadingLogin(false);
    }
  };

  if (loadingProfile) {
    return (
      <p className="text-center mt-10 text-gray-600">Chargement du profil...</p>
    );
  }

  // Si pas connecté → affichage login
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-yellow-50 to-blue-100 p-6">
        <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-md flex flex-col items-center">
          <h1 className="text-5xl font-handwriting text-black-800 mb-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Image src="/logo.png" alt="Logo SoulTrack" width={48} height={48} />
            SoulTrack
          </h1>
          <p className="text-center text-gray-700 mb-6">
            Bienvenue sur SoulTrack !<br />
            Connecte-toi pour accéder à la plateforme.
          </p>

          <form onSubmit={handleLogin} className="flex flex-col w-full gap-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg w-full text-center shadow-sm focus:outline-green-500 focus:ring-2 focus:ring-green-200 transition"
              required
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 p-3 rounded-lg w-full text-center shadow-sm focus:outline-green-500 focus:ring-2 focus:ring-green-200 transition"
              required
            />
            {loginError && <p className="text-red-500 text-center">{loginError}</p>}
            <button
              type="submit"
              disabled={loadingLogin}
              className="bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white font-bold py-3 rounded-2xl shadow-md transition-all duration-200"
            >
              {loadingLogin ? "Connexion..." : "Se connecter"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Si connecté → affichage Home
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between p-6 gap-2"
      style={{ background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)" }}
    >
      {/* Logo et titre */}
      <div className="mt-1">
        <Image src="/logo.png" alt="SoulTrack Logo" width={80} height={80} />
      </div>
      <h1 className="text-5xl sm:text-5xl font-handwriting text-white text-center mt-1">
        SoulTrack
      </h1>
      <div className="mt-1 mb-2 text-center text-white text-lg font-handwriting-light">
        Chaque personne a une valeur infinie. Ensemble, nous avançons, nous grandissons,
        et nous partageons l’amour de Christ dans chaque action ❤️
      </div>

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
                <div className="text-lg font-bold text-gray-800 text-center">Créer un utilisateur</div>
              </div>
            </Link>
          </>
        )}
      </div>

      {/* Popups */}
      <div className="flex flex-col gap-3 mt-4 w-full max-w-md">
        {(profile.role === "ResponsableIntegration" || profile.role === "Admin") && (
          <SendLinkPopup
            label="Envoyer l'appli – Nouveau membre"
            type="ajouter_membre"
            buttonColor="from-[#09203F] to-[#537895]"
          />
        )}
        {(profile.role === "ResponsableEvangelisation" || profile.role === "Admin") && (
          <SendLinkPopup
            label="Envoyer l'appli – Évangélisé"
            type="ajouter_evangelise"
            buttonColor="from-[#09203F] to-[#537895]"
          />
        )}
        {profile.role === "Admin" && (
          <SendLinkPopup
            label="Voir / Copier liens…"
            type="voir_copier"
            buttonColor="from-[#005AA7] to-[#FFFDE4]"
          />
        )}
      </div>

      <div className="mt-4 mb-2 text-center text-white text-lg font-handwriting-light">
        Car le corps ne se compose pas d’un seul membre, mais de plusieurs. 1 Corinthiens 12:14 ❤️
      </div>
    </div>
  );
}
