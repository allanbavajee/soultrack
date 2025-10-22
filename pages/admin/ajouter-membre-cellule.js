"use client";

import { useState, useEffect } from "react";
import supabase from "../../lib/supabaseClient";
import { useRouter } from "next/router";

export default function AjouterMembreCellule() {
  const router = useRouter();
  const [celluleId, setCelluleId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    ville: "",
    statut: "nouveau",
    venu: "",
    besoin: "",
    is_whatsapp: false,
    infos_supplementaires: "",
  });

  // ✅ Charger la cellule associée
  useEffect(() => {
    const storedCelluleId = localStorage.getItem("celluleId");
    if (!storedCelluleId) {
      alert("⚠️ Aucune cellule trouvée. Retour au hub.");
      router.push("/cellules-hub");
      return;
    }
    setCelluleId(storedCelluleId);
    setLoading(false);
  }, [router]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!celluleId) {
      alert("Aucune cellule sélectionnée !");
      return;
    }

    try {
      const { error } = await supabase.from("membres").insert([
        {
          ...formData,
          cellule_id: celluleId,
          created_at: new Date().toISOString(),
        },
      ]);

      if (error) throw error;
      setSuccess(true);

      setFormData({
        nom: "",
        prenom: "",
        telephone: "",
        ville: "",
        statut: "nouveau",
        venu: "",
        besoin: "",
        is_whatsapp: false,
        infos_supplementaires: "",
      });

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Erreur : " + err.message);
    }
  };

  if (loading)
    return <div className="text-center mt-20 text-white">Chargement...</div>;

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)",
      }}
    >
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl">
        {/* Flèche retour */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-600 font-semibold mb-4 hover:text-blue-800 transition"
        >
          ← Retour
        </button>

        <h1 className="text-3xl font-extrabold text-center text-indigo-700 mb-2">
          Ajouter un membre à la cellule
        </h1>
        <p className="text-center text-gray-500 italic mb-6">
          « Allez, faites de toutes les nations des disciples » – Matthieu 28:19
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Prénom */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Prénom
            </label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Nom */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Nom</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Téléphone
            </label>
            <input
              type="text"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
            <div className="mt-2 flex items-center">
              <input
                type="checkbox"
                name="is_whatsapp"
                checked={formData.is_whatsapp}
                onChange={handleChange}
                className="mr-2"
              />
              <label className="text-gray-700">Ce numéro est WhatsApp</label>
            </div>
          </div>

          {/* Ville */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Ville</label>
            <input
              type="text"
              name="ville"
              value={formData.ville}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Statut */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Statut</label>
            <select
              name="statut"
              value={formData.statut}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400"
            >
              <option value="nouveau">Nouveau</option>
              <option value="visiteur">Visiteur</option>
              <option value="actif">Actif</option>
            </select>
          </div>

          {/* Venu */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Comment est-il venu ?
            </label>
            <select
              name="venu"
              value={formData.venu}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">-- Sélectionner --</option>
              <option value="invité">Invité</option>
              <option value="réseaux">Réseaux</option>
              <option value="evangélisation">Évangélisation</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          {/* Besoin */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Besoin de la personne ?
            </label>
            <select
              name="besoin"
              value={formData.besoin}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">-- Sélectionner --</option>
              <option value="Finances">Finances</option>
              <option value="Santé">Santé</option>
              <option value="Travail">Travail</option>
              <option value="Famille">Famille</option>
            </select>
          </div>

          {/* Infos supplémentaires */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Informations supplémentaires
            </label>
            <textarea
              name="infos_supplementaires"
              value={formData.infos_supplementaires}
              onChange={handleChange}
              rows={3}
              placeholder="Ajoute ici d'autres détails utiles..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Boutons */}
          <div className="flex justify-between mt-4 gap-4">
            <button
              type="button"
              onClick={() => router.push("/cellules-hub")}
              className="flex-1 py-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl shadow-md transition-all duration-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl shadow-md transition-all duration-200"
            >
              Ajouter
            </button>
          </div>
        </form>

        {success && (
          <div className="text-green-600 font-semibold text-center mt-3">
            ✅ Membre ajouté avec succès à ta cellule !
          </div>
        )}
      </div>
    </div>
  );
}
