// pages/list-members.js
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import supabase from "../lib/supabaseClient";

export default function ListMembers() {
  const [members, setMembers] = useState([]);
  const [cellules, setCellules] = useState([]);
  const [selectedCellules, setSelectedCellules] = useState({});
  const [detailsOpen, setDetailsOpen] = useState({});
  const [filter, setFilter] = useState("");
  const [viewMode, setViewMode] = useState("card");
  const [sending, setSending] = useState({});

  useEffect(() => {
    fetchMembers();
    fetchCellules();
  }, []);

  async function fetchMembers() {
    const { data, error } = await supabase.from("membres").select("*").order("created_at", { ascending: false });
    if (!error) setMembers(data || []);
  }

  async function fetchCellules() {
    const { data, error } = await supabase.from("cellules").select("id, cellule, responsable, telephone");
    if (!error) setCellules(data || []);
  }

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "long", year: "numeric" });
  };

  const getBorderColor = (member) => {
    if (member.star) return "#FBC02D";
    if (member.statut === "actif") return "#4285F4";
    if (member.statut === "a déjà mon église") return "#EA4335";
    if (member.statut === "ancien") return "#999999";
    if (member.statut === "veut rejoindre ICC" || member.statut === "visiteur") return "#34A853";
    return "#ccc";
  };

  const filteredMembers = members.filter((m) => {
    if (!filter) return true;
    if (filter === "star") return m.star === true;
    return m.statut === filter;
  });

  const nouveaux = filteredMembers.filter((m) => ["visiteur", "veut rejoindre ICC"].includes(m.statut));
  const anciens = filteredMembers.filter((m) => !["visiteur", "veut rejoindre ICC"].includes(m.statut));

  const handleSendWhatsapp = async (member) => {
    const celluleId = selectedCellules[member.id];
    const cellule = cellules.find((c) => String(c.id) === String(celluleId));
    if (!cellule || !cellule.telephone) {
      alert("Numéro de la cellule introuvable.");
      return;
    }

    setSending((s) => ({ ...s, [member.id]: true }));

    try {
      // créer un suivi s'il n'existe pas
      const { data: existing } = await supabase.from("suivis_membres").select("*").eq("membre_id", member.id).limit(1);
      if (!existing || existing.length === 0) {
        await supabase.from("suivis_membres").insert([{ membre_id: member.id, statut: "envoye", created_at: new Date() }]);
      }

      // mettre statut actif si nouveau
      if (["visiteur", "veut rejoindre ICC"].includes(member.statut)) {
        await supabase.from("membres").update({ statut: "actif" }).eq("id", member.id);
        setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, statut: "actif" } : m)));
      }

      const message = `👋 Salut ${cellule.responsable},

🙏 Dieu nous a envoyé une nouvelle âme à suivre.
Voici ses infos :

- 👤 Nom : ${member.prenom || ""} ${member.nom || ""}
- 📱 Téléphone : ${member.telephone || "—"}
- 📧 Email : ${member.email || "—"}
- 🏙 Ville : ${member.ville || "—"}
- 🙏 Besoin : ${member.besoin || "—"}
- 📝 Infos supplémentaires : ${member.infos_supplementaires || "—"}

Merci pour ton cœur ❤ et son amour ✨`;

      const phone = String(cellule.telephone).replace(/\D/g, "");
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi du WhatsApp.");
    } finally {
      setSending((s) => ({ ...s, [member.id]: false }));
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center p-6"
      style={{ background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)" }}
    >
      <div className="mt-2 mb-2">
        <Image src="/logo.png" alt="SoulTrack Logo" width={80} height={80} />
      </div>

      <h1 className="text-5xl sm:text-6xl font-handwriting text-white text-center mb-2">SoulTrack</h1>
      <p className="text-center text-white text-lg mb-2 font-handwriting-light">
        Chaque personne compte ❤️
      </p>

      {/* toggle déplacé à droite */}
      <div className="flex justify-end w-full max-w-5xl mb-4">
        <span
          className="cursor-pointer text-black font-semibold"
          onClick={() => setViewMode((v) => (v === "card" ? "table" : "card"))}
        >
          {viewMode === "card" ? "Vue Table" : "Vue Card"}
        </span>
      </div>

      {/* filtre */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-4 w-full max-w-md">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-4 py-2 text-gray-700 shadow-sm w-full"
        >
          <option value="">-- Filtrer par statut --</option>
          <option value="actif">Actif</option>
          <option value="ancien">Ancien</option>
          <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
          <option value="visiteur">Visiteur</option>
          <option value="a déjà mon église">A déjà mon église</option>
          <option value="star">⭐ Star</option>
        </select>
      </div>

      {/* ===== Vue Card ===== */}
      {viewMode === "card" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {nouveaux.length > 0 && (
            <div className="col-span-full text-white">
              Contact venu le {formatDate(nouveaux[0].created_at)}
            </div>
          )}

          {[...nouveaux, ...anciens].map((member) => (
            <div key={member.id} className="bg-white p-3 rounded-2xl shadow-md border-t-4" style={{ borderTopColor: getBorderColor(member) }}>
              <h2 className="text-lg font-bold">{member.prenom} {member.nom}</h2>
              <p className="text-sm">📱 {member.telephone}</p>
              <p className="text-sm font-semibold" style={{ color: getBorderColor(member) }}>{member.statut}</p>

              <p className="mt-1 text-blue-500 underline cursor-pointer" onClick={() => setDetailsOpen((prev) => ({ ...prev, [member.id]: !prev[member.id] }))}>
                {detailsOpen[member.id] ? "Fermer détails" : "Détails"}
              </p>

              {detailsOpen[member.id] && (
                <div className="mt-2 text-sm">
                  <p>Email : {member.email || "—"}</p>
                  <p>Ville : {member.ville || "—"}</p>
                  <p>Besoin : {member.besoin || "—"}</p>
                  <p>Infos : {member.infos_supplementaires || "—"}</p>

                  <p className="text-green-600 font-semibold mt-2">Cellule :</p>
                  <select
                    value={selectedCellules[member.id] || ""}
                    onChange={(e) => setSelectedCellules((p) => ({ ...p, [member.id]: String(e.target.value) }))}
                    className="border rounded-lg px-2 py-1 text-sm text-black w-full"
                  >
                    <option value="">-- Choisir cellule --</option>
                    {cellules.map((c) => (
                      <option key={c.id} value={String(c.id)}>{c.cellule} ({c.responsable})</option>
                    ))}
                  </select>

                  {selectedCellules[member.id] && (
                    <button onClick={() => handleSendWhatsapp(member)} disabled={sending[member.id]} className="mt-2 bg-green-500 text-white px-4 py-2 rounded-xl w-full">
                      {sending[member.id] ? "Envoi..." : "Envoyer par WhatsApp"}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* ===== Vue Table ===== */
        <div className="w-full max-w-5xl overflow-x-auto">
          <table className="table-auto w-full bg-white rounded-2xl shadow-md">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2 text-left">Nom</th>
                <th className="px-4 py-2 text-left">Prénom</th>
                <th className="px-4 py-2 text-left">Statut</th>
                <th className="px-4 py-2 text-left">Détails</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr key={member.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{member.nom}</td>
                  <td className="px-4 py-2">{member.prenom}</td>
                  <td className="px-4 py-2">{member.statut}</td>
                  <td className="px-4 py-2">
                    <span className="text-blue-500 underline cursor-pointer" onClick={() => setDetailsOpen((p) => ({ ...p, [member.id]: !p[member.id] }))}>
                      {detailsOpen[member.id] ? "Fermer détails" : "Détails"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredMembers.map(
            (member) =>
              detailsOpen[member.id] && (
                <div key={member.id} className="bg-white p-4 rounded-2xl shadow-md mt-2">
                  <p><b>{member.prenom} {member.nom}</b></p>
                  <p>📱 {member.telephone}</p>
                  <p>Email : {member.email || "—"}</p>
                  <p>Ville : {member.ville || "—"}</p>
                  <p>Besoin : {member.besoin || "—"}</p>
                  <p>Infos : {member.infos_supplementaires || "—"}</p>

                  <p className="text-green-600 font-semibold mt-2">Cellule :</p>
                  <select
                    value={selectedCellules[member.id] || ""}
                    onChange={(e) => setSelectedCellules((p) => ({ ...p, [member.id]: String(e.target.value) }))}
                    className="border rounded-lg px-2 py-1 text-sm text-black w-full"
                  >
                    <option value="">-- Choisir cellule --</option>
                    {cellules.map((c) => (
                      <option key={c.id} value={String(c.id)}>{c.cellule} ({c.responsable})</option>
                    ))}
                  </select>

                  {selectedCellules[member.id] && (
                    <button onClick={() => handleSendWhatsapp(member)} disabled={sending[member.id]} className="mt-2 bg-green-500 text-white px-4 py-2 rounded-xl w-full">
                      {sending[member.id] ? "Envoi..." : "Envoyer par WhatsApp"}
                    </button>
                  )}
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
}
