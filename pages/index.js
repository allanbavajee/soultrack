// pages/index.js

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import LogoutLink from "../components/LogoutLink";
import AccessGuard from "../components/AccessGuard";

export default function HomePage() {
  const [roles, setRoles] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const storedRoles = localStorage.getItem("userRole");
    if (storedRoles) {
      try {
        const parsed = JSON.parse(storedRoles);
        setRoles(Array.isArray(parsed) ? parsed : [parsed]);
      } catch {
        setRoles([storedRoles]);
      }
    }
  }, []);

  const hasRole = role => roles.includes(role);
  const redirect = path => router.push(path);

  return (
    <AccessGuard>
      <div className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center"
           style={{ background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)" }}>
        <div className="absolute top-4 right-4"><LogoutLink /></div>
        <div className="mb-4">
          <Image src="/logo.png" alt="SoulTrack Logo" width={90} height={90} />
        </div>
        <h1 className="text-5xl font-handwriting text-white mb-2">SoulTrack</h1>
        <p className="text-white text-lg max-w-2xl mb-8">
          Chaque personne a une valeur infinie. Ensemble, nous avançons, nous grandissons,
          et nous partageons l’amour de Christ dans chaque action ❤️
        </p>

        <div className="flex flex-col md:flex-row flex-wrap gap-4 justify-center items-center w-full max-w-4xl mb-10">
          {(hasRole("ResponsableIntegration") || hasRole("Admin")) &&
            <Card emoji="👤" text="Suivis des membres" color="blue" onClick={() => redirect("/membres-hub")} />}
          {(hasRole("ResponsableEvangelisation") || hasRole("Admin")) &&
            <Card emoji="🙌" text="Évangélisation" color="green" onClick={() => redirect("/evangelisation-hub")} />}
          {(hasRole("ResponsableCellule") || hasRole("Admin")) &&
            <Card emoji="🏠" text="Cellule" color="purple" onClick={() => redirect("/cellules-hub")} />}
          {hasRole("Admin") &&
            <>
              <Card emoji="📊" text="Rapport" color="red" onClick={() => redirect("/rapport")} />
              <Card emoji="🧑‍💻" text="Admin" color="blue" onClick={() => redirect("/administrateur")} />
            </>
          }
        </div>

        <div className="text-white text-lg max-w-2xl">
          Car le corps ne se compose pas d’un seul membre, mais de plusieurs. <br />
          1 Corinthiens 12:14 ❤️
        </div>
      </div>
    </AccessGuard>
  );
}

function Card({ emoji, text, color, onClick }) {
  const borderColor = colorMap(color);
  return (
    <div className={`flex-1 min-w-[250px] w-full h-32 bg-white rounded-2xl shadow-md flex flex-col justify-center items-center border-t-4 ${borderColor} p-3 hover:shadow-lg transition-all duration-200 cursor-pointer`}
         onClick={onClick}>
      <div className="text-4xl mb-1">{emoji}</div>
      <div className="text-lg font-bold text-gray-800">{text}</div>
    </div>
  );
}

function colorMap(color) {
  switch(color) {
    case "blue": return "border-blue-500";
    case "green": return "border-green-500";
    case "purple": return "border-purple-500";
    case "red": return "border-red-500";
    default: return "border-gray-500";
  }
}

