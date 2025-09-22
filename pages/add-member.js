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
    responsable_suivi: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("membres").insert([form]);
    if (error) return alert("❌ Erreur : " + error.message);
    alert("✅ Nouveau membre ajouté !");
    setForm({
      nom: "",
      prenom: "",
      telephone: "",
      email: "",
      statut: "visiteur",
      how_came: "",
      besoin: "",
      responsable_suivi: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center p-4">
      <div className="text-center mb-6">
        <img src="/logo.png" alt="Logo ICC" className="mx-auto w-24 h-24 mb-2" />
        <h1 className="text-3xl font-bold text-indigo-700">Ajouter un nouveau membre</h1>
        <p className="text-indigo-500 mt-1 italic text-sm">
          « Allez, faites de toutes les nations des disciples » – Matthieu 28:19
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl w-full max-w-md p-8 space-y-6"
      >
        <div>
          <label className="block text-indigo-600 font-semibold mb-1">Nom</label>
          <input
            type="text"
            name="nom"
            value={form.nom}
            onChange={handleChange}
            placeholder="Nom"
            required
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-indigo-600 font-semibold mb-1">Prénom</label>
          <input
            type="text"
            name="prenom"
            value={form.prenom}
            onChange={handleChange}
            placeholder="Prénom"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-indigo-600 font-semibold mb-1">Téléphone</label>
          <input
            type="tel"
            name="telephone"
            value={form.telephone}
            onChange={handleChange}
            placeholder="Téléphone"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-indigo-600 font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-indigo-600 font-semibold mb-1">Statut</label>
          <select
            name="statut"
            value={form.statut}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 bg-indigo-50"
          >
            <option value="visiteur">Visiteur</option>
            <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
            <option value="a déjà mon église">A déjà mon église</option>
          </select>
        </div>

        <div>
          <label className="block text-indigo-600 font-semibold mb-1">
            Comment es-tu venu ?
          </label>
          <select
            name="how_came"
            value={form.how_came}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 bg-indigo-50"
          >
            <option value="">Sélectionner</option>
            <option value="invite">Invité</option>
            <option value="reseaux">Réseaux</option>
            <option value="autre">Autre</option>
          </select>
        </div>

        <div>
          <label className="block text-indigo-600 font-semibold mb-1">
            Besoin de la personne
          </label>
          <textarea
            name="besoin"
            value={form.besoin}
            onChange={handleChange}
            placeholder="Besoin de la personne"
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-indigo-600 font-semibold mb-1">Assignée à</label>
          <select
            name="responsable_suivi"
            value={form.responsable_suivi}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-400 bg-indigo-50"
          >
            <option value="">Sélectionner</option>
            <option value="Cellule de Curepipe">Cellule de Curepipe</option>
            <option value="Cellule de Bois Rouge">Cellule de Bois Rouge</option>
            <option value="Cellule de Bambous">Cellule de Bambous</option>
            <option value="Cellule de Rose Hill">Cellule de Rose Hill</option>
            <option value="Cellule de Mon Gout">Cellule de Mon Gout</option>
            <option value="Eglise">Eglise</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition transform hover:scale-[1.02]"
        >
          Ajouter le membre
        </button>
      </form>
    </div>
  );
}
