//pages/index.js

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // nécessaire pour handleRedirect
import supabase from "../lib/supabaseClient";

export default function IndexPage() {
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    setUserEmail(email || "Inconnu");
  }, []);

  const handleRedirect = (path) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-100 space-y-6">
      <h1 className="text-3xl font-bold mb-4">🏠 Page d'accueil</h1>
      <p className="text-lg mb-6">Bienvenue {userEmail}</p>

      <div
        onClick={() => handleRedirect("/membres-hub")}
        className="flex-1 min-w-[250px] w-full h-32 bg-white rounded-2xl shadow-md flex flex-col justify-center items-center border-t-4 border-blue-500 p-3 hover:shadow-lg transition-all duration-200 cursor-pointer"
      >
        <div className="text-4xl mb-1">👤</div>
        <div className="text-lg font-bold text-gray-800">Suivis des membres</div>
      </div>
    </div>
   <div
        onClick={() => handleRedirect("/evangelisation-hub")}
        className="flex-1 min-w-[250px] w-full h-32 bg-white rounded-2xl shadow-md flex flex-col justify-center items-center border-t-4 border-blue-500 p-3 hover:shadow-lg transition-all duration-200 cursor-pointer"
      >
        <div className="text-4xl mb-1">🙌</div>
        <div className="text-lg font-bold text-gray-800">Évangélisation</div>
      </div>
    </div>
    <div
        onClick={() => handleRedirect("cellules-hub")}
        className="flex-1 min-w-[250px] w-full h-32 bg-white rounded-2xl shadow-md flex flex-col justify-center items-center border-t-4 border-blue-500 p-3 hover:shadow-lg transition-all duration-200 cursor-pointer"
      >
        <div className="text-4xl mb-1">🙌</div>
        <div className="text-lg font-bold text-gray-800">Évangélisation</div>
      </div>
    </div>
                                      
  );
}

