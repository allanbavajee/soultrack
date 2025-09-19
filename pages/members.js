// /pages/members.js
import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

const responsables = {
  Curepipe: { nom: "Charlotte", tel: "59732188" },
  "Bois Rouge": { nom: "Lucie", tel: "51234567" },
  Bambous: { nom: "Manish", tel: "59865475" },
  "Mon Gout": { nom: "May Jane", tel: "59876413" },
  "Rose Hill": { nom: "Fabrice", tel: "59861473" },
};

const getStatusColor = (statut) => {
  switch (statut) {
    case "veut_rejoindre_ICC":
      return "bg-blue-100 border-blue-500";
    case "a_deja_mon_eglise":
      return "bg-white border-gray-300";
    default:
      return "bg-gray-100 border-gray-300";
  }
};

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

  const buildWhatsappMessage = (m) => {
    if (!m.assignee || !responsables[m.assignee]) return null;
    const r = responsables[m.assignee];
    return `https://wa.me/230${r.tel}?text=Bonjour%20${r.nom}%20🌸,%20nous%20avons%20la%20joie%20d’accueillir%20${m.prenom}%20${m.nom}%20dans%20notre%20église.%20Il/Elle%20a%20été%20assigné(e)%20à%20votre%20cellule%20${m.assignee}.%20Merci%20de%20l’accueillir%20et%20de%20le/la%20guider%20avec%20amour%20!%20🙏`;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 font-poppins">
      <h1 className="text-2xl font-bold text-blue-700 mb-4 text-center">
        Liste des nouveaux
      </h1>
      <div className="space-y-3">
        {members.map((m) => (
          <div
            key={m.id}
            className={`p-4 rounded-xl shadow border ${getStatusColor(
              m.statut
            )}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-bold">
                  {m.prenom} {m.nom}
                </p>
                <p className="text-sm text-gray-600">📞 {m.telephone}</p>
                <p className="text-sm text-gray-600">📍 {m.assignee}</p>
              </div>
              {m.statut === "veut_rejoindre_ICC" && (
                <a
                  href={buildWhatsappMessage(m)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-green-600"
                >
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
