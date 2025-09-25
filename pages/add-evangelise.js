// pages/add-evangelise.js
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useRouter } from "next/router";

export default function AddEvangelise() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    isWhatsapp: false,
    email: "",
    ville: "",
    statut: "evangelisé",
    besoin: "",
    infos_supplementaires: "",
    how_came: "evangelisation",
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.from("membres").insert([formData]);
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setFormData({
        nom: "",
        prenom: "",
        telephone: "",
        isWhatsapp: false,
        email: "",
        ville: "",
        statut: "evangelisé",
        besoin: "",
        infos_supplementaires: "",
        how_came: "evangelisation",
      });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl">
        <button
          onClick={() => router.back()}
          className="flex items-center text-orange-500 font-semibold mb-4"
        >
          ← Retour
        </button>

        <h1 className="text-3xl font-extrabold text-center text-indigo-700 mb-2">
          Ajouter une personne évangélisée
        </h1>
        <p className="text-center text-gray-500 italic mb-6">
          « Allez, faites de toutes les nations des disciples » – Matthieu 28:19
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nom */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Nom</label>
            <input type="text" name="nom" value={formData.nom} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl" />
          </div>
          {/* Prénom */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Prénom</label>
            <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl" />
          </div>
          {/* Téléphone */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Téléphone</label>
            <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} required className="w-full px-4 py-3 border rounded-xl" />
          </div>
          {/* WhatsApp */}
          <div className="flex items-center gap-2">
            <input type="checkbox" name="isWhatsapp" checked={formData.isWhatsapp} onChange={handleChange} />
            <label className="text-gray-700">Ce numéro est WhatsApp</label>
          </div>
          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl" />
          </div>
          {/* Ville */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Ville</label>
            <input type="text" name="ville" value={formData.ville} onChange={handleChange} className="w-full px-4 py-3 border rounded-xl" />
          </div>
          {/* Besoin */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Besoin</label>
            <textarea name="besoin" value={formData.besoin} onChange={handleChange} rows={3} className="w-full px-4 py-3 border rounded-xl"></textarea>
          </div>
          {/* Info supplémentaire */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Informations supplémentaires</label>
            <textarea name="infos_supplementaires" value={formData.infos_supplementaires} onChange={handleChange} rows={3} className="w-full px-4 py-3 border rounded-xl"></textarea>
          </div>

          <div className="flex justify-between gap-4 mt-4">
            <button type="button" onClick={() => setFormData({
              nom: "", prenom: "", telephone: "", isWhatsapp: false, email: "", ville: "", statut: "evangelisé", besoin: "", info_supp: "", how_came: "evangelisation"
            })} className="flex-1 py-3 bg-blue-500 text-white rounded-2xl">Annuler</button>

            <button type="submit" className="flex-1 py-3 bg-green-600 text-white rounded-2xl">Ajouter</button>
          </div>
        </form>

        {success && <div className="text-green-600 font-semibold text-center mt-4">✅ Personne évangélisée ajoutée !</div>}
      </div>
    </div>
  );
}
