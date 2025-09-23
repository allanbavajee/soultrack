// pages/list-members.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ListMembers() {
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchMembers();
  }, [filter]);

  async function fetchMembers() {
    let query = supabase.from("membres").select("*").order("created_at", { ascending: false });
    if (filter !== "all") {
      query = query.eq("statut", filter);
    }
    const { data, error } = await query;
    if (error) console.error(error);
    else setMembers(data);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-4">📋 Liste des membres</h1>

      {/* Filtre par statut */}
      <div className="mb-6">
        <label className="mr-2 font-semibold">Filtrer par statut :</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400"
        >
          <option value="all">Tous</option>
          <option value="visiteur">Visiteur</option>
          <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
          <option value="a déjà mon église">A déjà mon église</option>
          <option value="ancien">Ancien</option>
        </select>
      </div>

      {/* Liste des cartes */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} fetchMembers={fetchMembers} />
        ))}
      </div>
    </div>
  );
}

// Composant pour afficher chaque membre
function MemberCard({ member, fetchMembers }) {
  const [cellules, setCellules] = useState([]);
  const [selectedCellule, setSelectedCellule] = useState(null);

  // Récupère les cellules correspondant à la ville du membre
  useEffect(() => {
    async function fetchCellules() {
      if (!member.ville) return;
      const { data, error } = await supabase
        .from("cellules")
        .select("cellule, responsable, telephone")
        .eq("ville", member.ville);
      if (!error && data) setCellules(data);
    }
    fetchCellules();
  }, [member.ville]);

  // Fonction pour envoyer le message WhatsApp
  function handleWhatsApp() {
    if (!selectedCellule) return;

    const message = `Nouveau venu à suivre:\n
Nom: ${member.prenom} ${member.nom}\n
Téléphone: ${member.telephone}\n
Email: ${member.email || "—"}\n
Besoin: ${member.besoin || "—"}\n
Ville: ${member.ville}\n
Cellule: ${selectedCellule.cellule}\n
Responsable: ${selectedCellule.responsable}`;

    const url = `https://wa.me/${selectedCellule.telephone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");

    // Mise à jour du statut en "ancien"
    supabase.from("membres").update({ statut: "ancien" }).eq("id", member.id);
    fetchMembers();
  }

  // Couleur de la carte selon statut ou star
  const cardStyle =
    member.star === "OUI"
      ? "bg-green-100 border-green-400"
      : member.statut === "ancien"
      ? "bg-white border-gray-300"
      : "bg-orange-100 border-orange-400";

  return (
    <div className={`p-4 rounded-xl border shadow ${cardStyle}`}>
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-lg">{member.prenom} {member.nom}</h2>
        <span className="text-sm font-semibold text-orange-600">{member.statut}</span>
      </div>

      <p className="text-sm text-gray-600">📱 {member.telephone}</p>

      <details className="mt-2">
        <summary className="cursor-pointer text-indigo-500 text-sm">Voir détails</summary>
        <div className="mt-2 text-sm text-gray-700 space-y-1">
          <p>Email : {member.email || "—"}</p>
          <p>Besoin : {member.besoin || "—"}</p>
          <p>Ville : {member.ville || "—"}</p>
          <p>Comment venu : {member.how_came || "—"}</p>

          {/* Menu déroulant + WhatsApp pour visiteur ou veut rejoindre ICC */}
          {(member.statut === "visiteur" || member.statut === "veut rejoindre ICC") && cellules.length > 0 && (
            <div className="mt-2">
              <label className="block mb-1 font-semibold">Choisir une cellule :</label>
              <select
                className="w-full p-2 border rounded-lg"
                value={selectedCellule?.cellule || ""}
                onChange={(e) => {
                  const cellule = cellules.find(c => c.cellule === e.target.value);
                  setSelectedCellule(cellule);
                }}
              >
                <option value="">-- Sélectionner --</option>
                {cellules.map(c => (
                  <option key={c.cellule} value={c.cellule}>
                    {c.cellule} ({c.responsable})
                  </option>
                ))}
              </select>

              {selectedCellule && (
                <button
                  onClick={handleWhatsApp}
                  className="mt-2 w-full py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
                >
                  📤 Envoyer sur WhatsApp
                </button>
              )}
            </div>
          )}
        </div>
      </details>
    </div>
  );
}
