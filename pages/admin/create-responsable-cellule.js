"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import supabase from "../../lib/supabaseClient";

export default function CreateResponsableCellule() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState([]); // profils avec rôle ResponsableCellule
  const [fallbackResponsables, setFallbackResponsables] = useState([]); // noms présents dans cellules.responsable
  const [form, setForm] = useState({
    cellule: "",
    ville: "",
    telephone: "",
    responsable_id: "", // id du profil responsable (préféré)
    responsable_nom_libre: "", // si on choisit un nom libre (fallback)
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        // 1) tenter de récupérer les profils ayant le rôle "ResponsableCellule"
        // On suppose que tu stockes les rôles dans profiles.roles (text[])
        const { data: profs, error: profError } = await supabase
          .from("profiles")
          .select("id, prenom, nom, roles, role")
          .ilike("roles::text", "%responsablecellule%"); // fallback, tolérant à la casse

        // si la requête avec ilike ne renvoie rien (selon ton format de roles),
        // on essaye une autre requête qui vérifie 'role' texte exact
        let effectiveProfiles = profs || [];
        if ((!effectiveProfiles || effectiveProfiles.length === 0) && !profError) {
          const { data: profs2 } = await supabase
            .from("profiles")
            .select("id, prenom, nom, roles, role")
            .eq("role", "ResponsableCellule");
          effectiveProfiles = profs2 || [];
        }

        if (effectiveProfiles && effectiveProfiles.length > 0) {
          // normalise noms complets
          const mapped = effectiveProfiles.map((p) => ({
            id: p.id,
            displayName: `${p.prenom || ""} ${p.nom || ""}`.trim() || p.email || p.id,
          }));
          setProfiles(mapped);
        } else {
          // 2) fallback : récupérer la liste distincte des responsables déjà enregistrés dans cellules.responsable
          const { data: fallback, error: fallbackError } = await supabase
            .from("cellules")
            .select("responsable")
            .neq("responsable", null)
            .limit(100); // on récupère jusqu'à 100 valeurs existantes
          if (!fallbackError && fallback) {
            // dé-duplication
            const uniques = Array.from(new Set(fallback.map((r) => r.responsable))).filter(Boolean);
            setFallbackResponsables(uniques);
          }
        }
      } catch (err) {
        console.error("Erreur init create-responsable-cellule :", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    // Validation minimale
    if (!form.cellule || !form.ville) {
      setMessage("Complète au moins le nom de la cellule et la ville.");
      return;
    }
    // Si on a un responsable sélectionné par id, on l'utilise. Sinon on prendra le nom libre.
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
        // on peut aussi remplir le champ 'responsable' lisible en récupérant le displayName
        const chosen = profiles.find((p) => p.id === responsableId);
        insertPayload.responsable = chosen ? chosen.displayName : null;
      } else if (responsableNom) {
        insertPayload.responsable = responsableNom;
      }

      const { data, error } = await supabase.from("cellules").insert([insertPayload]).select().single();
      if (error) throw error;
      setMessage("✅ Cellule créée avec succès.");
      // reset
      setForm({
        cellule: "",
        ville: "",
        telephone: "",
        responsable_id: "",
        responsable_nom_libre: "",
      });
      // redirect si tu veux
      // router.push("/administrateur");
    } catch (err) {
      console.error("Erreur création cellule :", err);
      setMessage("❌ Erreur lors de la création : " + (err.message || err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)" }}>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-md w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4">Créer une cellule</h2>

        <label className="block mb-2">
          <span className="text-sm font-medium">Nom de la cellule</span>
          <input name="cellule" value={form.cellule} onChange={handleChange} required className="w-full mt-1 p-2 border rounded" />
        </label>

        <label className="block mb-2">
          <span className="text-sm font-medium">Ville</span>
          <input name="ville" value={form.ville} onChange={handleChange} required className="w-full mt-1 p-2 border rounded" />
        </label>

        <label className="block mb-4">
          <span className="text-sm font-medium">Téléphone</span>
          <input name="telephone" value={form.telephone} onChange={handleChange} className="w-full mt-1 p-2 border rounded" />
        </label>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Nom du responsable</label>

          {/* Si on a des profils, on montre un select d'ids */}
          {profiles.length > 0 ? (
            <select name="responsable_id" value={form.responsable_id} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">-- Choisir un responsable (profil) --</option>
              {profiles.map((p) => (
                <option key={p.id} value={p.id}>{p.displayName}</option>
              ))}
            </select>
          ) : null}

          {/* fallback : si on a des noms libres depuis cellules */}
          {fallbackResponsables.length > 0 && (
            <select name="responsable_nom_libre" value={form.responsable_nom_libre} onChange={handleChange} className="w-full mt-2 p-2 border rounded">
              <option value="">-- Choisir un responsable (texte) --</option>
              {fallbackResponsables.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          )}

          {/* toujours permettre d'entrer un nom libre */}
          <input
            name="responsable_nom_libre"
            value={form.responsable_nom_libre}
            onChange={handleChange}
            placeholder="Ou cherche/écris un nom de responsable..."
            className="w-full mt-2 p-2 border rounded"
          />

          <small className="text-gray-500 block mt-1">
            Si vous sélectionnez un profil, la cellule sera liée à son <code>responsable_id</code>.
          </small>
        </div>

        {message && <p className="mb-3 text-sm">{message}</p>}

        <div className="flex gap-3">
          <button type="submit" className="flex-1 bg-green-600 text-white py-2 rounded">Créer</button>
          <button type="button" onClick={() => router.back()} className="flex-1 bg-gray-200 py-2 rounded">Annuler</button>
        </div>
      </form>
    </div>
  );
}
