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
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-6 flex flex-col items-center">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="inline-block bg-white/20 backdrop-blur-md px-6 py-4 rounded-3xl shadow-lg animate-pulse">
          <img
            src="/logo.png"
            alt="Logo ICC"
            className="mx-auto w-24 h-24 rounded-full shadow-lg mb-3"
          />
          <p className="text-white font-bold text-lg italic drop-shadow-md">
            « Allez, faites de toutes les nations des disciples » – Matthieu 28:19
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-lg bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-6 border border-white/20 animate-fade-in">
        <h1 className="text-3xl font-extrabold text-center text-purple-800 mb-4">
          ➕ Ajouter un membre
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {/* Nom / Prénom */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="nom"
              placeholder="Nom"
              value={form.nom}
              onChange={handleChange}
              className="p-4 rounded-2xl border-2 border-purple-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 shadow-sm transition duration-300 hover:scale-105"
              required
            />
            <input
              type="text"
              name="prenom"
              placeholder="Prénom"
              value={form.prenom}
              onChange={handleChange}
              className="p-4 rounded-2xl border-2 border-purple-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 shadow-sm transition duration-300 hover:scale-105"
            />
          </div>

          {/* Contact */}
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              name="telephone"
              placeholder="📞 Téléphone"
              value={form.telephone}
              onChange={handleChange}
              className="p-4 rounded-2xl border-2 border-indigo-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 shadow-sm transition duration-300 hover:scale-105"
            />
            <input
              type="email"
              name="email"
              placeholder="✉️ Email"
              value={form.email}
              onChange={handleChange}
              className="p-4 rounded-2xl border-2 border-indigo-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 shadow-sm transition duration-300 hover:scale-105"
            />
          </div>

          {/* Statut */}
          <select
            name="statut"
            value={form.statut}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl border-2 border-green-400 bg-green-50 focus:border-green-500 focus:ring-1 focus:ring-green-200 shadow-sm transition duration-300 hover:scale-105"
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
            className="w-full p-4 rounded-2xl border-2 border-yellow-400 bg-yellow-50 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-200 shadow-sm transition duration-300 hover:scale-105"
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
            className="w-full p-4 rounded-2xl border-2 border-pink-400 focus:border-pink-500 focus:ring-1 focus:ring-pink-200 shadow-sm transition duration-300 hover:scale-105"
          />

          {/* Assignée à */}
          <select
            name="responsable_suivi"
            value={form.responsable_suivi}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl border-2 border-indigo-300 bg-indigo-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 shadow-sm transition duration-300 hover:scale-105"
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
            className="w-full py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-extrabold rounded-3xl shadow-lg hover:scale-105 transition transform duration-300"
          >
            Ajouter le membre
          </button>
        </form>
      </div>
    </div>
  );
}
