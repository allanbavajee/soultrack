// pages/list-members.js
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import Image from "next/image";

export default function ListMembers() {
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState("");
  const [detailsOpen, setDetailsOpen] = useState({});
  const [cellules, setCellules] = useState([]);
  const [selectedCellule, setSelectedCellule] = useState({});

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

  const handleSelectCellule = (memberId, celluleName) => {
    setSelectedCellule((prev) => ({
      ...prev,
      [memberId]: celluleName,
    }));
  };

  // ⚡ Nouvelle fonction minimale pour marquer le membre comme envoyé
  const markAsSent = async (memberId) => {
    if (!memberId) return;

    // 1️⃣ Mettre le statut du membre à "actif"
    await supabase.from("membres").update({ statut: "actif" }).eq("id", memberId);

    // 2️⃣ Vérifier si une entrée existe déjà dans suivis_membres
    const { data: existing } = await supabase
      .from("suivis_membres")
      .select("*")
      .eq("membre_id", memberId)
      .single();

    if (!existing) {
      // Créer l'entrée dans suivis_membres
      await supabase.from("suivis_membres").insert({
        membre_id: memberId,
        statut: "envoye",
        cellule_id: null,
      });
    }

    // 3️⃣ Rafraîchir la liste des membres
    fetchMembers();
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

  const renderMembers = (membersList) =>
    membersList.map((member) => {
      const cellule =
        cellules.find((c) => c.cellule === selectedCellule[member.id]) || null;

      let whatsappLink = "";
      if (cellule?.telephone) {
        const message = encodeURIComponent(
          `👋 Salut ${cellule.responsable},\n\n🙏 Dieu nous a envoyé une nouvelle âme à suivre.\nVoici ses infos :\n\n- 👤 Nom : ${member.prenom} ${member.nom}\n- 📱 Téléphone : ${
            member.telephone || "—"
          }\n- 📧 Email : ${member.email || "—"}\n- 🏙 Ville : ${
            member.ville || "—"
          }\n- 🙏 Besoin : ${member.besoin || "—"}\n- 📝 Infos supplémentaires : ${
            member.how_came || "—"
          }\n\nMerci pour ton cœur ❤ et son amour ✨`
        );
        whatsappLink = `https://wa.me/${cellule.telephone.replace(/\D/g, "")}?text=${message}`;
      }

      return (
        <div
          key={member.id}
          className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 border-l-4 flex flex-col justify-between"
          style={{ borderColor: getBorderColor(member) }}
        >
          <div>
            <h3 className="text-lg font-bold text-gray-800 mb-1 flex justify-between items-center">
              <span className="flex items-center gap-2">
                {member.prenom} {member.nom}
                {member.star && <span className="text-yellow-400">⭐</span>}
                {(member.statut === "visiteur" ||
                  member.statut === "veut rejoindre ICC") && (
                  <span className="ml-2 text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full">
                    Nouveau
                  </span>
                )}
              </span>

              <select
                value={member.statut}
                onChange={(e) => handleChangeStatus(member.id, e.target.value)}
                className="border rounded-lg px-2 py-1 text-sm h-8 focus:outline-none focus:ring-1 focus:ring-indigo-400"
              >
                <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
                <option value="visiteur">Visiteur</option>
                <option value="a déjà mon église">A déjà mon église</option>
                <option value="evangelisé">Evangelisé</option>
                <option value="actif">Actif</option>
                <option value="ancien">Ancien</option>
              </select>
            </h3>

            {/* Bouton WhatsApp */}
            {cellule && (
              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg font-semibold mt-3 w-full text-center"
                onClick={() => markAsSent(member.id)}
              >
                📲 Envoyer à {cellule.responsable} sur WhatsApp
              </a>
            )}
          </div>
        </div>
      );
    });

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      {/* ... Le reste de ton design inchangé ... */}
      <div className="w-full max-w-6xl space-y-8">{renderMembers(members)}</div>
    </div>
  );
}
