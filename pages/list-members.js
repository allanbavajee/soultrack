// pages/list-members.js
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import Image from "next/image";

export default function ListMembers() {
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState("");
  const [detailsOpen, setDetailsOpen] = useState({});
  const [cellules, setCellules] = useState([]);

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

  const filteredMembers = members.filter((m) => {
    if (!filter) return true;
    if (filter === "star") return m.star === true;
    return m.statut === filter;
  });

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

      {/* Filtres */}
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
        <span className="text-white italic text-opacity-80">
          Résultats: {filteredMembers.length}
        </span>
      </div>

      {/* Liste des membres */}
      <div className="w-full max-w-6xl">
        {/* Nouveaux membres */}
        {nouveaux.length > 0 && (
          <>
            <h2 className="text-2xl text-white font-semibold mb-4">
              Nouveaux membres
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              {nouveaux.map((member) => (
                <div
                  key={member.id}
                  className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border-l-4"
                  style={{ borderColor: getBorderColor(member) }}
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-1 flex justify-between">
                    <span>
                      {member.prenom} {member.nom}{" "}
                      <span className="ml-1 text-green-500 font-semibold text-sm">
                        Nouveau
                      </span>
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
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    📱 {member.telephone || "—"}
                  </p>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: getBorderColor(member) }}
                  >
                    {member.statut || "—"}
                  </p>

                  {/* Bouton Détails */}
                  <p
                    className="mt-2 text-blue-500 underline cursor-pointer"
                    onClick={() =>
                      setDetailsOpen((prev) => ({
                        ...prev,
                        [member.id]: !prev[member.id],
                      }))
                    }
                  >
                    {detailsOpen[member.id] ? "Fermer détails" : "Détails"}
                  </p>

                  {/* Détails */}
                  {detailsOpen[member.id] && (
                    <div className="mt-3 text-sm text-gray-700 space-y-2 border-t pt-2">
                      <p>📧 <strong>Email:</strong> {member.email || "—"}</p>
                      <p>🕊️ <strong>Comment est-il venu:</strong> {member.how_came || "—"}</p>
                      <p>🙏 <strong>Besoins:</strong> {member.besoin || "—"}</p>
                      <p>👤 <strong>Assigné à:</strong> {member.assignee || "—"}</p>

                      {(() => {
                        const cellule = cellules.find(
                          (c) => c.cellule === member.assignee
                        );
                        if (!cellule)
                          return (
                            <p className="text-gray-500 italic">
                              Aucune cellule assignée
                            </p>
                          );

                        const message = encodeURIComponent(
                          `Bonjour ${cellule.responsable},\nJe te contacte à propos de ${member.prenom} ${member.nom} (${member.telephone || "—"}), que tu suis dans la cellule "${cellule.cellule}".`
                        );
                        const whatsappLink = `https://wa.me/${cellule.telephone?.replace(
                          /\D/g,
                          ""
                        )}?text=${message}`;

                        return (
                          <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg font-semibold mt-2"
                          >
                            📲 Contacter {cellule.responsable} sur WhatsApp
                          </a>
                        );
                      })()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* Anciens membres */}
        {anciens.length > 0 && (
          <>
            <h2 className="text-2xl text-white font-semibold mb-4">
              Membres existants
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {anciens.map((member) => (
                <div
                  key={member.id}
                  className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border-l-4"
                  style={{ borderColor: getBorderColor(member) }}
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-1 flex justify-between">
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
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    📱 {member.telephone || "—"}
                  </p>
                  <p
                    className="text-sm font-semibold"
                    style={{ color: getBorderColor(member) }}
                  >
                    {member.statut || "—"}
                  </p>

                  <p
                    className="mt-2 text-blue-500 underline cursor-pointer"
                    onClick={() =>
                      setDetailsOpen((prev) => ({
                        ...prev,
                        [member.id]: !prev[member.id],
                      }))
                    }
                  >
                    {detailsOpen[member.id] ? "Fermer détails" : "Détails"}
                  </p>

                  {detailsOpen[member.id] && (
                    <div className="mt-3 text-sm text-gray-700 space-y-2 border-t pt-2">
                      <p>📧 <strong>Email:</strong> {member.email || "—"}</p>
                      <p>🕊️ <strong>Comment est-il venu:</strong> {member.how_came || "—"}</p>
                      <p>🙏 <strong>Besoins:</strong> {member.besoin || "—"}</p>
                      <p>👤 <strong>Assigné à:</strong> {member.assignee || "—"}</p>

                      {(() => {
                        const cellule = cellules.find(
                          (c) => c.cellule === member.assignee
                        );
                        if (!cellule)
                          return (
                            <p className="text-gray-500 italic">
                              Aucune cellule assignée
                            </p>
                          );

                        const message = encodeURIComponent(
                          `Bonjour ${cellule.responsable},\nJe te contacte à propos de ${member.prenom} ${member.nom} (${member.telephone || "—"}), que tu suis dans la cellule "${cellule.cellule}".`
                        );
                        const whatsappLink = `https://wa.me/${cellule.telephone?.replace(
                          /\D/g,
                          ""
                        )}?text=${message}`;

                        return (
                          <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg font-semibold mt-2"
                          >
                            📲 Contacter {cellule.responsable} sur WhatsApp
                          </a>
                        );
                      })()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Bouton retour haut */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-5 right-5 text-white text-2xl font-bold bg-transparent hover:text-gray-200"
      >
        ↑
      </button>

      {/* Verset */}
      <p className="mt-6 mb-4 text-center text-white text-lg font-handwriting-light">
        Car le corps ne se compose pas d’un seul membre, mais de plusieurs.
        <br />— 1 Corinthiens 12:14 ❤️
      </p>
    </div>
  );
}
