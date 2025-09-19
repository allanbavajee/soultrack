// /pages/add-member.js
import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function AddMember() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    statut: "nouveau", // valeur par défaut valide
    how_came: "",
    assignee: "",
    besoins: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { error } = await supabase.from("membres").insert([formData]);

    if (error) {
      setMessage("Erreur : " + error.message);
    } else {
      setMessage("✅ Nouveau membre ajouté !");
      setFormData({
        nom: "",
        prenom: "",
        telephone: "",
        email: "",
        statut: "nouveau",
        how_came: "",
        assignee: "",
        besoins: "",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6 px-4 font-poppins">
      <header className="mb-6 text-center">
        <img src="/logo.png" alt="Logo ICC" className="w-20 mx-auto mb-2" />
        <p className="text-gray-700 italic">
          « Je vous donnerai des bergers selon mon cœur » (Jérémie 3:15)
        </p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-center mb-4 text-blue-700">
          Ajouter un nouveau membre
        </h1>

        <input
          type="text"
          name="nom"
          placeholder="Nom"
          value={formData.nom}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
          required
        />
        <input
          type="text"
          name="prenom"
          placeholder="Prénom"
          value={formData.prenom}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
          required
        />
        <input
          type="text"
          name="telephone"
          placeholder="Téléphone (WhatsApp si possible)"
          value={formData.telephone}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />

        {/* ✅ Statut - uniquement valeurs valides de l'enum */}
        <select
          name="statut"
          value={formData.statut}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        >
          <option value="nouveau">Nouveau</option>
          <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
          <option value="a déjà mon église">A déjà mon église</option>
          <option value="ancien">Ancien</option>
          <option value="visiteur">Visiteur</option>
          <option value="suivi">Suivi</option>
          <option value="inactif">Inactif</option>
        </select>

        <select
          name="how_came"
          value={formData.how_came}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        >
          <option value="">Comment êtes-vous venu ?</option>
          <option value="invite">Invité</option>
          <option value="reseaux">Réseaux sociaux</option>
          <option value="autre">Autre</option>
        </select>

        <select
          name="assignee"
          value={formData.assignee}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        >
          <option value="">Assignée</option>
          <option value="Curepipe">Cellule de Curepipe</option>
          <option value="Bois Rouge">Cellule de Bois Rouge</option>
          <option value="Bambous">Cellule de Bambous</option>
          <option value="Rose Hill">Cellule de Rose Hill</option>
          <option value="Mon Gout">Cellule de Mon Gout</option>
          <option value="Eglise">Eglise</option>
        </select>

        <textarea
          name="besoins"
          placeholder="Besoins de la personne"
          value={formData.besoins}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded font-semibold hover:bg-blue-700"
        >
          Ajouter
        </button>

        {message && <p className="mt-4 text-center text-sm">{message}</p>}
      </form>
    </div>
  );
}
