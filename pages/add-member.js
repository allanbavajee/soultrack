// pages/add-member.js
import { useState } from "react";
import { useRouter } from "next/router";
import { supabase } from "../lib/supabaseClient";

export default function AddMember() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    email: "",
    besoin: "",
    commentaire: "",
    responsable: "",
    statut: "visiteur",
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const { error } = await supabase.from("membres").insert([formData]);
      if (error) throw error;
      router.push("/members");
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Ajouter un nouveau membre</h1>

      {errorMsg && (
        <p className="bg-red-100 text-red-700 px-3 py-2 rounded mb-3">
          {errorMsg}
        </p>
      )}

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-4 bg-white p-6 rounded-xl shadow"
      >
        <input
          type="text"
          name="first_name"
          placeholder="Prénom"
          value={formData.first_name}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="last_name"
          placeholder="Nom"
          value={formData.last_name}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="phone"
          placeholder="Téléphone"
          value={formData.phone}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="besoin"
          placeholder="Besoin"
          value={formData.besoin}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <textarea
          name="commentaire"
          placeholder="Commentaire"
          value={formData.commentaire}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <input
          type="text"
          name="responsable"
          placeholder="Responsable"
          value={formData.responsable}
          onChange={handleChange}
          className="border p-2 rounded"
        />

        <select
          name="statut"
          value={formData.statut}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="visiteur">Visiteur</option>
          <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
          <option value="a déjà mon église">A déjà mon église</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Enregistrement..." : "Ajouter"}
        </button>
      </form>
    </div>
  );
}
