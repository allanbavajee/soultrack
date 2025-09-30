// pages/admin/access-tokens.js
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export default function AccessTokenAdmin() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [accessType, setAccessType] = useState("ajouter_membre");
  const [expiresAt, setExpiresAt] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const { data, error } = await supabase.from("profiles").select("id, username, role");
    if (!error && data) setUsers(data);
  };

  const generateToken = async () => {
    if (!selectedUser) return alert("Veuillez sélectionner un utilisateur");

    const token = uuidv4(); // Token unique
    const expires = expiresAt ? new Date(expiresAt).toISOString() : null;

    const { error } = await supabase.from("access_tokens").insert([
      {
        user_id: selectedUser,
        token,
        access_type: accessType,
        expires_at: expires,
      },
    ]);

    if (error) {
      alert("Erreur lors de la génération du token : " + error.message);
    } else {
      const link = `${window.location.origin}/acces?token=${token}`;
      setGeneratedLink(link);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    alert("Lien copié !");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Génération de tokens d'accès</h1>

      <div className="max-w-md mx-auto space-y-4 bg-white p-6 rounded-xl shadow-md">
        <div>
          <label className="block mb-1 font-semibold">Utilisateur :</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="">-- Sélectionner un utilisateur --</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.username || u.role}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Type d'accès :</label>
          <select
            value={accessType}
            onChange={(e) => setAccessType(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="ajouter_membre">Ajouter Membre</option>
            <option value="ajouter_evangeliser">Ajouter Evangeliser</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 font-semibold">Date d'expiration (optionnelle) :</label>
          <input
            type="date"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
            className="w-full border rounded-lg p-2"
          />
        </div>

        <button
          onClick={generateToken}
          className="w-full py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
        >
          Générer le lien
        </button>

        {generatedLink && (
          <div className="mt-4">
            <p className="break-all">{generatedLink}</p>
            <button
              onClick={copyLink}
              className="mt-2 py-1 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Copier le lien
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
