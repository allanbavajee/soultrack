// pages/members.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Members() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data, error } = await supabase.from("membres").select("*");
    if (!error) setMembers(data);
  };

  const sendWhatsApp = (m) => {
    const msg = `Bonjour ${m.assignee}, nous avons la joie d’accueillir ${m.nom} ${m.prenom}. 
Téléphone: ${m.telephone}
Email: ${m.email}
Statut: ${m.statut}
Comment est venu: ${m.how_came}
Besoin: ${m.besoin}
Merci de l’accueillir avec amour ! 🙏`;
    const url = `https://wa.me/${m.assigneePhone}?text=${encodeURIComponent(msg)}`;
    window.open(url, "_blank");
  };

  const statusColor = (statut) => {
    switch(statut) {
      case "veut rejoindre ICC": return "bg-blue-100 text-blue-800";
      case "a déjà mon église": return "bg-red-100 text-red-800";
      case "visiteur": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-4">
      <div className="w-full max-w-3xl">
        <h1 className="text-3xl font-bold mb-6 text-center">Liste des membres</h1>
        <div className="space-y-4">
          {members.map((m) => (
            <div key={m.id} className={`flex justify-between items-center p-4 rounded-xl ${statusColor(m.statut)}`}>
              <div>
                <p className="font-semibold">{m.nom} {m.prenom}</p>
                <p className="text-sm">Assignée à : {m.assignee}</p>
              </div>
              {m.statut === "veut rejoindre ICC" && (
                <button
                  onClick={() => sendWhatsApp(m)}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  WhatsApp
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
