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

  const getCardColor = (member) => {
    if (member.star?.toLowerCase() === "oui") return "bg-purple-100"; // membre STAR
    return "bg-white"; // membre normal
  };

  const getStatusColor = (statut) => {
    switch (statut) {
      case "veut rejoindre ICC":
        return "bg-green-500";
      case "visiteur":
        return "bg-yellow-400";
      case "a déjà mon église":
        return "bg-blue-400";
      case "membre de l'église":
        return "bg-black text-white";
      default:
        return "bg-orange-400";
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 p-6">
      <h1 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">
        👥 Liste des membres
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div
            key={member.id}
            className={`${getCardColor(member)} p-6 rounded-3xl shadow-lg relative flex flex-col justify-between`}
          >
            {/* Statut et Détails en haut à droite */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
              <span
                className={`${getStatusColor(member.statut)} text-white px-3 py-1 rounded-full text-sm font-semibold`}
              >
                {member.statut || "N/A"}
              </span>
              <Link
                href={`/members/${member.id}`}
                className="py-1 px-3 bg-orange-200 hover:bg-orange-300 text-orange-900 font-semibold rounded-full text-sm transition-all duration-200"
              >
                Détails
              </Link>
            </div>

            {/* Contenu principal */}
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                {member.nom} {member.prenom}
              </h2>
              <p className="text-gray-500 mb-2">
                Cellule : {member.assignee || "Non assigné"}
              </p>
              {member.besoin && (
                <p className="mt-2 text-gray-600 text-sm line-clamp-2">
                  {member.besoin}
                </p>
              )}
            </div>

            {/* Bouton WhatsApp si veut rejoindre ICC */}
            {member.statut === "veut rejoindre ICC" && (
              <div className="mt-4 flex justify-end">
                <a
                  href={`https://wa.me/${member.telephone}?text=Bonjour ${member.prenom}, voici vos informations...`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1 px-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-full text-sm transition-all duration-200"
                >
                  WhatsApp
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
