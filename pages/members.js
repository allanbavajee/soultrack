// /pages/members.js
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Members() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from("membres")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setMembers(data);
  };

  const getColor = (statut) => {
    switch (statut) {
      case "veut rejoindre ICC":
        return "bg-blue-100 text-blue-800";
      case "nouveau":
        return "bg-green-100 text-green-800";
      case "a déjà mon église":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const sendWhatsApp = (member) => {
    const phone = member.assignee === "Curepipe" ? "59732188" :
                  member.assignee === "Bois Rouge" ? "51234567" :
                  member.assignee === "Bambous" ? "59865475" :
                  member.assignee === "Mon Gout" ? "59876413" :
                  member.assignee === "Rose Hill" ? "59861473" :
                  "";

    if (!phone) return alert("Pas de numéro WhatsApp assigné.");

    const msg = `Bonjour ${member.assignee} 🌸, nous avons la joie d’accueillir ${member.nom} ${member.prenom} dans notre église.\n
Téléphone: ${member.telephone}\n
Email: ${member.email}\n
Besoins: ${member.besoins}\n
Assignée à votre cellule: ${member.assignee}\nMerci de l’accueillir avec amour ! 🙏`;

    const url = `https://wa.me/230${phone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 font-poppins">
      <h1 className="text-2xl font-bold text-center mb-4 text-blue-700">
        Liste des Membres
      </h1>

      <div className="space-y-2 max-w-2xl mx-auto">
        {members.map((m) => (
          <div
            key={m.id}
            className={`p-3 rounded flex justify-between items-center ${getColor(
              m.statut
            )}`}
          >
            <div>
              <p className="font-semibold">{m.nom} {m.prenom}</p>
              <p>Téléphone: {m.telephone}</p>
              <p>Email: {m.email}</p>
              <p>Assignée: {m.assignee}</p>
            </div>
            {m.statut === "veut rejoindre ICC" && (
              <button
                onClick={() => sendWhatsApp(m)}
                className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
              >
                WhatsApp
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
