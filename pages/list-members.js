/* /pages/list-members.js */
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

export default function NewMembers() {
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

  const getStatusColor = (status) => {
    switch (status) {
      case "veut rejoindre ICC":
        return "bg-green-100 text-green-700";
      case "visiteur":
        return "bg-yellow-100 text-yellow-700";
      case "a déjà mon église":
        return "bg-blue-100 text-blue-700";
      case "membre de l'église":
        return "bg-gray-100 text-gray-900"; // noir sur blanc
      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 p-6">
      <h1 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center">
        🚀 Liste des membres
      </h1>

      {members.length === 0 && (
        <p className="text-gray-500 text-center">Aucun membre pour l'instant.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div
            key={member.id}
            className={`bg-white p-6 rounded-3xl shadow-lg flex flex-col justify-between border-t-4 ${getStatusColor(member.statut)}`}
          >
            <div>
              <h2 className="text-xl font-bold text-gray-800 mb-1">
                {member.nom} {member.prenom}
              </h2>
              <p className="text-gray-500 mb-2">
                Assigné à : {member.assignee || "Non assigné"}
              </p>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                  member.statut
                )}`}
              >
                {member.statut || "N/A"}
              </span>
              {member.besoin && (
                <p className="mt-3 text-gray-600 text-sm line-clamp-3">
                  {member.besoin}
                </p>
              )}
            </div>

            <div className="mt-4 flex justify-between gap-2">
              {/* WhatsApp uniquement si "veut rejoindre ICC" */}
              {member.statut === "veut rejoindre ICC" && (
                <a
                  href={`https://wa.me/${member.telephone}?text=Nom: ${member.nom}%0APrénom: ${member.prenom}%0ATéléphone: ${member.telephone}%0AEmail: ${member.email}%0AStatut: ${member.statut}%0AComment il est venu: ${member.how_came}%0ABesoin: ${member.besoin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl text-center transition-all duration-200"
                >
                  Envoyer au responsable
                </a>
              )}

              <Link
                href={`/members/${member.id}`}
                className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl text-center transition-all duration-200"
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
