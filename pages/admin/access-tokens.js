// pages/admin/access-tokens.js
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { v4 as uuidv4 } from "uuid";

export default function AccessTokens() {
  const [tokens, setTokens] = useState([]);
  const [newAccessType, setNewAccessType] = useState("add_member");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    const { data, error } = await supabase.from("access_tokens").select("*");
    if (!error) setTokens(data);
  };

  const createToken = async () => {
    const token = uuidv4();

    const { error } = await supabase.from("access_tokens").insert([
      { token, access_type: newAccessType },
    ]);

    if (!error) {
      setTokens((prev) => [...prev, { token, access_type: newAccessType }]);
    }
  };

  const copyLink = (token) => {
    const url = `${window.location.origin}/access?token=${token}`;
    navigator.clipboard.writeText(url);
    setCopied(token);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Gestion des Access Tokens</h1>

      <div className="max-w-md mx-auto mb-6 p-4 bg-white rounded-xl shadow-md space-y-4">
        <select
          value={newAccessType}
          onChange={(e) => setNewAccessType(e.target.value)}
          className="w-full p-2 border rounded-lg"
        >
          <option value="add_member">Ajouter un membre</option>
          <option value="add_evangelise">Ajouter un évangélisé</option>
        </select>

        <button
          onClick={createToken}
          className="w-full py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600"
        >
          Générer un token
        </button>
      </div>

      <div className="max-w-2xl mx-auto grid grid-cols-1 gap-4">
        {tokens.map((t) => (
          <div
            key={t.token}
            className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">Type : {t.access_type}</p>
              <p className="text-sm text-gray-500">Token : {t.token}</p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => copyLink(t.token)}
                className="py-1 px-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                {copied === t.token ? "Copié !" : "Copier le lien"}
              </button>
              <a
                href={`/access?token=${t.token}`}
                target="_blank"
                className="py-1 px-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Accéder
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
