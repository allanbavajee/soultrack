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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-6 flex flex-col items-center justify-start">
      <div className="w-full max-w-lg bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-6">
        <h1 className="text-3xl font-extrabold text-center text-purple-800 mb-4">
          ➕ Ajouter un membre
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="text"
              name="nom"
              placeholder="Nom"
              value={form.nom}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border-2 border-purple-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 shadow-sm"
              required
            />
            <input
              type="text"
              name="prenom"
              placeholder="Prénom"
              value={form.prenom}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border-2 border-purple-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 shadow-sm"
            />
            <input
              type="text"
              name="telephone"
              placeholder="📞 Téléphone"
              value={form.telephone}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border-2 border-indigo-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 shadow-sm"
            />
            <input
              type="email"
              name="email"
              placeholder="✉️ Email"
              value={form.email}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border-2 border-indigo-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 shadow-sm"
            />
            <select
              name="statut"
              value={form.statut}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border-2 border-green-400 bg-green-50 focus:border-green-500 focus:ring-1 focus:ring-green-200 shadow-sm"
            >
              <option value="visiteur">👋 Visiteur</option>
              <option value="veut rejoindre ICC">🙏 Veut rejoindre ICC</option>
              <option value="a déjà mon église">⛪ A déjà mon église</option>
            </select>
            <select
              name="how_came"
              value={form.how_came}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border-2 border-yellow-400 bg-yellow-50 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-200 shadow-sm"
            >
              <option value="">Comment es-tu venu à l'église ?</option>
              <option value="invite">👤 Invité</option>
              <option value="reseaux">🌐 Réseaux</option>
              <option value="autre">📌 Autre</option>
            </select>
            <textarea
              name="besoin"
              placeholder="📝 Besoin de la personne"
              value={form.besoin}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border-2 border-pink-400 focus:border-pink-500 focus:ring-1 focus:ring-pink-200 shadow-sm"
            />
            <select
              name="responsable_suivi"
              value={form.responsable_suivi}
              onChange={handleChange}
              className="w-full p-4 rounded-2xl border-2 border-indigo-300 bg-indigo-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 shadow-sm"
            >
              <option value="">Assignée à</option>
              {cellules.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-extrabold rounded-3xl shadow-lg"
          >
            Ajouter le membre
          </button>
        </form>
      </div>
    </div>
  );
}
