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

  // ⚡ Fonction pour marquer le membre comme envoyé (suivis_membres)
  const markAsSent = async (member) => {
    if (!member) return;

    // On ne fait le suivi que si le statut est "visiteur" ou "veut rejoindre ICC"
    if (member.statut !== "visiteur" && member.statut !== "veut rejoindre ICC")
      return;

    // Mettre le membre actif
    await supabase
      .from("membres")
      .update({ statut: "actif" })
      .eq("id", member.id);

    // Vérifier si une entrée existe déjà dans suivis_membres
    const { data: existing } = await supabase
      .from("suivis_membres")
      .select("*")
      .eq("membre_id", member.id)
      .single();

    if (!existing) {
      await supabase.from("suivis_membres").insert({
        membre_id: member.id,
        statut: "envoye",
        cellule_id: null,
      });
    }
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
        whatsappLink = `https://wa.me/${cellule.telephone.replace(
          /\D/g,
          ""
        )}?text=${message}`;
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
                <p>
                  📧 <strong>Email:</strong> {member.email || "—"}
                </p>
                <p>
                  🕊️ <strong>Comment est-il venu:</strong> {member.how_came || "—"}
                </p>
                <p>
                  🙏 <strong>Besoins:</strong> {member.besoin || "—"}
                </p>

                <div className="mt-3">
                  <label className="block text-gray-600 font-semibold mb-1">
                    👥 Sélectionner une cellule :
                  </label>
                  <select
                    value={selectedCellule[member.id] || ""}
                    onChange={(e) =>
                      handleSelectCellule(member.id, e.target.value)
                    }
                    className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400 truncate"
                  >
                    <option value="">-- Choisir une cellule --</option>
                    {cellules.map((c) => (
                      <option
                        key={c.id}
                        value={c.cellule}
                        className="truncate max-w-[250px]"
                      >
                        {c.cellule} ({c.responsable})
                      </option>
                    ))}
                  </select>
                </div>

                {cellule && (
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-lg font-semibold mt-3 w-full text-center"
                    onClick={() => markAsSent(member)}
                  >
                    📲 Envoyer à {cellule.responsable} sur WhatsApp
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      );
    });

  return (
    <div
      className="min-h-screen flex flex-col items-center p-6"
      style={{
        background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)",
      }}
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
        Chaque personne a une valeur infinie. Ensemble, nous avançons,
        grandissons et partageons l’amour de Christ dans chaque action ❤️
      </p>

      <div className="flex flex-col md:flex-row items-center gap-4 mb-6 w-full max-w-md">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
          <option value="">Tous les membres</option>
          <option value="visiteur">Visiteurs</option>
          <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
          <option value="actif">Actifs</option>
          <option value="a déjà mon église">A déjà mon église</option>
          <option value="ancien">Anciens</option>
          <option value="star">⭐ Star</option>
        </select>
      </div>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 w-full max-w-6xl">
        {renderMembers(nouveaux)}
        {renderMembers(anciens)}
      </div>

      <button
        onClick={scrollToTop}
        className="fixed bottom-5 right-5 text-white text-2xl font-bold bg-transparent hover:text-gray-200"
      >
        ↑
      </button>
    </div>
  );
}
