// pages/list-members.js
"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient"; // <-- import corrigé
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
      console.log("Données récupérées (debug) :", data); // debug
      if (data) setMembers(data);
    } catch (err) {
      console.error("Exception fetchMembers:", err);
    }
  };

  const fetchCellules = async () => {
    try {
      const { data, error } = await supabase
        .from("cellules")
        .select("id, cellule, responsable, telephone");
      if (error) throw error;
      if (data) setCellules(data);
    } catch (err) {
      console.error("Exception fetchCellules:", err);
    }
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

    try {
      const { data: existing, error: errCheck } = await supabase
        .from("suivis_membres")
        .select("*")
        .eq("membre_id", member.id)
        .eq("cellule_id", cellule.id)
        .single();

      if (errCheck && errCheck.code !== "PGRST116")
        console.error("Erreur check suivi:", errCheck);

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
      const message = `👋 Salut ${prenomResponsable},\n\n🙏 Dieu nous a envoyé une nouvelle âme à suivre. Voici ses infos :\n\n- 👤 Nom : ${member.prenom} ${member.nom}\n- 📱 Téléphone : ${member.telephone} ${member.is_whatsapp ? "(WhatsApp ✅)" : ""}\n- 📧 Email : ${member.email || "—"}\n- 🏙️ Ville : ${member.ville || "—"}\n- 🙏 Besoin : ${member.besoin || "—"}\n- 📝 Infos supplémentaires : ${member.infos_supplementaires || "—"}\n\nMerci pour ton cœur ❤️ et son amour ✨`;
      window.open(
        `https://wa.me/${cellule.telephone}?text=${encodeURIComponent(message)}`,
        "_blank"
      );
    } catch (err) {
      console.error("Erreur handleWhatsAppSingle:", err);
      alert("Impossible de créer le suivi. Envoi annulé.");
    }
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
      {/* ...tout le reste reste inchangé */}
    </div>
  );
}
