import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function GenerateLink() {
  const [role, setRole] = useState("add_member");
  const [link, setLink] = useState("");

  const generateToken = async () => {
    const token = Math.random().toString(36).substring(2, 10).toUpperCase(); // simple token
    const { data, error } = await supabase
      .from("access_tokens")
      .insert([
        { token, role, created_by: supabase.auth.user()?.id, used: false }
      ]);

    if (!error) {
      setLink(`${window.location.origin}/access?token=${token}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-4">Générer un lien d’accès</h1>
      
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="mb-4 p-2 border rounded-lg"
      >
        <option value="add_member">Ajouter un membre</option>
        <option value="add_evangelise">Ajouter un évangélisé</option>
      </select>

      <button
        onClick={generateToken}
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Générer le lien
      </button>

      {link && (
        <div className="mt-4 p-4 border rounded-lg bg-white w-full max-w-md text-center">
          <p className="break-all">{link}</p>
          <button
            onClick={() => navigator.clipboard.writeText(link)}
            className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Copier le lien
          </button>
        </div>
      )}
    </div>
  );
}
