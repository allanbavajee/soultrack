// pages/add-member.js
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function AddMember() {
  const [form, setForm] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    email: '',
    statut: 'visiteur',
    how_came: '',
    besoin: '',
    responsable_suivi: '',
  });

  const cellules = [
    'Cellule de Curepipe',
    'Cellule de Bois Rouge',
    'Cellule de Bambous',
    'Cellule de Rose Hill',
    'Cellule de Mon Gout',
    'Eglise',
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('membres').insert([form]);
    if (error) {
      alert('❌ Erreur : ' + error.message);
    } else {
      alert('✅ Nouveau membre ajouté avec succès !');
      setForm({
        nom: '',
        prenom: '',
        telephone: '',
        email: '',
        statut: 'visiteur',
        how_came: '',
        besoin: '',
        responsable_suivi: '',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-100 to-white p-6 flex flex-col items-center">
      <div className="text-center mb-6">
        <img src="/logo.png" alt="Logo ICC" className="mx-auto w-20 h-20 drop-shadow-md" />
        <p className="mt-3 text-sm italic text-indigo-700 font-medium">
          « Allez, faites de toutes les nations des disciples » – Matthieu 28:19
        </p>
      </div>

      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl border border-indigo-100">
        <h1 className="text-2xl font-extrabold text-center text-indigo-700 mb-6">
          ➕ Ajouter un membre
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="nom"
            placeholder="Nom"
            value={form.nom}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
            required
          />
          <input
            type="text"
            name="prenom"
            placeholder="Prénom"
            value={form.prenom}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="text"
            name="telephone"
            placeholder="📞 Téléphone"
            value={form.telephone}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
          />
          <input
            type="email"
            name="email"
            placeholder="✉️ Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
          />

          <select
            name="statut"
            value={form.statut}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 bg-indigo-50"
          >
            <option value="visiteur">👋 Visiteur</option>
            <option value="veut rejoindre ICC">🙏 Veut rejoindre ICC</option>
            <option value="a déjà mon église">⛪ A déjà mon église</option>
          </select>

          <select
            name="how_came"
            value={form.how_came}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 bg-indigo-50"
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
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
          />

          <select
            name="responsable_suivi"
            value={form.responsable_suivi}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 bg-indigo-50"
          >
            <option value="">Assignée à</option>
            {cellules.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition transform hover:scale-[1.02]"
          >
            Ajouter
          </button>
        </form>
      </div>
    </div>
  );
}
