// pages/list-members.js
"use client";
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function ListMembers() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedMember, setExpandedMember] = useState(null);
  const [viewMode, setViewMode] = useState("card"); // "card" ou "table"

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    setLoading(true);
    const { data, error } = await supabase.from("members").select("*").order("created_at", { ascending: false });
    if (!error) setMembers(data || []);
    setLoading(false);
  }

  const handleSendWhatsapp = async (member) => {
    try {
      const { data: celluleData, error } = await supabase
        .from("cellules")
        .select("telephone, nom")
        .eq("id", member.cellule_id)
        .single();

      if (error || !celluleData?.telephone) {
        alert("Numéro de la cellule introuvable.");
        return;
      }

      const celluleTel = celluleData.telephone;
      const message = `👋 Salut ${celluleData.nom},

🙏 Dieu nous a envoyé une nouvelle âme à suivre.
Voici ses infos :

- 👤 Nom : ${member.nom} ${member.prenom}
- 📱 Téléphone : ${member.telephone || "—"}
- 📧 Email : ${member.email || "—"}
- 🏙 Ville : ${member.ville || "—"}
- 🙏 Besoin : ${member.besoin || "—"}
- 📝 Infos supplémentaires : ${member.info_supplementaire || "—"}

Merci pour ton cœur ❤ et son amour ✨`;

      const url = `https://wa.me/${celluleTel}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");

      // mise à jour du statut
      if (member.statut === "visiteur" || member.statut === "veut rejoindre ICC") {
        await supabase.from("members").update({ statut: "actif" }).eq("id", member.id);
        fetchMembers();
      }
    } catch {
      alert("Erreur lors de l'envoi du WhatsApp.");
    }
  };

  const statutColors = {
    actif: "bg-green-500 text-white px-2 py-1 rounded",
    visiteur: "bg-blue-500 text-white px-2 py-1 rounded",
    "veut rejoindre ICC": "bg-blue-500 text-white px-2 py-1 rounded",
    ancien: "bg-gray-500 text-white px-2 py-1 rounded",
    star: "bg-yellow-500 text-black px-2 py-1 rounded",
  };

  const nouveaux = members.filter(m => m.statut === "visiteur" || m.statut === "veut rejoindre ICC");
  const anciens = members.filter(m => m.statut !== "visiteur" && m.statut !== "veut rejoindre ICC");

  if (loading) return <p className="text-center text-white">Chargement...</p>;

  return (
    <div className="p-6">
      <h1 className="text-center text-2xl font-bold text-white mb-4">
        Chaque personne compte ❤️
      </h1>

      {/* Toggle Vue */}
      <div className="flex justify-end mb-4">
        <span
          onClick={() => setViewMode("card")}
          className={`mr-4 cursor-pointer ${viewMode === "card" ? "font-bold underline" : ""}`}
        >
          Vue Card
        </span>
        <span
          onClick={() => setViewMode("table")}
          className={`cursor-pointer ${viewMode === "table" ? "font-bold underline" : ""}`}
        >
          Vue Table
        </span>
      </div>

      {/* Nouveaux contacts */}
      {nouveaux.length > 0 && (
        <>
          <h2 className="text-xl text-white mb-2">
            Nouveaux contacts (venus le{" "}
            {new Date(nouveaux[0].created_at).toLocaleDateString("fr-FR", {
              weekday: "long",
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
            )
          </h2>

          {viewMode === "card" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {nouveaux.map((member) => (
                <div key={member.id} className="bg-white p-4 rounded-lg shadow-md">
                  <h3 className="text-lg font-bold">{member.nom} {member.prenom}</h3>
                  <p className="text-gray-700">{member.telephone}</p>
                  <p className={`inline-block mt-2 ${statutColors[member.statut]}`}>{member.statut}</p>
                  <p
                    className="text-blue-600 mt-2 cursor-pointer underline"
                    onClick={() => setExpandedMember(expandedMember === member.id ? null : member.id)}
                  >
                    Détails
                  </p>

                  {expandedMember === member.id && (
                    <div className="mt-2 text-sm text-gray-700">
                      <p>Email : {member.email || "—"}</p>
                      <p>Ville : {member.ville || "—"}</p>
                      <p>Besoin : {member.besoin || "—"}</p>
                      <p>Infos : {member.info_supplementaire || "—"}</p>
                      <p className="text-green-600">Cellule : {member.cellule_id || "—"}</p>
                      <button
                        onClick={() => handleSendWhatsapp(member)}
                        className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl w-full"
                      >
                        Envoyer par WhatsApp
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <table className="w-full bg-white rounded-lg shadow-md mb-6">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2">Nom</th>
                  <th className="p-2">Prénom</th>
                  <th className="p-2">Statut</th>
                  <th className="p-2">Détails</th>
                </tr>
              </thead>
              <tbody>
                {nouveaux.map((member) => (
                  <tr key={member.id} className="border-t">
                    <td className="p-2">{member.nom}</td>
                    <td className="p-2">{member.prenom}</td>
                    <td className="p-2"><span className={statutColors[member.statut]}>{member.statut}</span></td>
                    <td
                      className="p-2 text-blue-600 cursor-pointer underline"
                      onClick={() => setExpandedMember(expandedMember === member.id ? null : member.id)}
                    >
                      Détails
                    </td>
                    {expandedMember === member.id && (
                      <tr>
                        <td colSpan="4" className="p-2 bg-gray-50 text-sm">
                          <p>Email : {member.email || "—"}</p>
                          <p>Ville : {member.ville || "—"}</p>
                          <p>Besoin : {member.besoin || "—"}</p>
                          <p>Infos : {member.info_supplementaire || "—"}</p>
                          <p className="text-green-600">Cellule : {member.cellule_id || "—"}</p>
                          <button
                            onClick={() => handleSendWhatsapp(member)}
                            className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl"
                          >
                            Envoyer par WhatsApp
                          </button>
                        </td>
                      </tr>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {/* Séparateur si nouveaux existent */}
      {nouveaux.length > 0 && (
        <div className="my-6 h-1 bg-gradient-to-r from-gray-300 via-blue-300 to-gray-300"></div>
      )}

      {/* Anciens contacts */}
      {viewMode === "card" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {anciens.map((member) => (
            <div key={member.id} className="bg-white p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-bold">{member.nom} {member.prenom}</h3>
              <p className="text-gray-700">{member.telephone}</p>
              <p className={`inline-block mt-2 ${statutColors[member.statut]}`}>{member.statut}</p>
              <p
                className="text-blue-600 mt-2 cursor-pointer underline"
                onClick={() => setExpandedMember(expandedMember === member.id ? null : member.id)}
              >
                Détails
              </p>

              {expandedMember === member.id && (
                <div className="mt-2 text-sm text-gray-700">
                  <p>Email : {member.email || "—"}</p>
                  <p>Ville : {member.ville || "—"}</p>
                  <p>Besoin : {member.besoin || "—"}</p>
                  <p>Infos : {member.info_supplementaire || "—"}</p>
                  <p className="text-green-600">Cellule : {member.cellule_id || "—"}</p>
                  <button
                    onClick={() => handleSendWhatsapp(member)}
                    className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl w-full"
                  >
                    Envoyer par WhatsApp
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <table className="w-full bg-white rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">Nom</th>
              <th className="p-2">Prénom</th>
              <th className="p-2">Statut</th>
              <th className="p-2">Détails</th>
            </tr>
          </thead>
          <tbody>
            {anciens.map((member) => (
              <tr key={member.id} className="border-t">
                <td className="p-2">{member.nom}</td>
                <td className="p-2">{member.prenom}</td>
                <td className="p-2"><span className={statutColors[member.statut]}>{member.statut}</span></td>
                <td
                  className="p-2 text-blue-600 cursor-pointer underline"
                  onClick={() => setExpandedMember(expandedMember === member.id ? null : member.id)}
                >
                  Détails
                </td>
                {expandedMember === member.id && (
                  <tr>
                    <td colSpan="4" className="p-2 bg-gray-50 text-sm">
                      <p>Email : {member.email || "—"}</p>
                      <p>Ville : {member.ville || "—"}</p>
                      <p>Besoin : {member.besoin || "—"}</p>
                      <p>Infos : {member.info_supplementaire || "—"}</p>
                      <p className="text-green-600">Cellule : {member.cellule_id || "—"}</p>
                      <button
                        onClick={() => handleSendWhatsapp(member)}
                        className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl"
                      >
                        Envoyer par WhatsApp
                      </button>
                    </td>
                  </tr>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
