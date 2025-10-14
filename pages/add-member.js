"use client";

import { useState } from "react";
import supabase from "../lib/supabaseClient";
import { useRouter } from "next/router";

export default function AddMember() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    ville: "",
    statut: "nouveau",
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
    try {
      const { error } = await supabase.from("membres").insert([formData]);
      if (error) throw error;
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      setFormData({
        nom: "",
        prenom: "",
        telephone: "",
        ville: "",
        statut: "nouveau",
        how_came: "",
        besoin: "",
        is_whatsapp: false,
        infos_supplementaires: "",
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
          className="flex items-center text-orange-500 font-semibold mb-4 hover:text-orange-600 transition-colors"
        >
          ← Retour
        </button>

        <h1 className="text-3xl font-extrabold text-center text-indigo-700 mb-2">
          Ajouter un nouveau membre
        </h1>
        <p className="text-center text-gray-500 italic mb-6">
          « Allez, faites de toutes les nations des disciples » – Matthieu 28:19
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* ton formulaire inchangé */}
        </form>

        {success && (
          <div className="text-green-600 font-semibold text-center mt-3">
            ✅ Membre ajouté avec succès !
          </div>
        )}
      </div>
    </div>
  );
}
