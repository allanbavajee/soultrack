// pages/add-member.js
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function AddMember() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    statut: "visiteur",
    comment: "",
    besoin: "",
    assignee: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    const { error } = await supabase.from("membres").insert([formData]);
    setLoading(false);

    if (!error) {
      setSuccess(true);
      setFormData({
        nom: "",
        prenom: "",
        telephone: "",
        email: "",
        statut: "visiteur",
        comment: "",
        besoin: "",
        assignee: "",
      });
    } else {
      alert("Erreur: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-lg p-8">
        {/* Logo + Verset */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-indigo-600">SoulTrack ✝</h1>
          <p className="text-sm text-gray-500 italic">
            « Allez, faites de toutes les nations des disciples » – Matthieu 28:19
          </p>
        </div>

        {/* Titre */}
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-6">
          Ajouter un nouveau membre
        </h2>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nom</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Prénom</label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
            <input
              type="text"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              required
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Statut</label>
            <select
              name="statut"
              value={formData.statut}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="visiteur">Visiteur</option>
              <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
              <option value="a déjà mon église">A déjà mon église</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Comment est-il venu ?</label>
            <input
              type="text"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Besoin de la personne</label>
            <textarea
              name="besoin"
              value={formData.besoin}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Assigné à</label>
            <select
              name="assignee"
              value={formData.assignee}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">-- Choisir une cellule --</option>
              <option value="Curepipe">Cellule de Curepipe</option>
              <option value="Bois Rouge">Cellule de Bois Rouge</option>
              <option value="Bambous">Cellule de Bambous</option>
              <option value="Rose Hill">Cellule de Rose Hill</option>
              <option value="Mon Gout">Cellule de Mon Gout</option>
              <option value="Eglise">Eglise</option>
            </select>
          </div>

          {/* Boutons */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() =>
                setFormData({
                  nom: "",
                  prenom: "",
                  telephone: "",
                  email: "",
                  statut: "visiteur",
                  comment: "",
                  besoin: "",
                  assignee: "",
                })
              }
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100"
            >
              Annuler
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow"
            >
              {loading ? "Ajout..." : "Ajouter"}
            </button>
          </div>

          {/* Message succès */}
          {success && (
            <p className="text-green-600 text-center mt-4 font-medium">
              ✅ Membre ajouté avec succès !
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
