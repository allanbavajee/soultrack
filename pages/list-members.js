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

  const handleSendWhatsApp = async (member) => {
    const celluleId = selectedCellules[member.id];
    const cellule = cellules.find((c) => c.id === celluleId);

    if (!cellule || !cellule.telephone) {
      return alert("Numéro de la cellule introuvable.");
    }

    setSending((prev) => ({ ...prev, [member.id]: true }));

    try {
      const { data: existingSuivi, error: errCheck } = await supabase
        .from("suivis_membres")
        .select("*")
        .eq("membre_id", member.id)
        .single();

      if (errCheck && errCheck.code !== "PGRST116") throw errCheck;

      if (!existingSuivi) {
        await supabase.from("suivis_membres").insert([
          { membre_id: member.id, statut: "envoye", created_at: new Date() },
        ]);
      }

      if (member.statut === "visiteur" || member.statut === "veut rejoindre ICC") {
        await supabase
          .from("membres")
          .update({ statut: "actif" })
          .eq("id", member.id);
        setMembers((prev) =>
          prev.map((m) =>
            m.id === member.id ? { ...m, statut: "actif" } : m
          )
        );
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

      const waUrl = `https://wa.me/${cellule.telephone.replace(/\D/g, "")}?text=${encodeURIComponent(
        message
      )}`;
      window.open(waUrl, "_blank");
    } catch (err) {
      console.error("Erreur WhatsApp :", err);
      alert("Erreur lors de l'envoi du WhatsApp.");
    } finally {
      setSending((prev) => ({ ...prev, [member.id]: false }));
    }
  };

  const filteredMembers = members.filter((m) => {
    if (!filter) return true;
    if (filter === "star") return m.star === true;
    return m.statut === filter;
  });

  const nouveaux = filteredMembers.filter(
    (m) => m.statut === "visiteur" || m.statut === "veut rejoindre ICC"
  );
  const anciens = filteredMembers.filter(
    (m) => m.statut !== "visiteur" && m.statut !== "veut rejoindre ICC"
  );

  const renderMemberCard = (member) => (
    <div
      key={member.id}
      className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between border-t-4 mb-4 min-h-[220px] max-h-[280px]"
      style={{ borderTopColor: getBorderColor(member) }}
    >
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-lg font-bold text-gray-800">
          {member.prenom} {member.nom}
        </h2>
        {(member.statut === "visiteur" || member.statut === "veut rejoindre ICC") && (
          <span className="text-white bg-blue-500 px-2 py-1 rounded-full text-sm ml-2">
            Nouveau
          </span>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-1">📱 {member.telephone || "—"}</p>

      {/* Menu déroulant statut */}
      <select
        className="border rounded-lg px-2 py-1 text-sm mb-2 w-full"
        value={member.statut}
        onChange={(e) => handleChangeStatus(member.id, e.target.value)}
      >
        <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
        <option value="visiteur">Visiteur</option>
        <option value="a déjà mon église">A déjà mon église</option>
        <option value="evangelisé">Evangelisé</option>
        <option value="actif">Actif</option>
        <option value="ancien">Ancien</option>
      </select>

      <p
        className="mt-1 text-blue-500 underline cursor-pointer"
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
          <p>WhatsApp : {member.is_whatsapp ? "✅ Oui" : "❌ Non"}</p>
          <p>Infos supplémentaires : {member.infos_supplementaires || "—"}</p>

          <select
            className="border rounded-lg px-2 py-1 mt-2 text-sm w-full"
            value={selectedCellules[member.id] || ""}
            onChange={(e) =>
              setSelectedCellules((prev) => ({
                ...prev,
                [member.id]: e.target.value,
              }))
            }
          >
            <option value="">-- Sélectionner cellule --</option>
            {cellules.map((c) => (
              <option key={c.id} value={c.id}>
                {c.cellule} ({c.responsable})
              </option>
            ))}
          </select>

          {selectedCellules[member.id] && (
            <button
              onClick={() => handleSendWhatsApp(member)}
              disabled={sending[member.id]}
              className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-xl w-full"
            >
              {sending[member.id] ? "Envoi..." : "Envoyer sur WhatsApp"}
            </button>
          )}
        </div>
      )}
    </div>
  );

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
        <span className="text-white italic text-opacity-80">
          Résultats: {filteredMembers.length}
        </span>
      </div>

      {/* Nouveaux membres */}
      {nouveaux.length > 0 && (
        <div className="w-full max-w-5xl mb-6">
          <p className="text-white mb-2 font-semibold">
            Contact venu le {new Date(nouveaux[0].created_at).toLocaleDateString()}
          </p>
          {nouveaux.map(renderMemberCard)}
        </div>
      )}

      {/* Ligne séparation */}
      {nouveaux.length > 0 && anciens.length > 0 && (
        <div
          className="w-full max-w-5xl h-1 mb-6"
          style={{ background: "linear-gradient(to right, #ccc, #4285F4)" }}
        />
      )}

      {/* Anciens membres */}
      {anciens.map(renderMemberCard)}

      <button
        onClick={scrollToTop}
        className="fixed bottom-5 right-5 text-white text-2xl font-bold"
      >
        ↑
      </button>
    </div>
  );
}
