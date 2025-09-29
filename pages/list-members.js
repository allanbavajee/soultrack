// pages/list-members.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ListMembers() {
  const [members, setMembers] = useState([]);
  const [cellules, setCellules] = useState([]);
  const [selectedCellule, setSelectedCellule] = useState("");
  const [detailsOpen, setDetailsOpen] = useState({});
  const [selectedEvangelises, setSelectedEvangelises] = useState({});

  useEffect(() => {
    fetchMembers();
    fetchCellules();
  }, []);

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from("membres")
      .select(
        "*, cellule:cellule_id (id, cellule,responsable,telephone)"
      )
      .eq("statut", "actif")
      .order("created_at", { ascending: false });

    if (!error) setMembers(data);
  };

  const fetchCellules = async () => {
    const { data, error } = await supabase
      .from("cellules")
      .select("id, cellule,responsable,telephone");
    if (!error) setCellules(data);
  };

  const handleWhatsAppSingle = async (member, cellule) => {
    if (!cellule) return;
    const prenomResponsable = cellule.responsable.split(" ")[0];
    const message = `👋 Salut ${prenomResponsable},

🙏 Dieu nous a envoyé une nouvelle âme à suivre.  
Voici ses infos :  

- 👤 Nom : ${member.prenom} ${member.nom}  
- 📱 Téléphone : ${member.telephone} ${
      member.is_whatsapp ? "(WhatsApp ✅)" : ""
    }  
- 📧 Email : ${member.email || "—"}  
- 🏙️ Ville : ${member.ville || "—"}  
- 🙏 Besoin : ${member.besoin || "—"}  
- 📝 Infos supplémentaires : ${member.infos_supplementaires || "—"}  

Merci pour ton cœur ❤️ et son amour ✨`;

    window.open(
      `https://wa.me/${cellule.telephone}?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    // Mettre à jour le statut du membre en actif
    await supabase.from("membres").update({ statut: "actif" }).eq("id", member.id);

    setMembers((prev) =>
      prev.map((m) => (m.id === member.id ? { ...m, statut: "actif" } : m))
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

      <h1 className="text-3xl font-bold text-center mb-6">Liste des membres actifs</h1>

      {/* Filtre cellule */}
      <div className="mb-6 max-w-md mx-auto">
        <label className="block mb-2 font-semibold">Filtrer par cellule :</label>
        <select
          className="w-full p-2 border rounded-lg"
          value={selectedCellule}
          onChange={(e) => setSelectedCellule(e.target.value)}
        >
          <option value="">-- Toutes les cellules --</option>
          {cellules.map((c) => (
            <option key={c.id} value={c.id}>
              {c.cellule} ({c.responsable})
            </option>
          ))}
        </select>
      </div>

      {/* Cartes membres */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {members
          .filter((m) => !selectedCellule || m.cellule?.id == selectedCellule)
          .map((member) => (
            <div
              key={member.id}
              className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer border-t-4 border-blue-400"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-lg font-bold text-gray-800 mb-1">
                    {member.prenom} {member.nom}
                  </h2>
                  <p className="text-sm text-gray-600 mb-1">📱 {member.telephone}</p>
                  <p className="text-sm font-semibold">{member.statut}</p>
                </div>
              </div>

              {/* Détails */}
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
                <div className="mt-2 text-sm text-gray-700 space-y-1">
                  <p>Email : {member.email || "—"}</p>
                  <p>Besoin : {member.besoin || "—"}</p>
                  <p>Ville : {member.ville || "—"}</p>
                  <p>WhatsApp : {member.is_whatsapp ? "✅ Oui" : "❌ Non"}</p>
                  <p>Infos supplémentaires : {member.infos_supplementaires || "—"}</p>
                  <p>Comment venu : {member.how_came || "—"}</p>
                  <p>Cellule : {member.cellule?.cellule || "—"}</p>
                  <p>Responsable : {member.cellule?.responsable || "—"}</p>

                  {/* Choix cellule + bouton WhatsApp */}
                  <div className="mt-2">
                    <label className="block mb-1 font-semibold">Choisir une cellule :</label>
                    <select
                      className="w-full p-2 border rounded-lg"
                      value={member.cellule?.id || ""}
                      onChange={(e) => {
                        const cellule = cellules.find((c) => c.id == e.target.value);
                        setSelectedEvangelises((prev) => ({
                          ...prev,
                          [member.id]: cellule,
                        }));
                      }}
                    >
                      <option value="">-- Sélectionner --</option>
                      {cellules.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.cellule} ({c.responsable})
                        </option>
                      ))}
                    </select>

                    {selectedEvangelises[member.id] && (
                      <button
                        onClick={() =>
                          handleWhatsAppSingle(member, selectedEvangelises[member.id])
                        }
                        className="mt-2 w-full py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
                      >
                        📤 Envoyer sur WhatsApp
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}
