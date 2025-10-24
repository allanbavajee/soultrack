"use client";

import { useState } from "react";
import { useRouter } from "next/router";

export default function CreateResponsable() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    password: "",
    role: "ResponsableIntegration", // par défaut
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Gestion du changement des champs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erreur inconnue");

      setMessage(`✅ ${formData.role} créé avec succès !`);
      setFormData({
        prenom: "",
        nom: "",
        email: "",
        telephone: "",
        password: "",
        role: "ResponsableIntegration",
      });
    } catch (err) {
      console.error("Erreur création responsable :", err);
      setMessage(`❌ Erreur : ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-100 to-indigo-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl">
        <button
          onClick={() => router.back()}
          className="text-indigo-600 font-semibold mb-4 hover:text-indigo-800 transition"
        >
          ← Retour
        </button>

        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-2">
          Créer un responsable
        </h1>
        <p className="text-center text-gray-500 italic mb-6">
          « Servir, c’est régner » 👑
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Prénom */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Prénom</label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* Nom */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Nom</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* Téléphone */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Téléphone</label>
            <input
              type="text"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* Rôle */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">Rôle</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-indigo-400 outline-none"
            >
              <option value="ResponsableIntegration">Responsable Intégration</option>
              <option value="ResponsableEvangelisation">Responsable Évangélisation</option>
              <option value="ResponsableCellule">Responsable Cellule</option>
            </select>
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-2xl text-white font-semibold transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? "Création..." : "Créer le responsable"}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 text-center font-semibold ${
              message.startsWith("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
