// pages/add-member.js
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AddMember() {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    statut: "visiteur",
    how_came: "",
    besoin: "",
    assignee: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("membres").insert([form]);
    if (error) {
      alert("Erreur : " + error.message);
    } else {
      alert("✅ Membre ajouté avec succès !");
      setForm({
        nom: "",
        prenom: "",
        telephone: "",
        email: "",
        statut: "visiteur",
        how_came: "",
        besoin: "",
        assignee: "",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-2">Ajouter un membre</h1>
        <p className="text-center text-gray-500 mb-6 text-sm">
          « Allez, faites de toutes les nations des disciples » – Matthieu 28:19
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nom */}
          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <input
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Nom"
              required
            />
          </div>

          {/* Prénom */}
          <div>
            <label className="block text-sm font-medium mb-1">Prénom</label>
            <input
              type="text"
              name="prenom"
              value={form.prenom}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Prénom"
            />
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-sm font-medium mb-1">Téléphone</label>
            <input
              type="tel"
              name="telephone"
              value={form.telephone}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Téléphone"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Email"
            />
          </div>

          {/* Statut */}
          <div>
            <label className="block text-sm font-medium mb-1">Statut</label>
            <select
              name="statut"
              value={form.statut}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="visiteur">Visiteur</option>
              <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
              <option value="a déjà mon église">A déjà mon église</option>
            </select>
          </div>

          {/* Comment il est venu */}
          <div>
            <label className="block text-sm font-medium mb-1">Comment il est venu</label>
            <input
              type="text"
              name="how_came"
              value={form.how_came}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Invité, réseaux, autre..."
            />
          </div>

          {/* Besoin */}
          <div>
            <label className="block text-sm font-medium mb-1">Besoin de la personne</label>
            <textarea
              name="besoin"
              value={form.besoin}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              rows="3"
              placeholder="Décrire le besoin..."
            />
          </div>

          {/* Assignée à */}
          <div>
            <label className="block text-sm font-medium mb-1">Assignée à</label>
            <select
              name="assignee"
              value={form.assignee}
              onChange={handleChange}
              className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              <option value="">-- Sélectionner --</option>
              <option value="Cellule de Curepipe">Cellule de Curepipe</option>
              <option value="Cellule de Bois Rouge">Cellule de Bois Rouge</option>
              <option value="Cellule de Bambous">Cellule de Bambous</option>
              <option value="Cellule de Rose Hill">Cellule de Rose Hill</option>
              <option value="Cellule de Mon Gout">Cellule de Mon Gout</option>
              <option value="Église">Église</option>
            </select>
          </div>

          {/* Bouton */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-xl hover:bg-indigo-700 transition"
          >
            ➕ Ajouter
          </button>
        </form>
      </div>
    </div>
  );
}
