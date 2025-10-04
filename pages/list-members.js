// pages/list-members.js
import { motion, AnimatePresence } from "framer-motion";
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

  const getBorderColor = (member) => {
    if (member.star) return "#FBC02D";
    if (member.statut === "actif") return "#4285F4";
    if (member.statut === "a déjà mon église") return "#EA4335";
    if (member.statut === "ancien") return "#999999";
    if (member.statut === "veut rejoindre ICC" || member.statut === "visiteur")
      return "#34A853";
  };

  const findCellule = (celluleId) =>
    cellules.find((c) => c.id === celluleId) || null;

  const toggleDetails = (id) => {
    setDetailsOpen((prev) => ({ ...prev, [id]: !prev[id] }));
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
        Chaque personne compte, et ensemble nous formons une famille unie dans l’amour du Christ ❤️
      </p>

      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => {
          const cellule = findCellule(member.cellule_id);
          return (
            <div
              key={member.id}
              className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-all duration-300"
              style={{ borderTop: `4px solid ${getBorderColor(member)}` }}
            >
              <div className="flex flex-col justify-between">
                <h2 className="text-lg font-bold text-gray-800 mb-1">
                  {member.prenom} {member.nom}
                  {member.star && <span className="ml-1 text-yellow-400">⭐</span>}
                </h2>
                <p className="text-sm text-gray-600 mb-1">📱 {member.telephone || "—"}</p>
                <p className="text-sm font-semibold" style={{ color: getBorderColor(member) }}>
                  {member.statut || "—"}
                </p>

                <p
                  className="mt-2 text-blue-600 underline cursor-pointer"
                  onClick={() => toggleDetails(member.id)}
                >
                  {detailsOpen[member.id] ? "Fermer détails" : "Détails"}
                </p>

                <AnimatePresence>
                  {detailsOpen[member.id] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2 text-sm text-gray-700 bg-gray-50 rounded-lg p-3 space-y-2"
                    >
                      <p>📧 <span className="font-medium">{member.email || "Non renseigné"}</span></p>
                      <p>🧭 <span className="font-medium">Comment il est venu :</span> {member.how_came || "—"}</p>
                      <p>🙏 <span className="font-medium">Besoin :</span> {member.besoin || "—"}</p>

                      {cellule ? (
                        <>
                          <p>🏠 <span className="font-medium">Cellule :</span> {cellule.cellule}</p>
                          <p>👤 <span className="font-medium">Responsable :</span> {cellule.responsable}</p>
                          {cellule.telephone && (
                            <a
                              href={`https://wa.me/${cellule.telephone}?text=${encodeURIComponent(
                                `Bonjour ${cellule.responsable},\nJe te contacte concernant ${member.prenom} ${member.nom}.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block mt-2 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200"
                            >
                              💬 Contacter le responsable
                            </a>
                          )}
                        </>
                      ) : (
                        <p className="text-gray-500 italic">Aucune cellule assignée</p>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-center text-white text-lg font-handwriting-light">
        « Car le corps ne se compose pas d’un seul membre, mais de plusieurs. » — 1 Corinthiens 12:14 ❤️
      </p>
    </div>
  );
}
