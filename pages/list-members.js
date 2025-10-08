// pages/list-members.js
"use client";
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function ListMembers() {
  const [members, setMembers] = useState([]);
  const [cellules, setCellules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCellules, setSelectedCellules] = useState({});
  const [detailsOpen, setDetailsOpen] = useState({});
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState("card");

  useEffect(() => {
    fetchMembers();
    fetchCellules();
  }, []);

  async function fetchMembers() {
    setLoading(true);
    const { data, error } = await supabase.from("members").select("*");
    if (error) console.error(error);
    else setMembers(data || []);
    setLoading(false);
  }

  async function fetchCellules() {
    const { data, error } = await supabase.from("cellules").select("*");
    if (error) console.error(error);
    else setCellules(data || []);
  }

  async function handleSendWhatsapp(member) {
    try {
      const celluleId = selectedCellules[member.id];
      const cellule = cellules.find((c) => c.id === celluleId);

      if (!cellule || !cellule.telephone) {
        alert("Numéro de la cellule introuvable.");
        return;
      }

      const message = `👋 Salut ${cellule.responsable},

🙏 Dieu nous a envoyé une nouvelle âme à suivre.
Voici ses infos :

- 👤 Nom : ${member.nom} ${member.prenom}
- 📱 Téléphone : ${member.telephone}
- 📧 Email : ${member.email || "—"}
- 🏙 Ville : ${member.ville || "—"}
- 🙏 Besoin : ${member.besoin || "—"}
- 📝 Infos supplémentaires : ${member.infos_supplementaires || "—"}

Merci pour ton cœur ❤ et son amour ✨`;

      const url = `https://wa.me/${cellule.telephone}?text=${encodeURIComponent(
        message
      )}`;
      window.open(url, "_blank");

      // MAJ statut si visiteur ou veut rejoindre ICC
      if (
        member.statut === "visiteur" ||
        member.statut === "veut rejoindre ICC"
      ) {
        await supabase
          .from("members")
          .update({ statut: "actif" })
          .eq("id", member.id);
        fetchMembers();
      }
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'envoi du WhatsApp.");
    }
  }

  const filteredMembers =
    filter === "all"
      ? members
      : members.filter((m) => m.statut === filter);

  const nouveaux = filteredMembers.filter(
    (m) => m.statut === "visiteur" || m.statut === "veut rejoindre ICC"
  );
  const anciens = filteredMembers.filter(
    (m) => m.statut !== "visiteur" && m.statut !== "veut rejoindre ICC"
  );

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }

  return (
    <div className="p-6">
      <h1 className="text-center text-2xl font-bold mb-4 text-white">
        Chaque personne compte ❤️
      </h1>

      {/* Toggle Vue */}
      <p
        className="text-center cursor-pointer text-black mb-6"
        onClick={() =>
          setViewMode(viewMode === "card" ? "table" : "card")
        }
      >
        {viewMode === "card" ? "Vue Table" : "Vue Card"}
      </p>

      {/* Filtres */}
      <div className="flex justify-center mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-4 py-2"
        >
          <option value="all">
            Tous ({members.length})
          </option>
          <option value="visiteur">
            Visiteurs (
            {members.filter((m) => m.statut === "visiteur").length})
          </option>
          <option value="veut rejoindre ICC">
            Veut rejoindre ICC (
            {
              members.filter((m) => m.statut === "veut rejoindre ICC")
                .length
            }
            )
          </option>
          <option value="actif">
            Actifs (
            {members.filter((m) => m.statut === "actif").length})
          </option>
        </select>
      </div>

      {loading ? (
        <p className="text-center text-white">Chargement...</p>
      ) : viewMode === "card" ? (
        <>
          {/* Nouveaux membres */}
          {nouveaux.length > 0 && (
            <>
              <h2 className="text-lg font-semibold text-white mb-4">
                Nouveaux contacts
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                {nouveaux.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between min-h-[220px]"
                  >
                    <div className="space-y-1">
                      <p>
                        <span className="font-semibold">Nom :</span>{" "}
                        {member.nom}
                      </p>
                      <p>
                        <span className="font-semibold">Prénom :</span>{" "}
                        {member.prenom}
                      </p>
                      <p>
                        <span className="font-semibold">Statut :</span>{" "}
                        <span className="text-blue-600">
                          {member.statut} (Nouveau)
                        </span>
                      </p>
                      <p>
                        <span className="font-semibold">Téléphone :</span>{" "}
                        {member.telephone}
                      </p>
                      <p
                        className="text-blue-500 underline cursor-pointer"
                        onClick={() =>
                          setDetailsOpen((prev) => ({
                            ...prev,
                            [member.id]: !prev[member.id],
                          }))
                        }
                      >
                        {detailsOpen[member.id]
                          ? "Fermer détails"
                          : "Détails"}
                      </p>
                    </div>

                    {detailsOpen[member.id] && (
                      <div className="mt-2 text-sm">
                        <p>Email : {member.email || "—"}</p>
                        <p>Ville : {member.ville || "—"}</p>
                        <p>Besoin : {member.besoin || "—"}</p>
                        <p>
                          Infos supplémentaires :{" "}
                          {member.infos_supplementaires || "—"}
                        </p>
                        <p className="text-green-600 font-semibold">
                          Cellule:{" "}
                          <select
                            value={selectedCellules[member.id] || ""}
                            onChange={(e) =>
                              setSelectedCellules((prev) => ({
                                ...prev,
                                [member.id]: Number(e.target.value),
                              }))
                            }
                            className="border rounded px-2 py-1 text-sm text-black"
                          >
                            <option value="">Sélectionner</option>
                            {cellules.map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.cellule} ({c.responsable})
                              </option>
                            ))}
                          </select>
                        </p>
                        {selectedCellules[member.id] && (
                          <button
                            onClick={() => handleSendWhatsapp(member)}
                            className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl w-full"
                          >
                            Envoyer par WhatsApp
                          </button>
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          Contact venu le{" "}
                          {formatDate(member.created_at)}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="h-1 bg-gradient-to-r from-gray-300 via-blue-300 to-gray-300 rounded-full mb-8"></div>
            </>
          )}

          {/* Anciens membres */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {anciens.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-xl shadow-md p-4 flex flex-col justify-between min-h-[220px]"
              >
                <div className="space-y-1">
                  <p>
                    <span className="font-semibold">Nom :</span>{" "}
                    {member.nom}
                  </p>
                  <p>
                    <span className="font-semibold">Prénom :</span>{" "}
                    {member.prenom}
                  </p>
                  <p>
                    <span className="font-semibold">Statut :</span>{" "}
                    {member.statut}
                  </p>
                  <p>
                    <span className="font-semibold">Téléphone :</span>{" "}
                    {member.telephone}
                  </p>
                  <p
                    className="text-blue-500 underline cursor-pointer"
                    onClick={() =>
                      setDetailsOpen((prev) => ({
                        ...prev,
                        [member.id]: !prev[member.id],
                      }))
                    }
                  >
                    {detailsOpen[member.id]
                      ? "Fermer détails"
                      : "Détails"}
                  </p>
                </div>

                {detailsOpen[member.id] && (
                  <div className="mt-2 text-sm">
                    <p>Email : {member.email || "—"}</p>
                    <p>Ville : {member.ville || "—"}</p>
                    <p>Besoin : {member.besoin || "—"}</p>
                    <p>
                      Infos supplémentaires :{" "}
                      {member.infos_supplementaires || "—"}
                    </p>
                    <p className="text-green-600 font-semibold">
                      Cellule:{" "}
                      <select
                        value={selectedCellules[member.id] || ""}
                        onChange={(e) =>
                          setSelectedCellules((prev) => ({
                            ...prev,
                            [member.id]: Number(e.target.value),
                          }))
                        }
                        className="border rounded px-2 py-1 text-sm text-black"
                      >
                        <option value="">Sélectionner</option>
                        {cellules.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.cellule} ({c.responsable})
                          </option>
                        ))}
                      </select>
                    </p>
                    {selectedCellules[member.id] && (
                      <button
                        onClick={() => handleSendWhatsapp(member)}
                        className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl w-full"
                      >
                        Envoyer par WhatsApp
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      ) : (
        // Vue Table
        <div className="w-full max-w-5xl overflow-x-auto">
          <table className="table-auto w-full bg-white rounded-2xl shadow-md">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-4 py-2">Nom</th>
                <th className="px-4 py-2">Prénom</th>
                <th className="px-4 py-2">Statut</th>
                <th className="px-4 py-2">Détails</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr
                  key={member.id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-4 py-2">{member.nom}</td>
                  <td className="px-4 py-2">{member.prenom}</td>
                  <td className="px-4 py-2">{member.statut}</td>
                  <td className="px-4 py-2">
                    <span
                      className="text-blue-500 underline"
                      onClick={() =>
                        setDetailsOpen((prev) => ({
                          ...prev,
                          [member.id]: !prev[member.id],
                        }))
                      }
                    >
                      {detailsOpen[member.id]
                        ? "Fermer détails"
                        : "Détails"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Détails sous table */}
          {filteredMembers.map(
            (member) =>
              detailsOpen[member.id] && (
                <div
                  key={member.id + "-details"}
                  className="bg-white p-4 rounded-2xl shadow-md mt-2"
                >
                  <p>Email : {member.email || "—"}</p>
                  <p>Ville : {member.ville || "—"}</p>
                  <p>Besoin : {member.besoin || "—"}</p>
                  <p>
                    Infos supplémentaires :{" "}
                    {member.infos_supplementaires || "—"}
                  </p>
                  <p className="text-green-600 font-semibold">
                    Cellule:{" "}
                    <select
                      value={selectedCellules[member.id] || ""}
                      onChange={(e) =>
                        setSelectedCellules((prev) => ({
                          ...prev,
                          [member.id]: Number(e.target.value),
                        }))
                      }
                      className="border rounded px-2 py-1 text-sm text-black"
                    >
                      <option value="">Sélectionner</option>
                      {cellules.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.cellule} ({c.responsable})
                        </option>
                      ))}
                    </select>
                  </p>
                  {selectedCellules[member.id] && (
                    <button
                      onClick={() => handleSendWhatsapp(member)}
                      className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl w-full"
                    >
                      Envoyer par WhatsApp
                    </button>
                  )}
                  {member.statut === "visiteur" ||
                  member.statut === "veut rejoindre ICC" ? (
                    <p className="text-xs text-gray-500 mt-2">
                      Contact venu le {formatDate(member.created_at)}
                    </p>
                  ) : null}
                </div>
              )
          )}
        </div>
      )}
    </div>
  );
}
