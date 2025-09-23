// pages/add-member.js
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AddMember() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    statut: "nouveau",
    how_came: "",
    besoin: "",
    assignee: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setFormData({
      nom: "",
      prenom: "",
      telephone: "",
      email: "",
      statut: "nouveau",
      how_came: "",
      besoin: "",
      assignee: "",
    });
  };

  const handleCancel = () => {
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from("membres").insert([formData]);
      if (error) throw error;

      setSuccessMessage("✅ Membre ajouté avec succès !");
      resetForm(); // on garde le message
    } catch (err) {
      alert(err.message);
    }
  };

  // Auto-disparition du message après 3 secondes
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl">
        <h1 className="text-3xl font-extrabold text-center text-indigo-700 mb-2">
          Ajouter un membre
        </h1>
        <p className="text-center text-gray-500 italic mb-6">
          « Allez, faites de toutes les nations des disciples » – Matthieu 28:19
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nom */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Nom</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Prénom */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Prénom</label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Téléphone</label>
            <input
              type="text"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Statut */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Statut</label>
            <select
              name="statut"
              value={formData.statut}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">-- Sélectionner --</option>
              <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
              <option value="a déjà mon église">A déjà mon église</option>
              <option value="visiteur">Visiteur</option>
            </select>
          </div>

          {/* Comment est venu */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Comment est-il venu ?</label>
            <select
              name="how_came"
              value={formData.how_came}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">-- Sélectionner --</option>
              <option value="invité">Invité</option>
              <option value="réseaux">Réseaux</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          {/* Besoin */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Besoin de la personne</label>
            <textarea
              name="besoin"
              value={formData.besoin}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Assignée à */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Assignée à</label>
            <select
              name="assignee"
              value={formData.assignee}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">-- Sélectionner une cellule --</option>
              <option value="Curepipe">Cellule de Curepipe</option>
              <option value="Bois Rouge">Cellule de Bois Rouge</option>
              <option value="Bambous">Cellule de Bambous</option>
              <option value="Mon Gout">Cellule de Mon Gout</option>
              <option value="Rose Hill">Cellule de Rose Hill</option>
              <option value="Eglise">Eglise</option>
            </select>
          </div>

          {/* Boutons */}
          <div className="flex justify-between mt-6 gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 py-4 text-lg bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-md transition-all duration-200"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 py-4 text-lg bg-green-600 hover:bg-green-700 text-white font-bold rounded-2xl shadow-md transition-all duration-200"
            >
              Ajouter
            </button>
          </div>

          {/* Message de succès SOUS les boutons */}
          {successMessage && (
            <div className="mt-4 p-4 rounded-xl bg-green-100 text-green-700 text-center font-semibold">
              {successMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
