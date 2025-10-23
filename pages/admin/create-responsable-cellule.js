//*pages/admin/create-responsable-cellule.js - Creer une Celule
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import supabase from "../../lib/supabaseClient";

export default function CreateResponsableCellule() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]); // Profils avec rôle ResponsableCellule
  const [fallbackResponsables, setFallbackResponsables] = useState([]); // noms présents dans cellules.responsable
  const [form, setForm] = useState({
    cellule: "",
    ville: "",
    telephone: "",
    responsable_id: "", // id du profil responsable
    responsable_nom_libre: "", // nom libre si aucun id
  });
  const [message, setMessage] = useState("");

  // 🔁 Fonction pour charger les profils responsables
  const fetchProfiles = async () => {
    try {
      // Récupère les profils avec rôle ResponsableCellule
      const { data: profs, error: profError } = await supabase
        .from("profiles")
        .select("id, prenom, nom, roles, role")
        .or("role.eq.ResponsableCellule,roles.cs.{ResponsableCellule}");

      if (profError) throw profError;

      if (profs && profs.length > 0) {
        const mapped = profs.map((p) => ({
          id: p.id,
          displayName: `${p.prenom || ""} ${p.nom || ""}`.trim() || p.id,
        }));
        setProfiles(mapped);
      } else {
        // fallback : noms déjà enregistrés dans "cellules.responsable"
        const { data: fallback, error: fallbackError } = await supabase
          .from("cellules")
          .select("responsable")
          .neq("responsable", null)
          .limit(100);
        if (!fallbackError && fallback) {
          const uniques = Array.from(new Set(fallback.map((r) => r.responsable))).filter(Boolean);
          setFallbackResponsables(uniques);
        }
      }
    } catch (err) {
      console.error("Erreur fetchProfiles:", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔁 Charger les profils au montage
  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.cellule || !form.ville) {
      setMessage("⚠️ Complète au moins le nom de la cellule et la ville.");
      return;
    }

    const responsableId = form.responsable_id || null;
    const responsableNom = form.responsable_id ? null : form.responsable_nom_libre || null;

    try {
      const insertPayload = {
        cellule: form.cellule,
        ville: form.ville,
        telephone: form.telephone || "N/A",
        created_at: new Date().toISOString(),
      };

      if (responsableId) {
        insertPayload.responsable_id = responsableId;
        const chosen = profiles.find((p) => p.id === responsableId);
        insertPayload.responsable = chosen ? chosen.displayName : null;
      } else if (responsableNom) {
        insertPayload.responsable = responsableNom;
      }

      const { error } = await supabase.from("cellules").insert([insertPayload]);
      if (error) throw error;

      setMessage("✅ Cellule créée avec succès !");
      setForm({
        cellule: "",
        ville: "",
        telephone: "",
        responsable_id: "",
        responsable_nom_libre: "",
      });

      // 🔁 Recharge la liste des responsables pour inclure le nouveau
      await fetchProfiles();
    } catch (err) {
      console.error("Erreur création cellule :", err);
      setMessage("❌ Erreur lors de la création : " + (err.message || err));
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)",
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-[#2E3192]">
          Créer une cellule
        </h2>

        <label className="block mb-3">
          <span className="text-sm font-medium">Nom de la cellule</span>
          <input
            name="cellule"
            value={form.cellule}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded"
          />
        </label>

        <label className="block mb-3">
          <span className="text-sm font-medium">Ville</span>
          <input
            name="ville"
            value={form.ville}
            onChange={handleChange}
            required
            className="w-full mt-1 p-2 border rounded"
          />
        </label>

        <label className="block mb-4">
          <span className="text-sm font-medium">Téléphone</span>
          <input
            name="telephone"
            value={form.telephone}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded"
          />
        </label>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Nom du responsable
          </label>

          {/* ✅ Select principal : profils */}
          {profiles.length > 0 ? (
            <select
              name="responsable_id"
              value={form.responsable_id}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">-- Choisir un responsable (profil) --</option>
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.displayName}
                </option>
              ))}
            </select>
          ) : null}

          {/* Fallback : anciens noms de responsables */}
          {fallbackResponsables.length > 0 && (
            <select
              name="responsable_nom_libre"
              value={form.responsable_nom_libre}
              onChange={handleChange}
              className="w-full mt-2 p-2 border rounded"
            >
              <option value="">-- Choisir un responsable (texte) --</option>
              {fallbackResponsables.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          )}

          {/* Option manuelle */}
          <input
            name="responsable_nom_libre"
            value={form.responsable_nom_libre}
            onChange={handleChange}
            placeholder="Ou écris un nom de responsable..."
            className="w-full mt-2 p-2 border rounded"
          />

          <small className="text-gray-500 block mt-1">
            Si vous sélectionnez un profil, la cellule sera liée à son{" "}
            <code>responsable_id</code>.
          </small>
        </div>

        {message && (
          <p
            className={`mb-3 text-sm ${
              message.includes("✅") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
          >
            Créer
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-gray-200 py-2 rounded hover:bg-gray-300 transition"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
