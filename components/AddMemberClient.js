"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import supabase from "../lib/supabaseClient";

export default function AddMemberClient() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    ville: "",
    statut: "",
    how_came: "",
    besoin: "",
    is_whatsapp: false,
    infos_supplementaires: "",
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
    const { error } = await supabase.from("membres").insert([formData]);
    if (error) alert(error.message);
    else {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setFormData({
        nom: "",
        prenom: "",
        telephone: "",
        ville: "",
        statut: "",
        how_came: "",
        besoin: "",
        is_whatsapp: false,
        infos_supplementaires: "",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">Ajouter un membre</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input name="prenom" value={formData.prenom} onChange={handleChange} placeholder="Prénom" className="w-full border p-2 rounded" required />
          <input name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" className="w-full border p-2 rounded" required />
          <input name="telephone" value={formData.telephone} onChange={handleChange} placeholder="Téléphone" className="w-full border p-2 rounded" required />
          <input name="ville" value={formData.ville} onChange={handleChange} placeholder="Ville" className="w-full border p-2 rounded" />
          <textarea name="infos_supplementaires" value={formData.infos_supplementaires} onChange={handleChange} placeholder="Infos supplémentaires" className="w-full border p-2 rounded" />
          <button type="submit" className="w-full bg-green-600 text-white font-semibold py-2 rounded hover:bg-green-700">Ajouter</button>
        </form>

        {success && <p className="text-green-600 text-center mt-3">✅ Membre ajouté avec succès !</p>}
      </div>
    </div>
  );
}
