/* /pages/list-members.js */
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

export default function ListMembers() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from("membres")
      .select("*")
      .order("id", { ascending: false });
    if (error) console.error(error);
    else setMembers(data);
  };

  return (
    <div className="min-h-screen bg-indigo-50 p-6">
      <h1 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">
        👥 Liste des membres
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div key={member.id} className="bg-white p-6 rounded-3xl shadow-lg relative flex flex-col justify-between">
            
            {/* Statut en haut à droite */}
            <span className="absolute top-4 right-4 bg-orange-400 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {member.statut || "N/A"}
            </span>

            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                {member.nom} {member.prenom}
              </h2>
              <p className="text-gray-500 mb-2">Cellule : {member.assignee || "Non assigné"}</p>
              {member.besoin && (
                <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                  {member.besoin}
                </p>
              )}
            </div>

            {/* Boutons */}
            <div className="mt-4 flex justify-end gap-2">
              {member.statut === "veut rejoindre ICC" && (
                <a
                  href={`https://wa.me/${member.telephone}?text=Bonjour ${member.prenom}, voici vos informations...`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1 px-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full text-sm transition-all duration-200"
                >
                  WhatsApp
                </a>
              )}
              <Link
                href={`/members/${member.id}`}
                className="py-1 px-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold rounded-full text-sm transition-all duration-200"
              >
                Détails
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
