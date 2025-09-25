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
    email: "",
    ville: "",
    statut: "evangelisé",
    infos_supplementaires: "", // <-- utilise la colonne existante
    whatsapp: false,
    how_came: "",
    besoin: "",
  });

  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
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
        email: "",
        ville: "",
        statut: "evangelisé",
        infos_supplementaires: "",
        whatsapp: false,
        how_came: "",
        besoin: "",
      });
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-white">
      <div className="w-full max-w-md bg-gray-50 p-8 rounded-3xl shadow-2xl">
        <button
          onClick={() => router.back()}
          className="flex items-center text-orange-500 font-semibold mb-4"
        >
          ← Retour
        </button>

        <h1 className="text-3xl font-extrabold text-center text-indigo-700 mb-4">
          Ajouter évangélisé
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="prenom"
            placeholder="Prénom"
            value={formData.prenom}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border"
            required
          />
          <input
            type="text"
            name="nom"
            placeholder="Nom"
            value={formData.nom}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border"
            required
          />
          <input
            type="text"
            name="telephone"
            placeholder="Téléphone"
            value={formData.telephone}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border"
          />
          <input
            type="text"
            name="ville"
            placeholder="Ville"
            value={formData.ville}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border"
          />

          {/* Checkbox WhatsApp */}
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="whatsapp"
              checked={formData.whatsapp}
              onChange={handleChange}
              className="h-5 w-5"
            />
            Ce numéro a WhatsApp
          </label>

          {/* Infos supplémentaires */}
          <textarea
            name="infos_supplementaires"
            placeholder="Informations supplémentaires"
            value={formData.infos_supplementaires}
            onChange={handleChange}
            className="w-full p-3 rounded-xl border"
            rows={3}
          />

          <button
            type="submit"
            className="w-full py-3 bg-green-600 text-white rounded-xl font-bold"
          >
            Ajouter
          </button>
        </form>

        {success && (
          <p className="text-green-600 font-semibold text-center mt-4">
            ✅ Évangélisé ajouté avec succès !
          </p>
        )}
      </div>
    </div>
  );
}

