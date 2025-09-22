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
    setForm({ nom:"", prenom:"", telephone:"", email:"", statut:"visiteur", how_came:"", besoin:"", responsable_suivi:"" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center p-4">
      
      {/* Header */}
      <div className="text-center mb-6">
        <img src="/logo.png" alt="Logo ICC" className="mx-auto w-20 h-20 mb-2" />
        <h1 className="text-3xl font-bold text-indigo-700">Ajouter un nouveau membre</h1>
        <p className="text-indigo-500 mt-1 italic text-sm">« Allez, faites de toutes les nations des disciples » – Matthieu 28:19</p>
      </div>

      <form 
        onSubmit={handleSubmit} 
        className="bg-white shadow-md rounded-xl w-full max-w-lg p-6 space-y-6"
      >
        {/* Informations personnelles */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-indigo-600 border-b pb-1">Informations personnelles</h2>
          <input name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} required
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400" />
          <input name="prenom" placeholder="Prénom" value={form.prenom} onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400" />
          <input name="telephone" placeholder="📞 Téléphone" value={form.telephone} onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400" />
          <input name="email" placeholder="✉️ Email" value={form.email} onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400" />
        </section>

        {/* Statut et provenance */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-indigo-600 border-b pb-1">Statut et provenance</h2>
          <select name="statut" value={form.statut} onChange={handleChange} 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 bg-indigo-50">
            <option value="visiteur">👋 Visiteur</option>
            <option value="veut rejoindre ICC">🙏 Veut rejoindre ICC</option>
            <option value="a déjà mon église">⛪ A déjà mon église</option>
          </select>

          <select name="how_came" value={form.how_came} onChange={handleChange} 
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 bg-indigo-50">
            <option value="">Comment es-tu venu ?</option>
            <option value="invite">👤 Invité</option>
            <option value="reseaux">🌐 Réseaux</option>
            <option value="autre">📌 Autre</option>
          </select>
        </section>

        {/* Besoin et assignation */}
        <section className="space-y-2">
          <h2 className="text-lg font-semibold text-indigo-600 border-b pb-1">Besoin & Assignation</h2>
          <textarea name="besoin" placeholder="📝 Besoin de la personne" value={form.besoin} onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400" />
          <select name="responsable_suivi" value={form.responsable_suivi} onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 bg-indigo-50">
            <option value="">Assignée à</option>
            {cellules.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </section>

        <button type="submit" className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition transform hover:scale-[1.02]">
          Ajouter le membre
        </button>
      </form>
    </div>
  );
}
