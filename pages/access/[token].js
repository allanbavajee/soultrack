// pages/admin/access-tokens.js
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import SendWhatsappButton from "@/components/SendWhatsappButton";

export default function AccessTokens() {
  const [tokens, setTokens] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [accessType, setAccessType] = useState("ajouter_membre");

  useEffect(() => {
    fetchTokens();
    fetchUsers();
  }, []);

  const fetchTokens = async () => {
    const { data, error } = await supabase
      .from("access_tokens")
      .select("id, user_id, token, access_type, created_at");
    if (!error) setTokens(data);
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, role, username, responsable");
    if (!error) setUsers(data);
  };

  const generateToken = async () => {
    if (!selectedUser) return alert("Veuillez sélectionner un utilisateur");

    const { data, error } = await supabase.rpc("generate_access_token", {
      p_user_id: selectedUser,
      p_access_type: accessType,
    });

    if (error) return alert("Erreur : " + error.message);

    fetchTokens();
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Gestion des Access Tokens</h1>

      {/* Sélection utilisateur */}
      <div className="mb-6 max-w-md">
        <label className="block mb-2 font-semibold">Sélectionner un utilisateur :</label>
        <select
          className="w-full p-2 border rounded-lg"
          value={selectedUser}
          onChange={(e) => setSelectedUser(e.target.value)}
        >
          <option value="">-- Choisir --</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.role} {u.username || ""} {u.responsable ? `(${u.responsable})` : ""}
            </option>
          ))}
        </select>
      </div>

      {/* Type d'accès */}
      <div className="mb-6 max-w-md">
        <label className="block mb-2 font-semibold">Type d'accès :</label>
        <select
          className="w-full p-2 border rounded-lg"
          value={accessType}
          onChange={(e) => setAccessType(e.target.value)}
        >
          <option value="ajouter_membre">Ajouter Membre</option>
          <option value="ajouter_evangelise">Ajouter Évangélisé</option>
        </select>
      </div>

      <button
        className="mb-6 px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
        onClick={generateToken}
      >
        Générer un token
      </button>

      {/* Tableau des tokens */}
      <h2 className="text-2xl font-semibold mb-4">Tokens existants :</h2>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 text-center">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Utilisateur</th>
              <th className="border px-4 py-2">Lien</th>
              <th className="border px-4 py-2">Type</th>
              <th className="border px-4 py-2">Créé le</th>
            </tr>
          </thead>
          <tbody>
            {tokens.map((t) => {
              const user = users.find((u) => u.id === t.user_id);
              return (
                <tr key={t.id}>
                  <td className="border px-4 py-2">
                    {user ? `${user.role} ${user.username || ""}` : "—"}
                  </td>
                  <td className="border px-4 py-2">
                    <SendWhatsappButton token={t.token} />
                  </td>
                  <td className="border px-4 py-2">{t.access_type}</td>
                  <td className="border px-4 py-2">
                    {new Date(t.created_at).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
