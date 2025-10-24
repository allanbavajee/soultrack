"use client";
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function ListMembersTable() {
  const [members, setMembers] = useState([]);
  const [cellules, setCellules] = useState([]);
  const [selectedCellules, setSelectedCellules] = useState({});
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [session, setSession] = useState(null);
  const statusOptions = [
    "actif",
    "Integrer",
    "ancien",
    "veut rejoindre ICC",
    "visiteur",
    "a déjà mon église",
  ];

  useEffect(() => {
    getSession();
    fetchMembers();
    fetchCellules();
  }, []);

  const getSession = async () => {
    const { data } = await supabase.auth.getSession();
    setSession(data?.session || null);
  };

  const fetchMembers = async () => {
    const { data, error } = await supabase.from("membres").select("*").order("created_at", { ascending: false });
    if (!error && data) setMembers(data);
  };

  const fetchCellules = async () => {
    const { data, error } = await supabase.from("cellules").select("*");
    if (!error && data) setCellules(data);
  };

  const handleChangeStatus = async (id, newStatus) => {
    await supabase.from("membres").update({ statut: newStatus }).eq("id", id);
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, statut: newStatus } : m)));
  };

  const sendToWhatsapp = async (membre, celluleId) => {
    if (!session) return alert("❌ Vous devez être connecté pour envoyer un membre à une cellule.");
    if (!celluleId) return alert("❌ Sélectionnez une cellule !");

    const cellule = cellules.find((c) => String(c.id) === String(celluleId));
    if (!cellule) return alert("Cellule introuvable !");

    const now = new Date().toISOString();
    const suiviData = {
      prenom: membre.prenom,
      nom: membre.nom,
      telephone: membre.telephone,
      is_whatsapp: true,
      ville: membre.ville,
      besoin: membre.besoin,
      infos_supplementaires: membre.infos_supplementaires,
      cellule_id: cellule.id,
      responsable_cellule: cellule.responsable,
      date_suivi: now,
    };

    const { error: insertError } = await supabase.from("suivis_des_membres").insert([suiviData]);
    if (insertError) return alert("❌ Erreur lors de l’insertion : " + insertError.message);

    const message = `👋 Salut ${cellule.responsable},\n\n🙏 Nouveau membre à suivre :\n- 👤 Nom : ${membre.prenom} ${membre.nom}\n- 📱 Téléphone : ${membre.telephone || "—"}\n- 🏙 Ville : ${membre.ville || "—"}\n- 🙏 Besoin : ${membre.besoin || "—"}\n- 📝 Infos supplémentaires : ${membre.infos_supplementaires || "—"}\n\n🙏 Merci pour ton cœur ❤ et ton amour ✨`;

    const phone = cellule.telephone.replace(/\D/g, "");
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");

    // Mettre à jour le statut
    handleChangeStatus(membre.id, "Integrer");
  };

  const filteredMembers = members.filter((m) =>
    `${m.prenom} ${m.nom}`.toLowerCase().includes(search.toLowerCase()) &&
    (filter ? m.statut === filter : true)
  );

  return (
    <div className="p-6 bg-gradient-to-br from-blue-800 to-cyan-400 min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-4 text-center">Liste des membres</h1>

      <div className="flex flex-col sm:flex-row gap-2 mb-4 justify-between">
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 rounded-lg text-gray-800 w-full sm:w-1/3"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 rounded-lg text-gray-800"
        >
          <option value="">Tous les statuts</option>
          {statusOptions.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <table className="w-full text-sm bg-white/20 backdrop-blur-md rounded-xl overflow-hidden">
        <thead className="bg-white/30 text-gray-900">
          <tr>
            <th className="p-2 text-left">Prénom</th>
            <th className="p-2 text-left">Nom</th>
            <th className="p-2 text-left">Téléphone</th>
            <th className="p-2 text-left">Statut</th>
            <th className="p-2 text-left">Cellule</th>
            <th className="p-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredMembers.map((m) => (
            <tr key={m.id} className="hover:bg-white/30 transition-all">
              <td className="p-2">{m.prenom}</td>
              <td className="p-2">{m.nom}</td>
              <td className="p-2">{m.telephone}</td>
              <td className="p-2">
                <select value={m.statut} onChange={(e) => handleChangeStatus(m.id, e.target.value)} className="px-2 py-1 rounded-lg text-gray-800">
                  {statusOptions.map((s) => (<option key={s}>{s}</option>))}
                </select>
              </td>
              <td className="p-2">
                <select value={selectedCellules[m.id] || ""} onChange={(e) => setSelectedCellules(prev => ({ ...prev, [m.id]: e.target.value }))} className="px-2 py-1 rounded-lg text-gray-800">
                  <option value="">-- Sélectionner cellule --</option>
                  {cellules.map((c) => (<option key={c.id} value={c.id}>{c.cellule} ({c.responsable})</option>))}
                </select>
              </td>
              <td className="p-2">
                {selectedCellules[m.id] && (
                  <button
                    onClick={() => sendToWhatsapp(m, selectedCellules[m.id])}
                    className="px-3 py-1 rounded-lg bg-green-500 hover:bg-green-600 font-bold text-white"
                  >
                    Envoyer WhatsApp
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
