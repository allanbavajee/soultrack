// pages/evangelisation.js
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Evangelisation() {
  const [evangelises, setEvangelises] = useState([]);
  const [cellules, setCellules] = useState([]);
  const [selectedCellule, setSelectedCellule] = useState(null);
  const [selectedEvangelises, setSelectedEvangelises] = useState({});
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    telephone: "",
    email: "",
    ville: "",
    besoin: "",
    infos_supplementaires: "",
  });

  // Fetch initial data
  useEffect(() => {
    fetchEvangelises();
    fetchCellules();
  }, []);

  const fetchEvangelises = async () => {
    const { data, error } = await supabase
      .from("membres")
      .select("*")
      .eq("statut", "evangelisé");
    if (!error && data) setEvangelises(data);
  };

  const fetchCellules = async () => {
    const { data, error } = await supabase
      .from("cellules")
      .select("*");
    if (!error && data) setCellules(data);
  };

  // Ajouter un évangélisé
  const handleAddEvangelise = async () => {
    const { error } = await supabase.from("membres").insert([
      { ...formData, statut: "evangelisé" }
    ]);
    if (error) return alert("Erreur ajout: " + error.message);
    setFormData({
      prenom: "",
      nom: "",
      telephone: "",
      email: "",
      ville: "",
      besoin: "",
      infos_supplementaires: "",
    });
    fetchEvangelises();
  };

  // Envoi WhatsApp groupé
  const handleWhatsAppGroup = () => {
    Object.entries(selectedEvangelises).forEach(([id, membre]) => {
      if (!selectedCellule) return;
      const prenomResp = selectedCellule.responsable.split(" ")[0] || "Frère/Soeur";
      const tel = selectedCellule.telephone.replace(/\D/g, "");
      const message = `👋 Salut ${prenomResp},

🙏 Voici une nouvelle âme à suivre :  
- 👤 ${membre.prenom} ${membre.nom}  
- 📱 ${membre.telephone}  
- 📧 ${membre.email || "—"}  
- 🏙️ ${membre.ville || "—"}  
- 🙏 Besoin : ${membre.besoin || "—"}  
- 📝 Infos supplémentaires : ${membre.infos_supplementaires || "—"}`;

      window.open(`https://wa.me/${tel}?text=${encodeURIComponent(message)}`, "_blank");
    });
    setSelectedEvangelises({});
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Évangélisation</h1>

      {/* Formulaire Ajouter un évangélisé */}
      <div className="bg-white p-6 rounded-2xl shadow mb-8 max-w-3xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Ajouter un évangélisé</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="Prénom"
            value={formData.prenom}
            onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            placeholder="Nom"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            placeholder="Téléphone"
            value={formData.telephone}
            onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            placeholder="Ville"
            value={formData.ville}
            onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            placeholder="Besoin"
            value={formData.besoin}
            onChange={(e) => setFormData({ ...formData, besoin: e.target.value })}
            className="border p-2 rounded"
          />
          <input
            placeholder="Infos supplémentaires"
            value={formData.infos_supplementaires}
            onChange={(e) => setFormData({ ...formData, infos_supplementaires: e.target.value })}
            className="border p-2 rounded col-span-2"
          />
        </div>
        <button
          onClick={handleAddEvangelise}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Ajouter
        </button>
      </div>

      {/* Menu cellule + bouton WhatsApp groupé */}
      <div className="max-w-3xl mx-auto mb-6 flex flex-col md:flex-row items-center gap-4">
        <select
          value={selectedCellule?.cellule || ""}
          onChange={(e) => {
            const cellule = cellules.find((c) => c.cellule === e.target.value);
            setSelectedCellule(cellule || null);
          }}
          className="border p-2 rounded flex-1"
        >
          <option value="">-- Choisir une cellule --</option>
          {cellules.map((c) => (
            <option key={c.cellule} value={c.cellule}>
              {c.cellule} ({c.responsable})
            </option>
          ))}
        </select>
        <button
          onClick={handleWhatsAppGroup}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
        >
          Envoyer WhatsApp aux contacts sélectionnés
        </button>
      </div>

      {/* Liste des evangelisés */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {evangelises.map((member) => (
          <div
            key={member.id}
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow"
          >
            <h3 className="text-lg font-bold mb-1">{member.prenom} {member.nom}</h3>
            <p className="text-sm mb-1">📱 {member.telephone}</p>
            <p className="text-sm mb-1">📧 {member.email || "—"}</p>
            <p className="text-sm mb-1">🏙️ {member.ville || "—"}</p>
            <p className="text-sm mb-1">🙏 Besoin : {member.besoin || "—"}</p>
            <p className="text-sm mb-1">📝 Infos supplémentaires : {member.infos_supplementaires || "—"}</p>

            <div className="mt-2 flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={!!selectedEvangelises[member.id]}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedEvangelises((prev) => ({ ...prev, [member.id]: member }));
                  } else {
                    setSelectedEvangelises((prev) => {
                      const copy = { ...prev };
                      delete copy[member.id];
                      return copy;
                    });
                  }
                }}
              />
              <span>Envoyer ce contact</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
