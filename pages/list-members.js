// pages/list-members.js
"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient"; // <-- correction ici
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

  // === WhatsApp & suivi ===
  const handleWhatsAppSingle = async (member, cellule) => {
    if (!cellule) return;

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

    await supabase.from("membres").update({ statut: "actif" }).eq("id", member.id);
    setMembers((prev) =>
      prev.map((m) => (m.id === member.id ? { ...m, statut: "actif" } : m))
    );

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
  };

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
        Chaque personne a une valeur infinie. Ensemble, nous avançons, grandissons et partageons l’amour de Christ dans chaque action ❤️
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {nouveaux.map((member) => (
          <div
            key={member.id}
            className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col justify-between border-t-4 border-green-500"
          >
            {/* … tout le code des cartes membres reste identique … */}
          </div>
        ))}

        {anciens.map((member) => (
          <div
            key={member.id}
            className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col justify-between"
            style={{ borderTop: `4px solid ${getBorderColor(member)}` }}
          >
            {/* … tout le code des cartes anciens membres reste identique … */}
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
        Car le corps ne se compose pas d’un seul membre, mais de plusieurs. 1 Corinthiens 12:14 ❤️
      </p>
    </div>
  );
}
