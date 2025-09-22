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

  const cellules = [
    "Cellule de Curepipe",
    "Cellule de Bois Rouge",
    "Cellule de Bambous",
    "Cellule de Rose Hill",
    "Cellule de Mon Gout",
    "Eglise",
  ];

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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

      {/* Header */}
      <div className="text-center mb-6">
        <img src="/logo.png" alt="Logo ICC" className="mx-auto w-20 h-20 mb-2" />
        <h1 className="text-3xl font-bold text-indigo-700">Ajouter un nouveau membre</h1>
        <p className="text-indigo-500 mt-1 italic text-sm">
          « Allez, faites de toutes les nations des disciples » – Matthieu 28:19
        </p>
      </div>

      {/* Formulaire vertical */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl w-full max-w-md p-6 space-y-4"
      >
        {/* Nom */}
        <label className="font-semibold text-indigo-600">Nom</label>
        <input
          name="nom"
          value={form.nom}
          onChange={handleChange}
          placeholder="Nom"
          required
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
        />

        {/* Prénom */}
        <label className="font-semibold text-indigo-600">Prénom</label>
        <input
          name="prenom"
          value={form.prenom}
          onChange={handleChange}
          placeholder="Prénom"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
        />

        {/* Téléphone */}
        <label className="font-semibold text-indigo-600">Téléphone</label>
        <input
          name="telephone"
          value={form.telephone}
          onChange={handleChange}
          placeholder="Téléphone"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
        />

        {/* Email */}
        <label className="font-semibold text-indigo-600">Email</label>
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
        />

        {/* Statut */}
        <label className="font-semibold text-indigo-600">Statut</label>
        <select
          name="statut"
          value={form.statut}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 bg-indigo-50"
        >
          <option value="visiteur">Visiteur</option>
          <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
          <option value="a déjà mon église">A déjà mon église</option>
        </select>

        {/* Comment es-tu venu ? */}
        <label className="font-semibold text-indigo-600">Comment es-tu venu ?</label>
        <select
          name="how_came"
          value={form.how_came}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 bg-indigo-50"
        >
          <option value="">Sélectionner</option>
          <option value="invite">Invité</option>
          <option value="reseaux">Réseaux</option>
          <option value="autre">Autre</option>
        </select>

        {/* Besoin de la personne */}
        <label className="font-semibold text-indigo-600">Besoin de la personne</label>
        <textarea
          name="besoin"
          value={form.besoin}
          onChange={handleChange}
          placeholder="Besoin de la personne"
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
        />

        {/* Assignée à */}
        <label className="font-semibold text-indigo-600">Assignée à</label>
        <select
          name="responsable_suivi"
          value={form.responsable_suivi}
          onChange={handleChange}
          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 bg-indigo-50"
        >
          <option value="">Sélectionner</option>
          {cellules.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Bouton */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition transform hover:scale-[1.02]"
        >
          Ajouter le membre
        </button>
      </form>
    </div>
  );
}
