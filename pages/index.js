"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import supabase from "../lib/supabaseClient";
import SendLinkPopup from "../components/SendLinkPopup";

export default function HomePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [error, setError] = useState(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // Vérifier si l'utilisateur est déjà connecté
  useEffect(() => {
    const storedUser = localStorage.getItem("userId");
    if (storedUser) {
      // Récupérer le profil depuis Supabase
      supabase
        .from("profiles")
        .select("*")
        .eq("id", storedUser)
        .single()
        .then(({ data, error }) => {
          if (!error && data) setProfile(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoggingIn(true);
    setError(null);

    try {
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", loginEmail)
        .single();

      if (error || !profileData) {
        setError("Utilisateur introuvable");
        setLoggingIn(false);
        return;
      }

      // Vérification mot de passe simple côté Next.js
      if (profileData.password !== loginPassword) {
        setError("Mot de passe incorrect");
        setLoggingIn(false);
        return;
      }

      localStorage.setItem("userId", profileData.id);
      setProfile(profileData);
    } catch (err) {
      console.error(err);
      setError("Erreur inattendue");
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userId");
    setProfile(null);
  };

  if (loading) {
    return <p className="text-center mt-10 text-gray-600">Chargement…</p>;
  }

  // Si pas connecté → afficher login
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-yellow-50 to-blue-100 p-6">
        <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-md flex flex-col items-center">
          <h1 className="text-5xl font-handwriting text-black-800 mb-3 flex flex-col sm:flex-row items-center justify-center gap-3">
            <img
              src="/logo.png"
              alt="Logo SoulTrack"
              className="w-12 h-12 object-contain"
            />
            SoulTrack
          </h1>

          <p className="text-center text-gray-700 mb-6">
            Bienvenue sur SoulTrack !<br />
            Connectez-vous pour accéder à vos membres et outils.
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

            {error && <p className="text-red-500 text-center">{error}</p>}

            <button
              type="submit"
              disabled={loggingIn}
              className="bg-gradient-to-r from-green-400 to-blue-400 hover:from-green-500 hover:to-blue-500 text-white font-bold py-3 rounded-2xl shadow-md transition-all duration-200"
            >
              {loggingIn ? "Connexion…" : "Se connecter"}
            </button>
          </form>

          <p className="text-center italic font-semibold mt-4 text-green-600">
            "Aimez-vous les uns les autres comme je vous ai aimés." – Jean 13:34
          </p>
        </div>
      </div>
    );
  }

  // Si connecté → afficher Home
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between p-6 gap-2"
      style={{ background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)" }}
    >
      <div className="flex w-full justify-between items-center mb-2">
        <div className="flex items-center gap-2">
          <Image src="/logo.png" alt="SoulTrack Logo" width={60} height={60} />
          <h1 className="text-3xl font-handwriting text-white">SoulTrack</h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 rounded-lg"
        >
          Déconnexion
        </button>
      </div>

      <div className="text-center text-white text-lg font-handwriting-light mb-4">
        Chaque personne a une valeur infinie. Ensemble, nous avançons, grandissons et partageons
        l’amour de Christ dans chaque action ❤️
      </div>

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
