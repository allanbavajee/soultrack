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
    commentaire: "",
    besoin: "",
    assignee: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("membres").insert([form]);
    if (error) alert(error.message);
    else alert("✅ Membre ajouté !");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-white">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8">
        {/* Logo + titre */}
        <div className="text-center mb-6">
          <img
            src="/logo.png"
            alt="Logo"
            className="mx-auto h-16 w-16 mb-2"
          />
          <h1 className="text-2xl font-bold text-gray-800">
            ➕ Ajouter un nouveau membre
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            « Allez, faites de toutes les nations des disciples » <br />
            <span className="italic">– Matthieu 28:19</span>
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              name="nom"
              value={form.nom}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Prénom</label>
            <input
              type="text"
              name="prenom"
              value={form.prenom}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
            <input
              type="text"
              name="telephone"
              value={form.telephone}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Statut</label>
            <select
              name="statut"
              value={form.statut}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            >
              <option value="visiteur">Visiteur</option>
              <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
              <option value="a déjà mon église">A déjà mon église</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Commentaire</label>
            <textarea
              name="commentaire"
              value={form.commentaire}
              onChange={handleChange}
              rows="2"
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Besoin de la personne</label>
            <textarea
              name="besoin"
              value={form.besoin}
              onChange={handleChange}
              rows="2"
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Assignée à</label>
            <select
              name="assignee"
              value={form.assignee}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            >
              <option value="">-- Choisir --</option>
              <option>Cellule de Curepipe</option>
              <option>Cellule de Bois Rouge</option>
              <option>Cellule de Bambous</option>
              <option>Cellule de Rose Hill</option>
              <option>Cellule de Mon Gout</option>
              <option>Église</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-indigo-500 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-600 transition"
          >
            Ajouter
          </button>
        </form>
      </div>
    </div>
  );
}
