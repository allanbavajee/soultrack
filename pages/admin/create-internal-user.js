//pages/admin/create-internal-user.js
"use client";

import { useState } from "react";

export default function CreateInternalUser() {
  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    password: "",
    role: "Membre",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erreur création utilisateur");

      setMessage("✅ Utilisateur créé avec succès !");
      setFormData({
        prenom: "",
        nom: "",
        email: "",
        telephone: "",
        password: "",
        role: "Membre",
      });
    } catch (err) {
      console.error(err);
      setMessage("❌ " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Créer un utilisateur</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="prenom"
            placeholder="Prénom"
            value={formData.prenom}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
          <input
            type="text"
            name="nom"
            placeholder="Nom"
            value={formData.nom}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
          <input
            type="text"
            name="telephone"
            placeholder="Téléphone"
            value={formData.telephone}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
          <input
            type="password"
            name="password"
            placeholder="Mot de passe"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            required
          >
            <option value="Admin">Admin</option>
            <option value="ResponsableIntegration">Responsable Integration</option>
            <option value="ResponsableEvangelisation">Responsable Evangelisation</option>
            <option value="ResponsableCellule">Responsable Cellule</option>
            <option value="Membre">Membre</option>
          </select>

          {message && <p className="text-center">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {loading ? "Création..." : "Créer l'utilisateur"}
          </button>
        </form>
      </div>
    </div>
  );
}

