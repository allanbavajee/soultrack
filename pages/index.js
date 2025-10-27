// pages/index.js
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function IndexPage() {
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    setUserEmail(email || "Inconnu");
  }, []);

  const handleRedirect = (path) => {
    router.push(path.startsWith("/") ? path : "/" + path);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 text-center space-y-6"
      style={{ background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)" }}
    >
      <h1 className="text-3xl font-bold mb-4 text-white">🏠 Page d'accueil</h1>
      <p className="text-lg mb-6 text-white">Bienvenue {userEmail}</p>

      <div className="flex flex-col md:flex-row flex-wrap gap-4 justify-center items-center w-full max-w-4xl">
        <div
          onClick={() => handleRedirect("/membres-hub")}
          className="flex-1 min-w-[250px] w-full h-32 bg-white rounded-2xl shadow-md flex flex-col justify-center items-center border-t-4 border-blue-500 p-3 hover:shadow-lg transition-all duration-200 cursor-pointer"
        >
          <div className="text-4xl mb-1">👤</div>
          <div className="text-lg font-bold text-gray-800">Suivis des membres</div>
        </div>

        <div
          onClick={() => handleRedirect("/evangelisation-hub")}
          className="flex-1 min-w-[250px] w-full h-32 bg-white rounded-2xl shadow-md flex flex-col justify-center items-center border-t-4 border-green-500 p-3 hover:shadow-lg transition-all duration-200 cursor-pointer"
        >
          <div className="text-4xl mb-1">🙌</div>
          <div className="text-lg font-bold text-gray-800">Évangélisation</div>
        </div>

        <div
          onClick={() => handleRedirect("/cellules-hub")}
          className="flex-1 min-w-[250px] w-full h-32 bg-white rounded-2xl shadow-md flex flex-col justify-center items-center border-t-4 border-purple-500 p-3 hover:shadow-lg transition-all duration-200 cursor-pointer"
        >
          <div className="text-4xl mb-1">🏠</div>
          <div className="text-lg font-bold text-gray-800">Cellule</div>
        </div>

        <div
          onClick={() => handleRedirect("/rapport")}
          className="flex-1 min-w-[250px] w-full h-32 bg-white rounded-2xl shadow-md flex flex-col justify-center items-center border-t-4 border-red-500 p-3 hover:shadow-lg transition-all duration-200 cursor-pointer"
        >
          <div className="text-4xl mb-1">📊</div>
          <div className="text-lg font-bold text-gray-800">Rapport</div>
        </div>

        <div
          onClick={() => handleRedirect("/administrateur")}
          className="flex-1 min-w-[250px] w-full h-32 bg-white rounded-2xl shadow-md flex flex-col justify-center items-center border-t-4 border-blue-400 p-3 hover:shadow-lg transition-all duration-200 cursor-pointer"
        >
          <div className="text-4xl mb-1">🧑‍💻</div>
          <div className="text-lg font-bold text-gray-800">Admin</div>
        </div>
      </div>

      <div className="text-white text-lg font-handwriting-light max-w-2xl mt-6">
        Car le corps ne se compose pas d’un seul membre, mais de plusieurs. <br />
        1 Corinthiens 12:14 ❤️
      </div>
    </div>
  );
}
