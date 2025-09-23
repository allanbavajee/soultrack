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
    how_came: "",
    besoin: "",
    assignee: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("membres").insert([formData]);
    if (error) {
      console.error(error);
    } else {
      setSuccessMessage("✅ Membre ajouté avec succès !");
      setFormData({
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

  const handleCancel = () => {
    setFormData({
      nom: "",
      prenom: "",
      telephone: "",
      email: "",
      statut: "visiteur",
      how_came: "",
      besoin: "",
      assignee: "",
    });
    setSuccessMessage("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Ajouter un nouveau membre
        </h1>
        <p className="text-center text-sm text-gray-500 mb-6">
          « Allez, faites de toutes les nations des disciples » – Matthieu 28:19
        </p>

        {successMessage && (
          <div className="mb-4 p-3 text-green-800 bg-green-100 border border-green-300 rounded-lg text-sm">
            {successMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="nom"
            placeholder="Nom"
            value={formData.nom}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300"
          />
          <input
            name="prenom"
            placeholder="Prénom"
            value={formData.prenom}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300"
          />
          <input
            name="telephone"
            placeholder="Téléphone"
            value={formData.telephone}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300"
          />
          <input
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300"
          />
          <select
            name="statut"
            value={formData.statut}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300"
          >
            <option value="visiteur">Visiteur</option>
            <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
            <option value="a déjà mon église">A déjà mon église</option>
          </select>
          <textarea
            name="how_came"
            placeholder="Comment il est venu"
            value={formData.how_came}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300"
          />
          <textarea
            name="besoin"
            placeholder="Besoin de la personne"
            value={formData.besoin}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300"
          />
          <select
            name="assignee"
            value={formData.assignee}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring focus:ring-indigo-300"
          >
            <option value="">-- Assignée --</option>
            <option value="Cellule de Curepipe">Cellule de Curepipe</option>
            <option value="Cellule de Bois Rouge">Cellule de Bois Rouge</option>
            <option value="Cellule de Bambous">Cellule de Bambous</option>
            <option value="Cellule de Rose Hill">Cellule de Rose Hill</option>
            <option value="Cellule de Mon Gout">Cellule de Mon Gout</option>
            <option value="Église">Église</option>
          </select>

          <div className="flex justify-between gap-3">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
