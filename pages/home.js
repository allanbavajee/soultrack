/* pages/home.js */
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

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      router.push("/"); // pas connecté → login
      return;
    }

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (!error && data) setProfile(data);
      setLoadingProfile(false);
    };

    fetchProfile();
  }, [router]);

  if (loadingProfile) {
    return <p className="text-center mt-10 text-gray-600">Chargement du profil...</p>;
  }

  if (!profile) {
    return (
      <div className="text-center mt-10 text-red-500">
        Profil introuvable. Connecte-toi.
        <br />
        <a href="/" className="text-green-600 font-bold underline mt-2 inline-block">
          Retour à la connexion
        </a>
      </div>
    );
  }

  const cards = [];

  if (profile.role === "ResponsableIntegration" || profile.role === "Admin") {
    cards.push({
      href: "/membres-hub",
      icon: "👤",
      label: "Suivis des membres",
      borderColor: "border-blue-500",
    });
  }

  if (profile.role === "ResponsableEvangelisation" || profile.role === "Admin") {
    cards.push({
      href: "/evangelisation-hub",
      icon: "🙌",
      label: "Évangélisation",
      borderColor: "border-green-500",
    });
  }

  if (profile.role === "Admin") {
    cards.push({
      href: "/rapport",
      icon: "📊",
      label: "Rapport",
      borderColor: "border-red-500",
    });

    cards.push({
      href: "/admin/creation-utilisateur",
      icon: "👤➕",
      label: "Créer un utilisateur",
      borderColor: "border-cyan-500",
    });
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-between p-6 gap-2"
      style={{ background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)" }}
    >
      {/* Logo */}
      <div className="mt-1">
        <Image src="/logo.png" alt="SoulTrack Logo" width={80} height={80} />
      </div>

      {/* Titre SoulTrack */}
      <h1 className="text-5xl sm:text-5xl font-handwriting text-white text-center mt-1">
        SoulTrack
      </h1>

      {/* Message en dessous du titre */}
      <div className="mt-1 mb-2 text-center text-white text-lg font-handwriting-light">
        Chaque personne a une valeur infinie. Ensemble, nous avançons, nous grandissons, et nous partageons l’amour de Christ dans chaque action ❤️
      </div>

      {/* Cartes principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 w-full max-w-5xl mt-2">
        {cards.map((card, index) => (
          <Link key={index} href={card.href} className="w-full">
            <div
              className={`w-full h-28 bg-white rounded-2xl shadow-md flex flex-col justify-center items-center p-3 hover:shadow-lg transition-all duration-200 cursor-pointer border-t-4 ${card.borderColor}`}
            >
              <div className="text-4xl mb-1">{card.icon}</div>
              <div className="text-lg font-bold text-gray-800 text-center">{card.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Boutons avec popup */}
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
            buttonColor="from-[#00C9FF] to-[#92FE9D]"
          />
        )}
      </div>

      {/* Message final */}
      <div className="mt-2 mb-2 text-center text-white text-lg font-handwriting-light">
        Car le corps ne se compose pas d’un seul membre, mais de plusieurs. 1 Corinthiens 12:14 ❤️
      </div>
    </div>
  );
}
