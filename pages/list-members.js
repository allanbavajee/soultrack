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

  const handleSendWhatsApp = (member) => {
    const cellule = cellules.find((c) => c.id === selectedCellules[member.id]);
    if (!cellule) {
      alert("Veuillez d'abord sélectionner une cellule.");
      return;
    }

    const message = encodeURIComponent(
      `👋 Salut ${cellule.responsable},\n\n` +
        `🙏 Dieu nous a envoyé une nouvelle âme à suivre.\nVoici ses infos :\n\n` +
        `- 👤 Nom : ${member.prenom || ""} ${member.nom || ""}\n` +
        `- 📱 Téléphone : ${member.telephone || "—"}\n` +
        `- 📧 Email : ${member.email || "—"}\n` +
        `- 🏙 Ville : ${member.ville || "—"}\n` +
        `- 🙏 Besoin : ${member.besoin || "—"}\n` +
        `- 📝 Infos supplémentaires : ${member.how_came || "—"}\n\n` +
        `Merci pour ton cœur ❤ et ton amour ✨`
    );

    const whatsappUrl = `https://wa.me/${cellule.telephone}?text=${message}`;
    window.open(whatsappUrl, "_blank");
  };

  const filteredMembers = members.filter((m) => {
    if (!filter) return true;
    if (filter === "star") return m.star === true;
    return m.statut === filter;
  });

  const countFiltered = filteredMembers.length;

  const getBorderColor = (member) => {
    if (member.star) return "#FBC02D";
    if (member.statut === "actif") return "#4285F4";
    if (member.statut === "a déjà mon église") return "#EA4335";
    if (member.statut === "ancien") return "#999999";
    if (member.statut === "veut rejoindre ICC" || member.statut === "visiteur")
      return "#34A853";
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const nouveaux = filteredMembers.filter(
    (m) => m.statut === "visiteur" || m.statut === "veut rejoindre ICC"
  );
  const anciens = filteredMembers.filter(
    (m) => m.statut !== "visiteur" && m.statut !== "veut rejoindre ICC"
  );

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
        Chaque personne a une valeur infinie. Ensemble, nous avançons, grandissons et partageons
        l’amour de Christ dans chaque action ❤️
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
      <div className="w-full max-w-5xl">
        {[...nouveaux, ...anciens].map((member) => (
          <div key={member.id} className="mb-6">
            <div
              className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
              style={{ borderTop: `4px solid ${getBorderColor(member)}` }}
            >
              <div>
                <h2 className="text-lg font-bold text-gray-800 mb-1 flex items-center justify-between">
                  <span>
                    {member.prenom} {member.nom}
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
                <p className="text-sm font-semibold" style={{ color: getBorderColor(member) }}>
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
                <div className="mt-3 text-sm text-gray-700 space-y-2">
                  <p>📧 <strong>Email :</strong> {member.email || "—"}</p>
                  <p>🏙 <strong>Ville :</strong> {member.ville || "—"}</p>
                  <p>🙏 <strong>Besoin :</strong> {member.besoin || "—"}</p>
                  <p>📝 <strong>Infos supplémentaires :</strong> {member.how_came || "—"}</p>

                  <div className="mt-3">
                    <label className="block mb-1 font-semibold text-gray-700">
                      Sélectionner une cellule :
                    </label>
                    <select
                      className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      value={selectedCellules[member.id] || ""}
                      onChange={(e) =>
                        setSelectedCellules((prev) => ({
                          ...prev,
                          [member.id]: e.target.value,
                        }))
                      }
                    >
                      <option value="">-- Choisir une cellule --</option>
                      {cellules.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.cellule} ({c.responsable})
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleSendWhatsApp(member)}
                      className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg shadow"
                    >
                      📤 Envoyer par WhatsApp
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Flèche haut */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-5 right-5 text-white text-2xl font-bold bg-transparent hover:text-gray-200"
      >
        ↑
      </button>

      {/* Verset */}
      <p className="mt-6 mb-4 text-center text-white text-lg font-handwriting-light">
        Car le corps ne se compose pas d’un seul membre, mais de plusieurs. 1 Corinthiens 12:14 ❤️
      </p>
    </div>
  );
}
