"use client";

import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import Image from "next/image";
import LogoutLink from "../components/LogoutLink";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

export default function ListMembers() {
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [detailsOpen, setDetailsOpen] = useState({});
  const [cellules, setCellules] = useState([]);
  const [selectedCellule, setSelectedCellule] = useState("");
  const [selectedCellules, setSelectedCellules] = useState({});
  const [view, setView] = useState("card");
  const [popupMember, setPopupMember] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getSession();
    fetchMembers();
    fetchCellules();
  }, []);

  const getSession = async () => {
    const { data } = await supabase.auth.getSession();
    setSession(data?.session || null);
  };

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

  const handleStatusUpdateFromEnvoyer = (id, newStatus) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, statut: newStatus } : m))
    );
  };

  const getBorderColor = (m) => {
    if (m.star) return "#FBC02D";
    if (m.statut === "actif") return "#4285F4";
    if (m.statut === "a déjà mon église") return "#EA4335";
    if (m.statut === "Integrer") return "#FFA500";
    if (m.statut === "ancien") return "#999999";
    if (m.statut === "veut rejoindre ICC" || m.statut === "visiteur")
      return "#34A853";
    return "#ccc";
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      return format(date, "EEEE d MMMM yyyy", { locale: fr });
    } catch {
      return "";
    }
  };

  const nouveaux = members.filter(
    (m) => m.statut === "visiteur" || m.statut === "veut rejoindre ICC"
  );
  const anciens = members.filter(
    (m) => m.statut !== "visiteur" && m.statut !== "veut rejoindre ICC"
  );

  const filterBySearch = (list) =>
    list.filter((m) =>
      `${m.prenom} ${m.nom}`.toLowerCase().includes(search.toLowerCase())
    );

  const nouveauxFiltres = filterBySearch(
    filter ? nouveaux.filter((m) => m.statut === filter) : nouveaux
  );
  const anciensFiltres = filterBySearch(
    filter ? anciens.filter((m) => m.statut === filter) : anciens
  );

  const allMembersOrdered = [...nouveaux, ...anciens];
  const filteredMembers = filterBySearch(
    filter
      ? allMembersOrdered.filter((m) => m.statut === filter)
      : allMembersOrdered
  );

  const statusOptions = [
    "actif",
    "Integrer",
    "ancien",
    "veut rejoindre ICC",
    "visiteur",
    "a déjà mon église",
  ];

  const totalCount = filteredMembers.length;

  // === Fonction pour envoyer un membre par WhatsApp ===
  const sendToWhatsapp = async (membre) => {
    if (!session) {
      alert("❌ Vous devez être connecté pour envoyer un membre à une cellule.");
      return;
    }
    if (!selectedCellule) {
      alert("❌ Sélectionnez une cellule !");
      return;
    }

    const cellule = cellules.find((c) => String(c.id) === selectedCellule);
    if (!cellule) {
      alert("❌ Cellule introuvable !");
      return;
    }

    setLoading(true);
    try {
      const now = new Date().toISOString();
      const suiviData = {
        prenom: membre.prenom,
        nom: membre.nom,
        telephone: membre.telephone,
        is_whatsapp: true,
        ville: membre.ville,
        besoin: membre.besoin,
        infos_supplementaires: membre.infos_supplementaires,
        cellule_id: cellule.id,
        responsable_cellule: cellule.responsable,
        date_suivi: now,
      };

      const { error: insertError } = await supabase
        .from("suivis_des_membres")
        .insert([suiviData]);

      if (insertError) {
        console.error("Erreur lors de l'insertion du suivi :", insertError.message);
        alert("❌ Une erreur est survenue lors de l’enregistrement du suivi.");
        setLoading(false);
        return;
      }

      // Préparer le message WhatsApp
      let message = `👋 Salut ${cellule.responsable},\n\n🙏 Nous avons un nouveau membre à suivre :\n\n`;
      message += `- 👤 Nom : ${membre.prenom || ""} ${membre.nom || ""}\n`;
      message += `- 📱 Téléphone : ${membre.telephone || "—"}\n`;
      message += `- 📲 WhatsApp : Oui\n`;
      message += `- 🏙 Ville : ${membre.ville || "—"}\n`;
      message += `- 🙏 Besoin : ${membre.besoin || "—"}\n`;
      message += `- 📝 Infos supplémentaires : ${membre.infos_supplementaires || "—"}\n\n`;
      message += "🙏 Merci pour ton cœur ❤ et ton amour ✨";

      const phone = cellule.telephone.replace(/\D/g, "");
      window.open(
        `https://wa.me/${phone}?text=${encodeURIComponent(message)}`,
        "_blank"
      );

      handleStatusUpdateFromEnvoyer(membre.id, "Integrer");
    } catch (error) {
      console.error("Erreur lors de l'envoi WhatsApp :", error.message);
      alert("❌ Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center p-6 transition-all duration-200"
      style={{ background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)" }}
    >
      {/* Header */}
      <div className="flex justify-between w-full max-w-5xl items-center mb-4">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-white font-semibold hover:text-gray-200"
        >
          ← Retour
        </button>
        <LogoutLink className="bg-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/20 transition" />
      </div>

      {/* Logo */}
      <div className="mt-2 mb-2">
        <Image src="/logo.png" alt="SoulTrack Logo" width={80} height={80} />
      </div>

      <h1 className="text-5xl sm:text-6xl font-handwriting text-white text-center mb-3">
        SoulTrack
      </h1>
      <p className="text-center text-white text-lg mb-2 font-handwriting-light">
        Chaque personne a une valeur infinie. Ensemble, nous avançons ❤️
      </p>

      {/* Filtre + recherche + compteur + toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-5xl mb-4">
        <div className="flex items-center space-x-2 mb-2 sm:mb-0">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 rounded-lg border text-sm"
          >
            <option value="">Tous les statuts</option>
            {statusOptions.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom..."
            className="px-3 py-2 rounded-lg border text-sm w-48"
          />

          <span className="text-white text-sm">({totalCount})</span>
        </div>

        <button
          onClick={() => setView(view === "card" ? "table" : "card")}
          className="text-white text-sm underline hover:text-gray-200"
        >
          {view === "card" ? "Vue Table" : "Vue Carte"}
        </button>
      </div>

      {/* Sélecteur cellule + bouton WhatsApp */}
      <div className="flex flex-col sm:flex-row w-full max-w-md gap-2 mb-4">
        <select
          value={selectedCellule}
          onChange={(e) => setSelectedCellule(e.target.value)}
          className="border rounded-lg px-3 py-2 w-full text-gray-800"
        >
          <option value="">-- Sélectionner cellule --</option>
          {cellules.map((c) => (
            <option key={c.id} value={c.id}>
              {c.cellule} ({c.responsable})
            </option>
          ))}
        </select>
      </div>

      {/* === VUE CARTE === */}
      {view === "card" && (
        <div className="w-full max-w-5xl space-y-8 transition-all duration-200">
          {/* Nouveaux membres */}
          {nouveauxFiltres.length > 0 && (
            <div>
              <p className="text-white text-lg mb-2 ml-1">
                💖 Bien aimé venu le {formatDate(nouveauxFiltres[0].created_at)}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {nouveauxFiltres.map((m) => (
                  <div
                    key={m.id}
                    className="bg-white p-3 rounded-xl shadow-md hover:shadow-xl transition duration-200 border-l-4"
                    style={{ borderLeftColor: getBorderColor(m) }}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: getBorderColor(m) }}
                      >
                        {m.star ? "⭐ S.T.A.R" : m.statut}
                      </span>
                      <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full ml-2">
                        Nouveau
                      </span>
                    </div>

                    <div className="text-lg font-bold text-gray-800">
                      {m.prenom} {m.nom}
                    </div>

                    <p className="text-sm text-gray-600 mb-2">
                      📱 {m.telephone || "—"}
                    </p>

                    <select
                      value={m.statut}
                      onChange={(e) => handleChangeStatus(m.id, e.target.value)}
                      className="border rounded-md px-2 py-1 text-xs text-gray-700 mb-2 w-full"
                    >
                      {statusOptions.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>

                    {selectedCellule && (
                      <button
                        onClick={() => sendToWhatsapp(m)}
                        disabled={loading}
                        className={`w-full text-white font-bold px-4 py-2 rounded-lg shadow-lg transition-all ${
                          loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {loading ? "Envoi..." : "Envoyer par WhatsApp"}
                      </button>
                    )}

                    <p
                      className="text-blue-500 underline cursor-pointer text-sm mt-1"
                      onClick={() => setPopupMember(m)}
                    >
                      Détails
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Anciens membres */}
          {anciensFiltres.length > 0 && (
            <div className="mt-8">
              <h3 className="text-white text-lg mb-3 font-semibold">
                <span
                  style={{
                    background: "linear-gradient(to right, #3B82F6, #D1D5DB)",
                    WebkitBackgroundClip: "text",
                    color: "transparent",
                  }}
                >
                  Membres existants
                </span>
                <span className="ml-2 w-3/4 inline-block h-px bg-gradient-to-r from-blue-500 to-gray-400"></span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {anciensFiltres.map((m) => (
                  <div
                    key={m.id}
                    className="bg-white p-3 rounded-xl shadow-md border-l-4 transition duration-200"
                    style={{ borderLeftColor: getBorderColor(m) }}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span
                        className="text-sm font-semibold"
                        style={{ color: getBorderColor(m) }}
                      >
                        {m.star ? "⭐ S.T.A.R" : m.statut}
                      </span>
                    </div>

                    <div className="text-lg font-bold text-gray-800">
                      {m.prenom} {m.nom}
                    </div>

                    <p className="text-sm text-gray-600 mb-2">
                      📱 {m.telephone || "—"}
                    </p>

                    <select
                      value={m.statut}
                      onChange={(e) => handleChangeStatus(m.id, e.target.value)}
                      className="border rounded-md px-2 py-1 text-xs text-gray-700 mb-2 w-full"
                    >
                      {statusOptions.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>

                    {selectedCellule && (
                      <button
                        onClick={() => sendToWhatsapp(m)}
                        disabled={loading}
                        className={`w-full text-white font-bold px-4 py-2 rounded-lg shadow-lg transition-all ${
                          loading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {loading ? "Envoi..." : "Envoyer par WhatsApp"}
                      </button>
                    )}

                    <p
                      className="text-blue-500 underline cursor-pointer text-sm mt-1"
                      onClick={() => setPopupMember(m)}
                    >
                      Détails
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ✅ Popup Détails */}
      {popupMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-all duration-200">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setPopupMember(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✖
            </button>
            <h2 className="text-xl font-bold mb-2 text-indigo-700">
              {popupMember.prenom} {popupMember.nom}
            </h2>
            <p className="text-gray-700 text-sm mb-1">
              📱 {popupMember.telephone || "—"}
            </p>
            <p className="text-sm text-gray-700 mb-2">
              Statut :
              <select
                value={popupMember.statut}
                onChange={(e) =>
                  handleChangeStatus(popupMember.id, e.target.value)
                }
                className="ml-2 border rounded-md px-2 py-1 text-sm"
              >
                {statusOptions.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </p>
            <p className="text-sm text-gray-700 mb-1">
              Besoin : {popupMember.besoin || "—"}
            </p>
            <p className="text-sm text-gray-700 mb-1">
              Infos : {popupMember.infos_supplementaires || "—"}
            </p>
            <p className="text-sm text-gray-700 mb-3">
              Comment venu : {popupMember.comment || "—"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
