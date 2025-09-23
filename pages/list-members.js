/* /pages/list-members.js */
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
        <label className="mr-2 font-semibold">Filtrer par statut:</label>
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
          <MemberCard key={member.id} member={member} onStatusChange={fetchMembers} />
        ))}
      </div>
    </div>
  );
}

function MemberCard({ member, onStatusChange }) {
  const [cellule, setCellule] = useState(null);

  useEffect(() => {
    fetchCellule();
  }, [member.ville]);

  async function fetchCellule() {
    if (!member.ville) return;
    const { data, error } = await supabase
      .from("cellules")
      .select("cellule")
      .eq("ville", member.ville)
      .single();

    if (!error && data) setCellule(data.cellule);
  }

  async function handleEnvoyer() {
    // Pour l’instant → console log
    console.log("📤 Envoi au responsable:", {
      nom: member.nom,
      prenom: member.prenom,
      telephone: member.telephone,
      email: member.email,
      besoin: member.besoin,
      ville: member.ville,
      cellule,
    });

    // Mise à jour du statut en "ancien"
    const { error } = await supabase
      .from("membres")
      .update({ statut: "ancien" })
      .eq("id", member.id);

    if (error) {
      alert("❌ Erreur lors de la mise à jour");
      console.error(error);
    } else {
      alert("✅ Contact envoyé et statut mis à jour !");
      onStatusChange(); // Refresh liste
    }
  }

  // Couleur selon statut ou star
  const cardStyle =
    member.star === "OUI"
      ? "bg-green-100 border-green-400"
      : member.statut === "ancien"
      ? "bg-white border-gray-300"
      : "bg-orange-100 border-orange-400";

  return (
    <div className={`p-4 rounded-xl border shadow ${cardStyle}`}>
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-lg">
          {member.prenom} {member.nom}
        </h2>
        <span className="text-sm font-semibold text-orange-600">{member.statut}</span>
      </div>

      <p className="text-sm text-gray-600">📱 {member.telephone}</p>
      {cellule && <p className="text-sm text-indigo-700 font-semibold">📍 Cellule : {cellule}</p>}

      <details className="mt-2">
        <summary className="cursor-pointer text-indigo-500 text-sm">Voir détails</summary>
        <div className="mt-2 text-sm text-gray-700 space-y-1">
          <p>Email: {member.email || "—"}</p>
          <p>Besoin: {member.besoin || "—"}</p>
          <p>Ville: {member.ville || "—"}</p>
          <p>Comment venu: {member.how_came || "—"}</p>

          {/* Bouton envoyer seulement si statut = visiteur ou veut rejoindre ICC */}
          {(member.statut === "visiteur" || member.statut === "veut rejoindre ICC") && (
            <button
              onClick={handleEnvoyer}
              className="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
            >
              📤 Envoyer au responsable
            </button>
          )}
        </div>
      </details>
    </div>
  );
}
