// pages/admin/access-tokens.js
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

// Fonction pour générer un UUID sans package externe
function generateUUID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function AccessTokens() {
  const [users, setUsers] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
    fetchTokens();
  }, []);

  // Récupérer tous les users pour générer des tokens
  const fetchUsers = async () => {
    const { data, error } = await supabase.from("profiles").select("id, username, role");
    if (!error) setUsers(data);
  };

  // Récupérer tous les tokens existants
  const fetchTokens = async () => {
    const { data, error } = await supabase
      .from("access_tokens")
      .select("id, user_id, token, access_type");
    if (!error) setTokens(data);
  };

  // Générer un token pour un user
  const handleGenerateToken = async (userId, accessType) => {
    setLoading(true);
    const token = generateUUID();

    const { data, error } = await supabase.from("access_tokens").insert([
      {
        user_id: userId,
        token,
        access_type: accessType,
      },
    ]);

    if (!error) {
      fetchTokens();
    } else {
      alert("Erreur : " + error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Gestion des Access Tokens</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white p-4 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-lg font-bold mb-2">{user.username || user.id}</h2>
            <p className="mb-2">Role : {user.role}</p>

            <button
              disabled={loading}
              onClick={() => handleGenerateToken(user.id, user.role)}
              className="w-full py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
            >
              Générer un token
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4">Tokens existants</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 text-center">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Utilisateur</th>
              <th className="border px-4 py-2">Token</th>
              <th className="border px-4 py-2">Type d'accès</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((t) => {
              const user = users.find((u) => u.id === t.user_id);
              return (
                <tr key={t.id}>
                  <td className="border px-4 py-2">{user?.username || t.user_id}</td>
                  <td className="border px-4 py-2">{t.token}</td>
                  <td className="border px-4 py-2">{t.access_type}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
