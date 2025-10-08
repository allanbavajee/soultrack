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
    const { data, error } = await supabase
      .from("membres")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error) setMembers(data || []);
  }

  async function fetchCellules() {
    const { data, error } = await supabase
      .from("cellules")
      .select("id, cellule, responsable, telephone");
    if (!error) setCellules(data || []);
  }

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    return d.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const getColor = (statut, star) => {
    if (star) return "#FBC02D"; // jaune
    if (statut === "actif") return "#4285F4"; // bleu
    if (statut === "a déjà mon église") return "#EA4335"; // rouge
    if (statut === "ancien") return "#999999"; // gris
    if (statut === "veut rejoindre ICC" || statut === "visiteur") return "#34A853"; // vert
    return "#444";
  };

  const filteredMembers = members.filter((m) => {
    if (!filter) return true;
    if (filter === "star") return m.star === true;
    return m.statut === filter;
  });

  const countFiltered = filteredMembers.length;

  const nouveaux = filteredMembers.filter(
    (m) => m.statut === "visiteur" || m.statut === "veut rejoindre ICC"
  );
  const anciens = filteredMembers.filter(
    (m) => m.statut !== "visiteur" && m.statut !== "veut rejoindre ICC"
  );

  const handleChangeStatus = async (id, newStatus) => {
    await supabase.from("membres").update({ statut: newStatus }).eq("id", id);
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, statut: newStatus } : m))
    );
  };

  const handleSendWhatsapp = async (member) => {
    const celluleId = selectedCellules[member.id];
    const cellule = cellules.find((c) => String(c.id) === String(celluleId));
    if (!cellule || !cellule.telephone) {
      alert("Numéro de la cellule introuvable.");
      return;
    }
    setSending((s) => ({ ...s, [member.id]: true }));

    try {
      const { data: existingSuivis } = await supabase
        .from("suivis_membres")
        .select("*")
        .eq("membre_id", member.id)
        .limit(1);

      if (!existingSuivis || existingSuivis.length === 0) {
        await supabase.from("suivis_membres").insert([
          { membre_id: member.id, statut: "envoye", created_at: new Date() },
        ]);
      }

      if (member.statut === "visiteur" || member.statut === "veut rejoindre ICC") {
        await supabase.from("membres").update({ statut: "actif" }).eq("id", member.id);
        setMembers((prev) =>
          prev.map((m) => (m.id === member.id ? { ...m, statut: "actif" } : m))
        );
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

Merci pour ton cœur ❤`;

      const phone = String(cellule.telephone).replace(/\D/g, "");
      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
    } catch (err) {
      console.error("WhatsApp error:", err);
      alert("Erreur lors de l'envoi du WhatsApp.");
    } finally {
      setSending((s) => ({ ...s, [member.id]: false }));
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center p-6"
      style={{
        background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)",
      }}
    >
      <h1 className="text-4xl text-white mb-2">Chaque personne compte ❤️</h1>

      {/* Toggle à droite */}
      <div className="w-full flex justify-end mb-4">
        <p
          className="cursor-pointer text-black font-semibold"
          onClick={() => setViewMode((v) => (v === "card" ? "table" : "card"))}
        >
          {viewMode === "card" ? "Vue Table" : "Vue Card"}
        </p>
      </div>

      {/* filtre */}
      <div className="flex gap-4 mb-4">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-4 py-2"
        >
          <option value="">-- Filtrer --</option>
          <option value="actif">Actif</option>
          <option value="ancien">Ancien</option>
          <option value="visiteur">Visiteur</option>
          <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
          <option value="a déjà mon église">A déjà mon église</option>
          <option value="star">⭐ Star</option>
        </select>
        <span className="text-white">Résultats: {countFiltered}</span>
      </div>

      {/* vue card */}
      {viewMode === "card" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {nouveaux.map((m) => (
            <div key={m.id} className="bg-white p-4 rounded-xl shadow-md border-t-4"
              style={{ borderTopColor: getColor(m.statut, m.star) }}>
              <h2 className="font-bold">{m.prenom} {m.nom}</h2>
              <p className="text-sm">{m.telephone}</p>
              <p className="font-semibold" style={{ color: getColor(m.statut, m.star) }}>{m.statut}</p>
              <p className="text-blue-500 underline cursor-pointer"
                onClick={() => setDetailsOpen((p) => ({ ...p, [m.id]: !p[m.id] }))}>
                {detailsOpen[m.id] ? "Fermer détails" : "Détails"}
              </p>
              {detailsOpen[m.id] && (
                <div className="mt-2 text-sm">
                  <p>Email: {m.email || "—"}</p>
                  <p>Ville: {m.ville || "—"}</p>
                  <p>Besoin: {m.besoin || "—"}</p>
                  <select
                    value={selectedCellules[m.id] || ""}
                    onChange={(e) =>
                      setSelectedCellules((p) => ({ ...p, [m.id]: e.target.value }))
                    }
                    className="border rounded-lg px-2 py-1 text-sm mt-2"
                  >
                    <option value="">-- Choisir cellule --</option>
                    {cellules.map((c) => (
                      <option key={c.id} value={c.id}>{c.cellule} ({c.responsable})</option>
                    ))}
                  </select>
                  {selectedCellules[m.id] && (
                    <button
                      onClick={() => handleSendWhatsapp(m)}
                      className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
                    >
                      {sending[m.id] ? "Envoi..." : "Envoyer par WhatsApp"}
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        /* vue table */
        <div className="w-full max-w-5xl">
          <table className="w-full bg-white rounded-xl shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2">Nom</th>
                <th className="px-4 py-2">Prénom</th>
                <th className="px-4 py-2">Statut</th>
                <th className="px-4 py-2">Détails</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((m) => (
                <tr key={m.id} className="border-b">
                  <td className="px-4 py-2">{m.nom}</td>
                  <td className="px-4 py-2">{m.prenom}</td>
                  <td className="px-4 py-2 font-semibold" style={{ color: getColor(m.statut, m.star) }}>{m.statut}</td>
                  <td className="px-4 py-2">
                    <span
                      className="text-blue-500 underline cursor-pointer"
                      onClick={() => setDetailsOpen((p) => ({ ...p, [m.id]: !p[m.id] }))}
                    >
                      {detailsOpen[m.id] ? "Fermer détails" : "Détails"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredMembers.map(
            (m) =>
              detailsOpen[m.id] && (
                <div key={m.id + "-details"} className="bg-white p-4 rounded-xl shadow-md mt-4">
                  <p className="font-bold">{m.prenom} {m.nom}</p>
                  <p className="text-sm">📱 {m.telephone}</p>
                  <p className="text-sm">Email : {m.email}</p>
                  <p className="text-sm">Ville : {m.ville}</p>
                  <p className="text-sm">Besoin : {m.besoin}</p>

                  <select
                    value={selectedCellules[m.id] || ""}
                    onChange={(e) =>
                      setSelectedCellules((p) => ({ ...p, [m.id]: e.target.value }))
                    }
                    className="border rounded-lg px-2 py-1 text-sm mt-2"
                  >
                    <option value="">-- Choisir cellule --</option>
                    {cellules.map((c) => (
                      <option key={c.id} value={c.id}>{c.cellule} ({c.responsable})</option>
                    ))}
                  </select>
                  {selectedCellules[m.id] && (
                    <button
                      onClick={() => handleSendWhatsapp(m)}
                      className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
                    >
                      {sending[m.id] ? "Envoi..." : "Envoyer par WhatsApp"}
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
