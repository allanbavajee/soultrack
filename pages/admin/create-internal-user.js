"use client";

import { useState } from "react";

export default function CreateUserForm() {
  const [form, setForm] = useState({ prenom: "", nom: "", email: "", password: "", role: "ResponsableIntegration" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur inconnue");

      setMessage(`✅ Créé avec succès ! ID: ${data.userId}`);
      setForm({ prenom: "", nom: "", email: "", password: "", role: "ResponsableIntegration" });
    } catch (err) {
      console.error(err);
      setMessage(`❌ Erreur : ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Créer un utilisateur</h1>
      <form onSubmit={handleSubmit} className="space-y-3">
        <input name="prenom" placeholder="Prénom" value={form.prenom} onChange={handleChange} required className="border p-2 w-full" />
        <input name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} required className="border p-2 w-full" />
        <input name="email" placeholder="Email" type="email" value={form.email} onChange={handleChange} required className="border p-2 w-full" />
        <input name="password" placeholder="Mot de passe" type="password" value={form.password} onChange={handleChange} required className="border p-2 w-full" />
        <select name="role" value={form.role} onChange={handleChange} className="border p-2 w-full">
          <option value="ResponsableIntegration">Responsable Intégration</option>
          <option value="ResponsableEvangelisation">Responsable Évangélisation</option>
          <option value="ResponsableCellule">Responsable Cellule</option>
        </select>
        <button type="submit" disabled={loading} className="bg-green-600 text-white p-2 rounded">
          {loading ? "Création..." : "Créer"}
        </button>
      </form>
      {message && <p className="mt-3">{message}</p>}
    </div>
  );
}
