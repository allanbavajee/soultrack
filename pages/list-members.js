"use client";
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import Image from "next/image";

export default function ListMembers() {
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState("");
  const [detailsOpen, setDetailsOpen] = useState({});
  const [cellules, setCellules] = useState([]);
  const [selectedCellules, setSelectedCellules] = useState({});
  const [viewMode, setViewMode] = useState("card"); // "card" ou "table"
  const [sending, setSending] = useState({});

  useEffect(() => {
    fetchMembers();
    fetchCellules();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("membres")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setMembers(data || []);
    } catch (err) {
      console.error("Exception fetchMembers:", err.message);
      setMembers([]);
    }
  };

  const fetchCellules = async () => {
    try {
      const { data, error } = await supabase
        .from("cellules")
        .select("id, cellule, responsable, telephone");
      if (error) throw error;
      setCellules(data || []);
    } catch (err) {
      console.error("Exception fetchCellules:", err.message);
      setCellules([]);
    }
  };

  const handleChangeStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase.from("membres").update({ statut: newStatus }).eq("id", id);
      if (error) throw error;
      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, statut: newStatus } : m))
      );
    } catch (err) {
      console.error("Erreur update statut:", err.message);
    }
  };

  const getBorderColor = (member) => {
    if (member.star) return "#FBC02D";
    if (member.statut === "actif") return "#4285F4";
    if (member.statut === "a déjà mon église") return "#EA4335";
    if (member.statut === "ancien") return "#999999";
    if (member.statut === "veut rejoindre ICC" || member.statut === "visiteur")
      return "#34A853";
    return "#ccc";
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Filtrage simple (conservé)
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

  // Envoi WhatsApp (fonction réparée)
  const handleSendWhatsapp = async (member) => {
    const celluleId = selectedCellules[member.id];
    const cellule = cellules.find((c) => String(c.id) === String(celluleId));
    if (!cellule || !cellule.telephone) {
      alert("Numéro de la cellule introuvable.");
      return;
    }

    setSending((p) => ({ ...p, [member.id]: true }));

    try {
      // 1) créer le suivi si inexistant (silencieux si pas trouvé)
      const { data: existingSuivi, error: checkErr } = await supabase
        .from("suivis_membres")
        .select("*")
        .eq("membre_id", member.id)
        .limit(1)
        .single()
        .catch((e) => ({ data: null, error: e }));

      // Si erreur autre que "no rows" elle remontera ; la simple .single() lance une erreur si non trouvé.
      if (!existingSuivi) {
        const { error: insErr } = await supabase.from("suivis_membres").insert([
          { membre_id: member.id, statut: "envoye", created_at: new Date() },
        ]);
        if (insErr) throw insErr;
      }

      // 2) si nouveau member, mettre statut actif (db + state)
      if (member.statut === "visiteur" || member.statut === "veut rejoindre ICC") {
        const { error: updErr } = await supabase
          .from("membres")
          .update({ statut: "actif" })
          .eq("id", member.id);
        if (updErr) throw updErr;

        setMembers((prev) => prev.map((m) => (m.id === member.id ? { ...m, statut: "actif" } : m)));
      }

      // 3) préparer message (template exact demandé)
      const message = `👋 Salut ${cellule.responsable},

🙏 Dieu nous a envoyé une nouvelle âme à suivre.
Voici ses infos :

- 👤 Nom : ${member.prenom} ${member.nom}
- 📱 Téléphone : ${member.telephone || "—"}
- 📧 Email : ${member.email || "—"}
- 🏙 Ville : ${member.ville || "—"}
- 🙏 Besoin : ${member.besoin || "—"}
- 📝 Infos supplémentaires : ${member.infos_supplementaires || "—"}

Merci pour ton cœur ❤ et son amour ✨`;

      const phone = cellule.telephone.replace(/\D/g, "");
      if (!phone) {
        alert("Numéro de la cellule invalide.");
        return;
      }

      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, "_blank");
    } catch (err) {
      console.error("Erreur handleSendWhatsapp:", err);
      alert("Erreur lors de l'envoi du WhatsApp.");
    } finally {
      setSending((p) => ({ ...p, [member.id]: false }));
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center p-6"
      style={{ background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)" }}
    >
      <div className="w-full max-w-5xl flex items-center justify-between mb-4">
        <button
          onClick={() => window.history.back()}
          className="text-white font-semibold hover:text-gray-200"
        >
          ← Retour
        </button>

        {/* Toggle placé à droite, couleur modifiée */}
        <div
          className="text-yellow-300 font-semibold cursor-pointer"
          onClick={() => setViewMode((v) => (v === "card" ? "table" : "card"))}
          title="Changer la vue"
        >
          {viewMode === "card" ? "Vue Table" : "Vue Card"}
        </div>
      </div>

      <div className="mt-2 mb-2">
        <Image src="/logo.png" alt="SoulTrack Logo" width={80} height={80} />
      </div>

      <h1 className="text-5xl sm:text-6xl font-handwriting text-white text-center mb-2">
        SoulTrack
      </h1>

      <p className="text-center text-white text-lg mb-2 font-handwriting-light">
        Chaque personne a une valeur infinie. Ensemble, nous avançons, grandissons et
        partageons l’amour de Christ dans chaque action ❤️
      </p>

      {/* Filtre central (remis) */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-4 w-full max-w-md">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-4 py-2 text-gray-700 shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">-- Filtrer par statut --</option>
          <option value="actif">Actif</option>
          <option value="ancien">Ancien</option>
          <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
          <option value="visiteur">Visiteur</option>
          <option value="a déjà mon église">A déjà mon église</option>
          <option value="star">⭐ Star</option>
        </select>

        <span className="text-white italic text-opacity-80">Résultats: {countFiltered}</span>
      </div>

      {/* ---------- VUE CARD ---------- */}
      {viewMode === "card" ? (
        <>
          {/* Indication date (exactement comme demandé) */}
          {nouveaux.length > 0 && (
            <div className="w-full max-w-5xl mb-2">
              <p className="text-white mb-2">
                contact venu le {new Date(nouveaux[0].created_at).toLocaleDateString()}
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
            {/* Nouveaux en premier (s'ils existent) */}
            {nouveaux.map((member) => (
              <div
                key={member.id}
                className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between border-t-4"
                style={{ borderTopColor: getBorderColor(member), minHeight: "230px" }}
              >
                {/* Nom & statut (espacement réduit) */}
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-bold text-gray-800 mb-0">
                    {member.prenom} {member.nom}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="ml-2 text-blue-500 font-semibold text-sm">Nouveau</span>
                    <select
                      value={member.statut}
                      onChange={(e) => handleChangeStatus(member.id, e.target.value)}
                      className="border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
                    >
                      <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
                      <option value="visiteur">Visiteur</option>
                      <option value="a déjà mon église">A déjà mon église</option>
                      <option value="evangelisé">Evangelisé</option>
                      <option value="actif">Actif</option>
                      <option value="ancien">Ancien</option>
                    </select>
                  </div>
                </div>

                {/* Téléphone / Statut (moins d'espace) */}
                <p className="text-sm text-gray-600 mb-1">📱 {member.telephone || "—"}</p>
                <p className="text-sm font-semibold mb-1" style={{ color: getBorderColor(member) }}>
                  {member.statut || "—"}
                </p>

                {/* Détails lien (réduit margin) */}
                <p
                  className="mt-1 text-blue-500 underline cursor-pointer"
                  onClick={() =>
                    setDetailsOpen((prev) => ({ ...prev, [member.id]: !prev[member.id] }))
                  }
                >
                  {detailsOpen[member.id] ? "Fermer détails" : "Détails"}
                </p>

                {/* Contenu détaillé (cellule en bas, couleur verte pour label, menu noir) */}
                {detailsOpen[member.id] && (
                  <div className="mt-2 text-sm text-gray-700">
                    <p className="mb-1">Email : {member.email || "—"}</p>
                    <p className="mb-1">Besoin : {member.besoin || "—"}</p>
                    <p className="mb-1">Ville : {member.ville || "—"}</p>
                    <p className="mb-1">Infos supplémentaires : {member.infos_supplementaires || "—"}</p>

                    <p className="text-green-600 font-semibold mt-2 mb-1">Cellule :</p>
                    <select
                      value={selectedCellules[member.id] || ""}
                      onChange={(e) =>
                        setSelectedCellules((prev) => ({
                          ...prev,
                          [member.id]: e.target.value,
                        }))
                      }
                      className="border rounded-lg px-2 py-1 text-sm text-black w-full"
                    >
                      <option value="">-- Choisir cellule --</option>
                      {cellules.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.cellule} ({c.responsable})
                        </option>
                      ))}
                    </select>

                    {selectedCellules[member.id] && (
                      <button
                        onClick={() => handleSendWhatsapp(member)}
                        disabled={sending[member.id]}
                        className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl w-full"
                      >
                        {sending[member.id] ? "Envoi..." : "Envoyer par WhatsApp"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Ligne de séparation unique entre nouveaux et anciens (si nécessaire) */}
            {nouveaux.length > 0 && anciens.length > 0 && (
              <div
                className="col-span-full my-4"
                style={{ height: "2px", background: "linear-gradient(to right, #cbd5e1, #7f9cf5)" }}
              />
            )}

            {/* Anciens */}
            {anciens.map((member) => (
              <div
                key={member.id}
                className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between border-t-4"
                style={{ borderTopColor: getBorderColor(member), minHeight: "230px" }}
              >
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-bold text-gray-800 mb-0">
                    {member.prenom} {member.nom}
                  </h2>
                  <select
                    value={member.statut}
                    onChange={(e) => handleChangeStatus(member.id, e.target.value)}
                    className="border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  >
                    <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
                    <option value="visiteur">Visiteur</option>
                    <option value="a déjà mon église">A déjà mon église</option>
                    <option value="evangelisé">Evangelisé</option>
                    <option value="actif">Actif</option>
                    <option value="ancien">Ancien</option>
                  </select>
                </div>

                <p className="text-sm text-gray-600 mb-1">📱 {member.telephone || "—"}</p>
                <p className="text-sm font-semibold mb-1" style={{ color: getBorderColor(member) }}>
                  {member.statut || "—"}
                </p>

                <p
                  className="mt-1 text-blue-500 underline cursor-pointer"
                  onClick={() =>
                    setDetailsOpen((prev) => ({ ...prev, [member.id]: !prev[member.id] }))
                  }
                >
                  {detailsOpen[member.id] ? "Fermer détails" : "Détails"}
                </p>

                {detailsOpen[member.id] && (
                  <div className="mt-2 text-sm text-gray-700">
                    <p className="mb-1">Email : {member.email || "—"}</p>
                    <p className="mb-1">Besoin : {member.besoin || "—"}</p>
                    <p className="mb-1">Ville : {member.ville || "—"}</p>
                    <p className="mb-1">Infos supplémentaires : {member.infos_supplementaires || "—"}</p>

                    <p className="text-green-600 font-semibold mt-2 mb-1">Cellule :</p>
                    <select
                      value={selectedCellules[member.id] || ""}
                      onChange={(e) =>
                        setSelectedCellules((prev) => ({
                          ...prev,
                          [member.id]: e.target.value,
                        }))
                      }
                      className="border rounded-lg px-2 py-1 text-sm text-black w-full"
                    >
                      <option value="">-- Choisir cellule --</option>
                      {cellules.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.cellule} ({c.responsable})
                        </option>
                      ))}
                    </select>

                    {selectedCellules[member.id] && (
                      <button
                        onClick={() => handleSendWhatsapp(member)}
                        disabled={sending[member.id]}
                        className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl w-full"
                      >
                        {sending[member.id] ? "Envoi..." : "Envoyer par WhatsApp"}
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        /* ---------- VUE TABLE ---------- */
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
                    <span
                      className="text-blue-500 underline cursor-pointer"
                      onClick={() =>
                        setDetailsOpen((prev) => ({ ...prev, [member.id]: !prev[member.id] }))
                      }
                    >
                      {detailsOpen[member.id] ? "Fermer détails" : "Détails"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Détails pour la table — même contenu et fonctionnalités que les cards */}
          {filteredMembers.map(
            (member) =>
              detailsOpen[member.id] && (
                <div key={member.id + "-details"} className="bg-white p-4 rounded-2xl shadow-md mt-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-bold">{member.prenom} {member.nom}</p>
                      <p className="text-sm">📱 {member.telephone || "—"}</p>
                      <p className="text-sm">Email : {member.email || "—"}</p>
                      <p className="text-sm">Ville : {member.ville || "—"}</p>
                      <p className="text-sm">Besoin : {member.besoin || "—"}</p>
                      <p className="text-sm">Infos supplémentaires : {member.infos_supplementaires || "—"}</p>
                    </div>

                    <div style={{ minWidth: 220 }}>
                      {/* Menu statut (table) */}
                      <select
                        value={member.statut}
                        onChange={(e) => handleChangeStatus(member.id, e.target.value)}
                        className="border rounded-lg px-2 py-1 text-sm mb-2 w-full"
                      >
                        <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
                        <option value="visiteur">Visiteur</option>
                        <option value="a déjà mon église">A déjà mon église</option>
                        <option value="evangelisé">Evangelisé</option>
                        <option value="actif">Actif</option>
                        <option value="ancien">Ancien</option>
                      </select>

                      <p className="text-green-600 font-semibold mt-2 mb-1">Cellule :</p>
                      <select
                        value={selectedCellules[member.id] || ""}
                        onChange={(e) =>
                          setSelectedCellules((prev) => ({
                            ...prev,
                            [member.id]: e.target.value,
                          }))
                        }
                        className="border rounded-lg px-2 py-1 text-sm text-black w-full"
                      >
                        <option value="">-- Choisir cellule --</option>
                        {cellules.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.cellule} ({c.responsable})
                          </option>
                        ))}
                      </select>

                      {selectedCellules[member.id] && (
                        <button
                          onClick={() => handleSendWhatsapp(member)}
                          disabled={sending[member.id]}
                          className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl w-full"
                        >
                          {sending[member.id] ? "Envoi..." : "Envoyer par WhatsApp"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )
          )}
        </div>
      )}

      {/* bouton scroll top */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-5 right-5 text-white text-2xl font-bold"
      >
        ↑
      </button>

      <p className="mt-6 mb-6 text-center text-white text-lg font-handwriting-light">
        Car le corps ne se compose pas d’un seul membre, mais de plusieurs. 1
        Corinthiens 12:14 ❤️
      </p>
    </div>
  );
}
