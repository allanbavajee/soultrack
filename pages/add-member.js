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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("membres").insert([form]);
    if (error) {
      alert("❌ Erreur : " + error.message);
    } else {
      alert("✅ Nouveau membre ajouté avec succès !");
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
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-400 via-indigo-300 to-white p-6 flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="bg-white/20 backdrop-blur-md inline-block px-6 py-4 rounded-3xl shadow-lg">
          <img src="/logo.png" alt="Logo ICC" className="mx-auto w-24 h-24 mb-2 animate-bounce" />
          <p className="text-indigo-900 font-bold text-lg">
            « Allez, faites de toutes les nations des disciples » – Matthieu 28:19
          </p>
        </div>
      </div>

      {/* Card Form */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-indigo-200 animate-fade-in">
        <h1 className="text-3xl font-extrabold text-center text-indigo-700 mb-6">
          Ajouter un membre
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Nom & Prénom */}
          <div className="space-y-2">
            <input
              type="text"
              name="nom"
              placeholder="Nom"
              value={form.nom}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border-2 border-purple-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 shadow-sm transition"
              required
            />
            <input
              type="text"
              name="prenom"
              placeholder="Prénom"
              value={form.prenom}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border-2 border-purple-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 shadow-sm transition"
            />
          </div>

          {/* Téléphone & Email */}
          <div className="space-y-2">
            <input
              type="text"
              name="telephone"
              placeholder="📞 Téléphone"
              value={form.telephone}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border-2 border-indigo-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 shadow-sm transition"
            />
            <input
              type="email"
              name="email"
              placeholder="✉️ Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border-2 border-indigo-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 shadow-sm transition"
            />
          </div>

          {/* Statut */}
          <select
            name="statut"
            value={form.statut}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl border-2 border-green-300 bg-green-50 focus:border-green-500 focus:ring-1 focus:ring-green-200 shadow-sm transition"
          >
            <option value="visiteur">👋 Visiteur</option>
            <option value="veut rejoindre ICC">🙏 Veut rejoindre ICC</option>
            <option value="a déjà mon église">⛪ A déjà mon église</option>
          </select>

          {/* Comment il est venu */}
          <select
            name="how_came"
            value={form.how_came}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl border-2 border-yellow-300 bg-yellow-50 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-200 shadow-sm transition"
          >
            <option value="">Comment es-tu venu à l'église ?</option>
            <option value="invite">👤 Invité</option>
            <option value="reseaux">🌐 Réseaux</option>
            <option value="autre">📌 Autre</option>
          </select>

          {/* Besoin */}
          <textarea
            name="besoin"
            placeholder="📝 Besoin de la personne"
            value={form.besoin}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl border-2 border-pink-300 focus:border-pink-500 focus:ring-1 focus:ring-pink-200 shadow-sm transition"
          />

          {/* Assignée à */}
          <select
            name="responsable_suivi"
            value={form.responsable_suivi}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl border-2 border-indigo-300 bg-indigo-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 shadow-sm transition"
          >
            <option value="">Assignée à</option>
            {cellules.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Bouton Ajouter */}
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-3xl shadow-lg hover:scale-105 transition transform"
          >
            Ajouter le membre
          </button>
        </form>
      </div>
    </div>
  );
}
