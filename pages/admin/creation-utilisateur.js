// pages/admin/creation-utilisateur.js
import { useState, useEffect } from "react";
import supabase from "../../lib/supabaseClient";
import { useRouter } from "next/router";

export default function CreationUtilisateur() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [nomComplet, setNomComplet] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [currentUser, setCurrentUser] = useState(null);

  const router = useRouter();

  // Vérification que l'utilisateur est admin
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) return router.push("/");

    supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single()
      .then(({ data }) => {
        if (!data || data.role !== "Admin") router.push("/");
        else setCurrentUser(data);
      });
  }, [router]);

  const handleCreateUser = async () => {
    setLoading(true);
    setMessage({ text: "", type: "" });

    if (!username || !email || !nomComplet || !role || !password) {
      setMessage({ text: "Tous les champs sont obligatoires !", type: "error" });
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, nomComplet, role, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erreur inconnue");

      setMessage({ text: data.message, type: "success" });

      // Réinitialiser le formulaire
      setUsername("");
      setEmail("");
      setNomComplet("");
      setRole("");
      setPassword("");
    } catch (error) {
      setMessage({ text: error.message, type: "error" });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-cyan-400 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-white mb-6">Créer un utilisateur</h1>

      <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Nom complet / Responsable"
            value={nomComplet}
            onChange={(e) => setNomComplet(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border p-2 rounded"
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">-- Choisir un rôle --</option>
            <option value="ResponsableCelluleCpe">Responsable Suivi Membres</option>
            <option value="ResponsableCellule">Responsable Cellule</option>
            <option value="ResponsableEvangelisation">Responsable Evangelisation</option>
            <option value="Admin">Admin</option>
          </select>

          <button
            onClick={handleCreateUser}
            disabled={loading}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Création..." : "Créer l'utilisateur"}
          </button>

          {message.text && (
            <p
              className={`mt-2 ${
                message.type === "error" ? "text-red-600" : "text-green-600"
              }`}
            >
              {message.text}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
