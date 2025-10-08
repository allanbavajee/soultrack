//pages/list-members.js
"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient"; // ✅ export nommé
import Image from "next/image";

export default function ListMembers() {
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState("");
  const [detailsOpen, setDetailsOpen] = useState({});
  const [cellules, setCellules] = useState([]);
  const [selectedCellules, setSelectedCellules] = useState({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

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

      console.log("fetchMembers data:", data, "error:", error);

      if (error) {
        setErrorMsg("Erreur lors du chargement des membres.");
        return;
      }

      if (data) setMembers(data);
    } catch (err) {
      console.error("fetchMembers exception:", err);
      setErrorMsg("Erreur inattendue lors du chargement des membres.");
    } finally {
      setLoading(false);
    }
  };

  const fetchCellules = async () => {
    try {
      const { data, error } = await supabase
        .from("cellules")
        .select("id, cellule, responsable, telephone");

      console.log("fetchCellules data:", data, "error:", error);

      if (error) {
        setErrorMsg("Erreur lors du chargement des cellules.");
        return;
      }

      if (data) setCellules(data);
    } catch (err) {
      console.error("fetchCellules exception:", err);
      setErrorMsg("Erreur inattendue lors du chargement des cellules.");
    }
  };

  const handleChangeStatus = async (id, newStatus) => {
    try {
      const { error } = await supabase
        .from("membres")
        .update({ statut: newStatus })
        .eq("id", id);

      if (error) {
        console.error("Erreur update statut:", error);
        return;
      }

      setMembers((prev) =>
        prev.map((m) => (m.id === id ? { ...m, statut: newStatus } : m))
      );
    } catch (err) {
      console.error("handleChangeStatus exception:", err);
    }
  };

  // Filtrage
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

  const handleWhatsAppSingle = async (member, cellule) => {
    if (!cellule) return;

    try {
      // Vérifier suivi existant
      const { data: existing, error: errCheck } = await supabase
        .from("suivis_membres")
        .select("*")
        .eq("membre_id", member.id)
        .eq("cellule_id", cellule.id)
        .single();

      if (errCheck && errCheck.code !== "PGRST116") console.error("Erreur check suivi:", errCheck);

      if (!existing && ["visiteur", "veut rejoindre ICC"].includes(member.statut)) {
        const { error: insertError } = await supabase.from("suivis_membres").insert([
          {
            membre_id: member.id,
            cellule_id: cellule.id,
            statut: "envoye",
            created_at: new Date(),
          },
        ]);

        if (insertError) {
          console.error("Erreur insertion suivi:", insertError);
          alert("Impossible de créer le suivi. Envoi annulé.");
          return;
        }
      }

      // Mise à jour statut
      await supabase.from("membres").update({ statut: "actif" }).eq("id", member.id);
      setMembers((prev) =>
        prev.map((m) => (m.id === member.id ? { ...m, statut: "actif" } : m))
      );

      // Préparer message WhatsApp
      const prenomResponsable = cellule.responsable.split(" ")[0];
      const message = `👋 Salut ${prenomResponsable},\n\n🙏 Nouvelle âme à suivre :\n- Nom : ${member.prenom} ${member.nom}\n- Téléphone : ${member.telephone}\n- Email : ${member.email || "—"}\n- Ville : ${member.ville || "—"}\n- Besoin : ${member.besoin || "—"}`;

      window.open(
        `https://wa.me/${cellule.telephone}?text=${encodeURIComponent(message)}`,
        "_blank"
      );
    } catch (err) {
      console.error("handleWhatsAppSingle exception:", err);
    }
  };

  if (loading) return <p className="text-white text-center mt-10">Chargement...</p>;
  if (errorMsg) return <p className="text-red-500 text-center mt-10">{errorMsg}</p>;

  const nouveaux = filteredMembers.filter(
    (m) => m.statut === "visiteur" || m.statut === "veut rejoindre ICC"
  );
  const anciens = filteredMembers.filter(
    (m) => m.statut !== "visiteur" && m.statut !== "veut rejoindre ICC"
  );

  return (
    <div className="min-h-screen flex flex-col items-center p-6" style={{ background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)" }}>
      <button
        onClick={() => window.history.back()}
        className="self-start mb-4 flex items-center text-white font-semibold hover:text-gray-200"
      >
        ← Retour
      </button>

      <div className="mt-2 mb-2">
        <Image src="/logo.png" alt="SoulTrack Logo" width={80} height={80} />
      </div>

      <h1 className="text-5xl sm:text-6xl font-handwriting text-white text-center mb-3">SoulTrack</h1>

      <p className="text-center text-white text-lg mb-6 font-handwriting-light">
        Chaque personne a une valeur infinie. Ensemble, nous avançons, grandissons et partageons l’amour de Christ dans chaque action ❤️
      </p>

      {/* Filtre */}
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

      {/* Membres */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {/* Nouveaux membres */}
        {nouveaux.map((member) => (
          <div key={member.id} className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col justify-between border-t-4 border-green-500">
            <h2 className="text-lg font-bold text-gray-800 mb-1 flex justify-between items-center">
              <span>
                {member.prenom} {member.nom} <span className="text-green-600 font-semibold ml-1">Nouveau</span>
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
            <p className="text-sm font-semibold" style={{ color: getBorderColor(member) }}>{member.statut || "—"}</p>
            <p className="mt-2 text-blue-500 underline cursor-pointer" onClick={() => setDetailsOpen((prev) => ({ ...prev, [member.id]: !prev[member.id] }))}>
              {detailsOpen[member.id] ? "Fermer détails" : "Détails"}
            </p>
            {detailsOpen[member.id] && (
              <div className="mt-2 text-sm text-gray-700 space-y-1">
                <p>Email : {member.email || "—"}</p>
                <p>Besoin : {member.besoin || "—"}</p>
                <p>Ville : {member.ville || "—"}</p>
                <p>WhatsApp : {member.is_whatsapp ? "✅ Oui" : "❌ Non"}</p>
                <label className="block mb-1 font-semibold mt-2">Choisir une cellule :</label>
                <select
                  className="w-full p-2 border rounded-lg"
                  value={selectedCellules[member.id]?.cellule || ""}
                  onChange={(e) => {
                    const cellule = cellules.find((c) => c.cellule === e.target.value);
                    setSelectedCellules((prev) => ({ ...prev, [member.id]: cellule }));
                  }}
                >
                  <option value="">-- Sélectionner --</option>
                  {cellules.map((c) => (
                    <option key={c.cellule} value={c.cellule}>
                      {c.cellule} ({c.responsable})
                    </option>
                  ))}
                </select>
                {selectedCellules[member.id] && (
                  <button onClick={() => handleWhatsAppSingle(member, selectedCellules[member.id])} className="mt-2 w-full py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600">
                    📤 Envoyer sur WhatsApp
                  </button>
                )}
              </div>
            )}
          </div>
        ))}

        {/* Anciens membres */}
        {anciens.map((member) => (
          <div key={member.id} className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col justify-between" style={{ borderTop: `4px solid ${getBorderColor(member)}` }}>
            <h2 className="text-lg font-bold text-gray-800 mb-1 flex justify-between items-center">
              {member.prenom} {member.nom} {member.star && <span className="ml-1 text-yellow-400">⭐</span>}
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
            <p className="text-sm font-semibold" style={{ color: getBorderColor(member) }}>{member.statut || "—"}</p>
            <p className="mt-2 text-blue-500 underline cursor-pointer" onClick={() => setDetailsOpen((prev) => ({ ...prev, [member.id]: !prev[member.id] }))}>
              {detailsOpen[member.id] ? "Fermer détails" : "Détails"}
            </p>
            {detailsOpen[member.id] && (
              <div className="mt-2 text-sm text-gray-700 space-y-1">
                <p>Email : {member.email || "—"}</p>
                <p>Besoin : {member.besoin || "—"}</p>
                <p>Ville : {member.ville || "—"}</p>
                <p>WhatsApp : {member.is_whatsapp ? "✅ Oui" : "❌ Non"}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={scrollToTop} className="fixed bottom-5 right-5 text-white text-2xl font-bold">↑</button>

      <p className="mt-6 mb-6 text-center text-white text-lg font-handwriting-light">
        Car le corps ne se compose pas d’un seul membre, mais de plusieurs. 1 Corinthiens 12:14 ❤️
      </p>
    </div>
  );
}
