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
    { value: "Cellule de Curepipe", responsable: "Charlotte" },
    { value: "Cellule de Bois Rouge", responsable: "Lucie" },
    { value: "Cellule de Bambous", responsable: "Manish" },
    { value: "Cellule de Rose Hill", responsable: "Fabrice" },
    { value: "Cellule de Mon Gout", responsable: "May Jane" },
    { value: "Eglise", responsable: "Pastoral" },
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("membres").insert([form]);
    if (error) {
      alert("Erreur : " + error.message);
    } else {
      alert("Membre ajouté avec succès 🙌");
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
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
      {/* Logo et verset */}
      <div className="text-center mb-6">
        <img src="/logo.png" alt="Logo ICC" className="mx-auto w-20 h-20" />
        <p className="mt-2 text-sm italic text-gray-600">
          « Allez, faites de toutes les nations des disciples » – Matthieu 28:19
        </p>
      </div>

      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow-lg">
        <h1 className="text-xl font-bold text-center text-gray-800 mb-4">
          Ajouter un nouveau membre
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="nom"
            placeholder="Nom"
            value={form.nom}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
            required
          />
          <input
            type="text"
            name="prenom"
            placeholder="Prénom"
            value={form.prenom}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="text"
            name="telephone"
            placeholder="Téléphone"
            value={form.telephone}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          {/* Statut */}
          <select
            name="statut"
            value={form.statut}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          >
            <option value="visiteur">Visiteur</option>
            <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
            <option value="a déjà mon église">A déjà mon église</option>
          </select>

          {/* Comment il est venu */}
          <select
            name="how_came"
            value={form.how_came}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Comment es-tu venu à l'église ?</option>
            <option value="invite">Invité</option>
            <option value="reseaux">Réseaux</option>
            <option value="autre">Autre</option>
          </select>

          {/* Besoin */}
          <textarea
            name="besoin"
            placeholder="Besoin de la personne"
            value={form.besoin}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          />

          {/* Assignée à */}
          <select
            name="responsable_suivi"
            value={form.responsable_suivi}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg"
          >
            <option value="">Assignée à</option>
            {cellules.map((c) => (
              <option key={c.value} value={c.value}>
                {c.value}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700"
          >
            Ajouter
          </button>
        </form>
      </div>
    </div>
  );
}
