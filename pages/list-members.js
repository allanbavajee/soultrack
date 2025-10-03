// pages/list-members.js
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import Image from "next/image";

export default function ListMembers() {
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState("");
  const [detailsOpen, setDetailsOpen] = useState({});
  const [cellules, setCellules] = useState([]);
  const [selectedCellules, setSelectedCellules] = useState({});
  const [selectedEvangelises, setSelectedEvangelises] = useState({});

  useEffect(() => {
    fetchMembers();
    fetchCellules();
  }, []);

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from("membres")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setMembers(data);
  };

  const fetchCellules = async () => {
    const { data, error } = await supabase
      .from("cellules")
      .select("id, cellule, responsable, telephone");
    if (!error && data) setCellules(data);
  };

  const handleChangeStatus = async (id, newStatus) => {
    await supabase.from("membres").update({ statut: newStatus }).eq("id", id);
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, statut: newStatus } : m))
    );
  };

  const handleWhatsAppSingle = async (member, cellule) => {
    if (!cellule) return;

    const prenomResponsable = cellule.responsable.split(" ")[0];
    const message = `👋 Salut ${prenomResponsable},\n\n🙏 Dieu nous a envoyé une nouvelle âme à suivre.  
Voici ses infos :\n\n- 👤 Nom : ${member.prenom} ${member.nom}  
- 📱 Téléphone : ${member.telephone} ${member.is_whatsapp ? "(WhatsApp ✅)" : ""}  
- 📧 Email : ${member.email || "—"}  
- 🏙️ Ville : ${member.ville || "—"}  
- 🙏 Besoin : ${member.besoin || "—"}  
- 📝 Infos supplémentaires : ${member.infos_supplementaires || "—"}\n\nMerci pour ton cœur ❤️ et son amour ✨`;

    window.open(
      `https://wa.me/${cellule.telephone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    // Mise à jour membre en actif
    await supabase.from("membres").update({ statut: "actif" }).eq("id", member.id);

    // Création du suivi
    await supabase.from("suivis_membres").insert([
      { membre_id: member.id, cellule_id: cellule.id, statut: "envoye" },
    ]);

    setMembers((prev) =>
      prev.map((m) => (m.id === member.id ? { ...m, statut: "actif" } : m))
    );
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const getBorderColor = (member) => {
    if (member.star) return "#FBC02D";
    if (member.statut === "actif") return "#4285F4";
    if (member.statut === "a déjà mon église") return "#EA4335";
    if (member.statut === "ancien") return "#999999";
    if (member.statut === "veut rejoindre ICC" || member.statut === "visiteur")
      return "#34A853";
  };

  const filteredMembers = members.filter((m) => {
    if (!filter) return true;
    if (filter === "star") return m.star === true;
    return m.statut === filter;
  });

  const countFiltered = filteredMembers.length;

  // Séparer nouveaux et anciens
  const nouveaux = filteredMembers.filter(
    (m) => m.statut === "visiteur" || m.statut === "veut rejoindre ICC"
  );
  const anciens = filteredMembers.filter(
    (m) => m.statut !== "visiteur" && m.statut !== "veut rejoindre ICC"
  );

  // Tri anciens par created_at
  anciens.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div
      className="min-h-screen flex flex-col items-center p-6"
      style={{ background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)" }}
    >
      {/* Retour */}
      <button
        onClick={() => window.history.back()}
        className="self-start mb-4 flex items-center text-white font-semibold hover:text-gray-200"
      >
        ← Retour
      </button>

      {/* Logo */}
      <div className="mt-2 mb-2">
        <Image src="/logo.png" alt="SoulTrack Logo" width={80} height={80} />
      </div>

      {/* Titre */}
      <h1 className="text-5xl sm:text-6xl font-handwriting text-white text-center mb-3">
        SoulTrack
      </h1>

      {/* Message inspirant */}
      <p className="text-center text-white text-lg mb-6 font-handwriting-light">
        Chaque personne a une valeur infinie. Ensemble, nous avançons, grandissons et partageons l’amour de Christ dans chaque action ❤️
      </p>

      {/* Filtres + compte */}
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

      {/* Liste des membres */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {[...nouveaux, ...anciens].map((member, index) => {
          const isFirstAncien = index === nouveaux.length && nouveaux.length > 0;
          return (
            <div key={member.id}>
              {/* Ligne de séparation */}
              {isFirstAncien && (
                <hr className="border-white border-t w-full my-2" />
              )}

              <div
                className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col justify-between"
                style={{ borderTop: `4px solid ${getBorderColor(member)}` }}
              >
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-1 flex items-center justify-between">
                    <span>
                      {member.prenom} {member.nom}{" "}
                      {(member.statut === "visiteur" || member.statut === "veut rejoindre ICC") && (
                        <span className="ml-1 text-green-500 font-semibold text-sm">Nouveau</span>
                      )}
                      {member.star && <span className="ml-1 text-yellow-400">⭐</span>}
                    </span>
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
                  </h2>
                  <p className="text-sm text-gray-600 mb-1">📱 {member.telephone || "—"}</p>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: getBorderColor(member) }}
                  >
                    {member.statut || "—"}
                  </p>
                </div>

                <p
                  className="mt-2 text-blue-500 underline cursor-pointer"
                  onClick={() =>
                    setDetailsOpen((prev) => ({ ...prev, [member.id]: !prev[member.id] }))
                  }
                >
                  {detailsOpen[member.id] ? "Fermer détails" : "Détails"}
                </p>

                {detailsOpen[member.id] && (
                  <div className="mt-2 text-sm text-gray-700 space-y-2">
                    <p>Email : {member.email || "—"}</p>
                    <p>Besoin : {member.besoin || "—"}</p>
                    <p>Ville : {member.ville || "—"}</p>
                    <p>WhatsApp : {member.is_whatsapp ? "✅ Oui" : "❌ Non"}</p>
                    <p>Infos supplémentaires : {member.infos_supplementaires || "—"}</p>

                    {(member.statut === "visiteur" || member.statut === "veut rejoindre ICC") && (
                      <div className="mt-2">
                        <label className="block mb-1 font-semibold">Choisir une cellule :</label>
                        <select
                          className="w-full p-2 border rounded-lg mb-2"
                          value={selectedCellules[member.id]?.cellule || ""}
                          onChange={(e) => {
                            const cellule = cellules.find((c) => c.cellule === e.target.value);
                            setSelectedCellules((prev) => ({ ...prev, [member.id]: cellule }));
                          }}
                        >
                          <option value="">-- Sélectionner cellule --</option>
                          {cellules.map((c) => (
                            <option key={c.id} value={c.cellule}>{c.cellule}</option>
                          ))}
                        </select>
                        <button
                          className="w-full py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
                          onClick={() => handleWhatsAppSingle(member, selectedCellules[member.id])}
                        >
                          Envoyer WhatsApp au responsable
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bouton remonter en haut */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-5 right-5 text-white text-2xl font-bold hover:text-gray-200"
      >
        ↑
      </button>

      {/* Message final */}
      <p className="mt-6 mb-4 text-center text-white text-lg font-handwriting-light">
        Car le corps ne se compose pas d’un seul membre, mais de plusieurs. 1 Corinthiens 12:14 ❤️
      </p>
    </div>
  );
}
