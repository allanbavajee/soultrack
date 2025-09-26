// pages/evangelisation.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Evangelisation() {
  const [members, setMembers] = useState([]);
  const [cellules, setCellules] = useState([]);
  const [selectedCellules, setSelectedCellules] = useState({});

  useEffect(() => {
    fetchEvangelises();
    fetchCellules();
  }, []);

  // Récupérer seulement les évangélisés
  const fetchEvangelises = async () => {
    const { data, error } = await supabase
      .from("membres")
      .select("*")
      .eq("statut", "evangelisé");

    if (!error && data) setMembers(data);
  };

  // Récupérer la liste des cellules
  const fetchCellules = async () => {
    const { data, error } = await supabase
      .from("cellules")
      .select("cellule,responsable,telephone");
    if (!error && data) setCellules(data);
  };

  // Envoi WhatsApp
  const handleWhatsApp = (member, cellule) => {
    if (!cellule) {
      alert("Sélectionne d'abord une cellule !");
      return;
    }

    const prenomResponsable = (cellule.responsable || "").split(" ")[0] || "Frère/Soeur";
    const message = `👋 Salut ${prenomResponsable},

🙏 Dieu nous a envoyé une nouvelle âme à suivre.
Voici ses infos :

- 👤 Nom : ${member.prenom || ""} ${member.nom || ""}
- 📱 Téléphone : ${member.telephone || ""} ${member.is_whatsapp ? "(WhatsApp ✅)" : ""}
- 📧 Email : ${member.email || "—"}
- 🏙️ Ville : ${member.ville || "—"}
- 🙏 Besoin : ${member.besoin || "—"}
- 📝 Infos supplémentaires : ${member.infos_supplementaires || "—"}

Merci pour ton cœur ❤️ et ton amour ✨`;

    window.open(
      `https://wa.me/${cellule.telephone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Flèche retour */}
      <button
        onClick={() => window.history.back()}
        className="flex items-center text-orange-500 font-semibold mb-4"
      >
        ← Retour
      </button>

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
        Évangélisation – Liste des évangélisés
      </h1>

      {/* Compteur */}
      <p className="text-center text-gray-600 mb-6">
        Total évangélisés : {members.length}
      </p>

      {/* Cartes membres */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
            style={{ borderTop: "4px solid #FB8C00" }} // Orange
          >
            <h2 className="text-lg font-bold text-gray-800 mb-1">
              {member.prenom} {member.nom}
            </h2>
            <p className="text-sm text-gray-600 mb-1">📱 {member.telephone}</p>
            <p className="text-sm text-orange-600 font-bold">Évangélisé</p>

            {/* Détails */}
            <div className="mt-3 text-sm text-gray-700 space-y-1">
              <p>Email : {member.email || "—"}</p>
              <p>Besoin : {member.besoin || "—"}</p>
              <p>Ville : {member.ville || "—"}</p>
              <p>WhatsApp : {member.is_whatsapp ? "✅ Oui" : "❌ Non"}</p>
              <p>Infos supplémentaires : {member.infos_supplementaires || "—"}</p>
              <p>Comment est-il venu : {member.how_came || "—"}</p>
            </div>

            {/* Choix cellule + bouton WhatsApp */}
            <div className="mt-3">
              <label className="block mb-1 font-semibold">Choisir une cellule :</label>
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
                <button
                  onClick={() => handleWhatsApp(member, selectedCellules[member.id])}
                  className="mt-2 w-full py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
                >
                  📤 Envoyer sur WhatsApp
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
