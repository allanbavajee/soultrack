// pages/add-member.js
import { useState } from "react";
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.from("membres").insert([formData]);
    if (error) alert(error.message);
    else alert("Membre ajouté avec succès !");
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

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-2">Ajouter un nouveau membre</h1>
        <p className="text-center text-gray-500 mb-6 italic">« Allez, faites de toutes les nations des disciples » – Matthieu 28:19</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Nom</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Prénom */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Prénom</label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Téléphone</label>
            <input
              type="text"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Statut */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Statut</label>
            <select
              name="statut"
              value={formData.statut}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="nouveau">Nouveau</option>
              <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
              <option value="a déjà mon église">A déjà mon église</option>
              <option value="visiteur">Visiteur</option>
            </select>
          </div>

          {/* Comment est venu */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Comment est-il venu à l'église ?</label>
            <select
              name="how_came"
              value={formData.how_came}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="">-- Sélectionner --</option>
              <option value="invité">Invité</option>
              <option value="réseaux">Réseaux</option>
              <option value="autre">Autre</option>
            </select>
          </div>

          {/* Besoin */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Besoin de la personne</label>
            <textarea
              name="besoin"
              value={formData.besoin}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          {/* Assignée à */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Assignée à</label>
            <select
              name="assignee"
              value={formData.assignee}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
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

          {/* Bouton Ajouter */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
          >
            Ajouter
          </button>
        </form>
      </div>
    </div>
  );
}
