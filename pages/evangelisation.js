/*pages/evangelisation*/
const handleWhatsAppGroup = () => {
  if (!selectedCellule) {
    alert("Sélectionne d'abord une cellule.");
    return;
  }

  const prenomResponsable =
    selectedCellule.responsable.split(" ")[0] || "Frère/Soeur";
  const telDigits = (selectedCellule.telephone || "").replace(/\D/g, "");
  if (!telDigits) return;

  // Construire un message groupé
  let message = `👋 Salut ${prenomResponsable},\n\n🙏 Dieu nous a envoyé de nouvelles âmes à suivre.\nVoici leurs infos :\n\n`;

  Object.values(selectedContacts).forEach((member, index) => {
    message += `#${index + 1}\n`;
    message += `- 👤 Nom : ${member.prenom} ${member.nom}\n`;
    message += `- 📱 Téléphone : ${member.telephone} ${
      member.is_whatsapp ? "(WhatsApp ✅)" : ""
    }\n`;
    message += `- 📧 Email : ${member.email || "—"}\n`;
    message += `- 🏙️ Ville : ${member.ville || "—"}\n`;
    message += `- 🙏 Besoin : ${member.besoin || "—"}\n`;
    message += `- 📝 Infos supplémentaires : ${
      member.infos_supplementaires || "—"
    }\n\n`;
  });

  message += `Merci pour ton cœur ❤️ et ton amour ✨`;

  // Envoyer en un seul WhatsApp
  window.open(
    `https://wa.me/${telDigits}?text=${encodeURIComponent(message)}`,
    "_blank"
  );

  setSelectedContacts({});
};
