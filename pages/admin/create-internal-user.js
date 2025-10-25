"use client";
import { useState } from "react";

export default function CreateInternalUser() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      console.log("🚀 Envoi vers API :", { email, password, role });

      const response = await fetch("/api/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, role }),
      });

      console.log("📥 Réponse brute :", response);

      // ✅ On vérifie si la réponse est vide ou non
      const text = await response.text();
      console.log("📦 Contenu brut reçu :", text);

      let data;
      try {
        data = JSON.parse(text || "{}");
      } catch (err) {
        console.warn("⚠️ Impossible de parser la réponse JSON :", err);
        setMessage("❌ Réponse invalide du serveur.");
        return;
      }

      if (!response.ok) {
        throw new Error(data.error || "Erreur inconnue du serveur.");
      }

      console.log("✅ Réponse API :", data);
      setMessage(`✅ Utilisateur créé avec succès : ${data.user.email}`);

      // 🧹 Réinitialiser les champs
      setEmail("");
      setPassword("");
      setRole("Admin");
    } catch (error) {
      console.error("❌ Erreur création utilisateur :", error);
      setMessage(error.message || "❌ Erreur inattendue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-bold mb-4">Créer un utilisateur interne</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="Admin">Admin</option>
          <option value="Responsable">Responsable</option>
          <option value="Membre">Membre</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? "Création en cours..." : "Créer l’utilisateur"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-sm font-medium">{message}</p>
      )}
    </div>
  );
}
