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
      await supabase.from("membres").update({ statut: newStatus }).eq("id", id);
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

  // Filtrage simple
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

  // Fonction envoyer WhatsApp
  const sendWhatsapp = (member) => {
    const cellule = cellules.find((c) => c.id === selectedCellules[member.id]);
    if (!cellule || !cellule.telephone) {
      alert("Numéro de la cellule introuvable");
      return;
    }

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

    const url = `https://wa.me/${cellule.telephone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");

    // Changer statut en actif
    handleChangeStatus(member.id, "actif");
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center p-6"
      style={{ background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)" }}
    >
      <button
        onClick={() => window.history.back()}
        className="self-start mb-4 flex items-center text-white font-semibold hover:text-gray-200"
      >
        ← Retour
      </button>

      <div className="mt-2 mb-2">
        <Image src="/logo.png" alt="SoulTrack Logo" width={80} height={80} />
      </div>

      <h1 className="text-5xl sm:text-6xl font-handwriting text-white text-center mb-3">
        SoulTrack
      </h1>
      <p className="text-center text-white text-lg mb-6 font-handwriting-light">
        Chaque personne a une valeur infinie. Ensemble, nous avançons, grandissons et
        partageons l’amour de Christ dans chaque action ❤️
      </p>

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

      {/* Nouveau membres */}
      {nouveaux.length > 0 && (
        <div className="w-full max-w-5xl mb-4">
          <p className="text-white mb-2">
            contact venu le {new Date().toLocaleDateString()}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {nouveaux.map((member) => (
              <div
                key={member.id}
                className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col justify-between border-t-4"
                style={{ borderTopColor: getBorderColor(member), minHeight: "200px" }}
              >
                <h2 className="text-lg font-bold text-gray-800 mb-1 flex justify-between items-center">
                  {member.prenom} {member.nom}{" "}
                  {member.star && <span className="ml-1 text-yellow-400">⭐</span>}
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
                <p className="text-sm font-semibold" style={{ color: getBorderColor(member) }}>
                  {member.statut || "—"}
                </p>
                <p
                  className="mt-2 text-blue-500 underline cursor-pointer"
                  onClick={() =>
                    setDetailsOpen((prev) => ({ ...prev, [member.id]: !prev[member.id] }))
                  }
                >
                  {detailsOpen[member.id] ? "Fermer détails" : "Détails"}
                </p>
                {detailsOpen[member.id] && (
                  <div className="mt-2 text-sm text-gray-700 space-y-1">
                    <p>Email : {member.email || "—"}</p>
                    <p>Besoin : {member.besoin || "—"}</p>
                    <p>Ville : {member.ville || "—"}</p>

                    {/* Menu déroulant cellule */}
                    <div>
                      <label className="block text-sm font-semibold mb-1">Cellule :</label>
                      <select
                        value={selectedCellules[member.id] || ""}
                        onChange={(e) =>
                          setSelectedCellules((prev) => ({
                            ...prev,
                            [member.id]: e.target.value,
                          }))
                        }
                        className="border rounded-lg px-2 py-1 text-sm w-full focus:outline-none focus:ring-1 focus:ring-indigo-400"
                      >
                        <option value="">-- Choisir cellule --</option>
                        {cellules.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.cellule} ({c.responsable})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Bouton WhatsApp */}
                    {selectedCellules[member.id] && (
                      <button
                        onClick={() => sendWhatsapp(member)}
                        className="mt-2 bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                      >
                        Envoyer WhatsApp
                      </button>
                    )}

                    <p>Infos supplémentaires : {member.infos_supplementaires || "—"}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ligne de séparation avec gradient gris/bleu */}
      {nouveaux.length > 0 && (
        <div
          className="w-full max-w-5xl h-1 mb-4"
          style={{ background: "linear-gradient(to right, #d1d5db, #93c5fd)" }}
        />
      )}

      {/* Anciens membres */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {anciens.length === 0 && (
          <p className="text-white col-span-full text-center">Aucun contact trouvé</p>
        )}
        {anciens.map((member) => (
          <div
            key={member.id}
            className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col justify-between border-t-4"
            style={{ borderTopColor: getBorderColor(member), minHeight: "200px" }}
          >
            <h2 className="text-lg font-bold text-gray-800 mb-1 flex justify-between items-center">
              {member.prenom} {member.nom}{" "}
              {member.star && <span className="ml-1 text-yellow-400">⭐</span>}
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
            <p className="text-sm font-semibold" style={{ color: getBorderColor(member) }}>
              {member.statut || "—"}
            </p>
            <p
              className="mt-2 text-blue-500 underline cursor-pointer"
              onClick={() =>
                setDetailsOpen((prev) => ({ ...prev, [member.id]: !prev[member.id] }))
              }
            >
              {detailsOpen[member.id] ? "Fermer détails" : "Détails"}
            </p>
            {detailsOpen[member.id] && (
              <div className="mt-2 text-sm text-gray-700 space-y-1">
                <p>Email : {member.email || "—"}</p>
                <p>Besoin : {member.besoin || "—"}</p>
                <p>Ville : {member.ville || "—"}</p>

                {/* Menu déroulant cellule */}
                <div>
                  <label className="block text-sm font-semibold mb-1">Cellule :</label>
                  <select
                    value={selectedCellules[member.id] || ""}
                    onChange={(e) =>
                      setSelectedCellules((prev) => ({
                        ...prev,
                        [member.id]: e.target.value,
                      }))
                    }
                    className="border rounded-lg px-2 py-1 text-sm w-full focus:outline-none focus:ring-1 focus:ring-indigo-400"
                  >
                    <option value="">-- Choisir cellule --</option>
                    {cellules.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.cellule} ({c.responsable})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bouton WhatsApp */}
                {selectedCellules[member.id] && (
                  <button
                    onClick={() => sendWhatsapp(member)}
                    className="mt-2 bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                  >
                    Envoyer WhatsApp
                  </button>
                )}

                <p>Infos supplémentaires : {member.infos_supplementaires || "—"}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={scrollToTop}
        className="fixed bottom-5 right-5 text-white text-2xl font-bold"
      >
        ↑
      </button>

      <p className="mt-6 mb-6 text-center text-white text-lg font-handwriting-light">
        Car le corps ne se compose pas d’un seul membre, mais de plusieurs. 1 Corinthiens
        12:14 ❤️
      </p>
    </div>
  );
}
