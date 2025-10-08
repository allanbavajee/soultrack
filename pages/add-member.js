// pages/add-member.js
"use client";

import { useState } from "react";
import supabase from "../lib/supabaseClient";
import Image from "next/image";

export default function AddMember() {
  const [prenom, setPrenom] = useState("");
  const [nom, setNom] = useState("");
  const [telephone, setTelephone] = useState("");
  const [email, setEmail] = useState("");
  const [ville, setVille] = useState("");
  const [besoin, setBesoin] = useState("");
  const [infosSup, setInfosSup] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prenom || !nom || !telephone) return alert("Prénom, nom et téléphone sont obligatoires.");

    setSaving(true);
    try {
      // Vérifier si le membre existe déjà
      const { data: existingMember, error: errCheck } = await supabase
        .from("membres")
        .select("*")
        .eq("telephone", telephone.trim())
        .single();

      if (errCheck && errCheck.code !== "PGRST116") throw errCheck;

      if (existingMember) {
        alert("Ce membre existe déjà !");
        setSaving(false);
        return;
      }

      // Ajouter le nouveau membre
      const { error: insertError } = await supabase.from("membres").insert([
        {
          prenom,
          nom,
          telephone,
          email,
          ville,
          besoin,
          infos_supplementaires: infosSup,
          statut: "visiteur",
          created_at: new Date(),
        },
      ]);

      if (insertError) throw insertError;

      alert("Membre ajouté avec succès !");
      setPrenom(""); setNom(""); setTelephone(""); setEmail(""); setVille(""); setBesoin(""); setInfosSup("");
    } catch (err) {
      console.error("Erreur ajout membre:", err);
      alert("Erreur lors de l'ajout du membre.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center p-6" style={{ background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)" }}>
      <button onClick={() => window.history.back()} className="self-start mb-4 flex items-center text-white font-semibold hover:text-gray-200">
        ← Retour
      </button>

      <div className="mt-2 mb-2">
        <Image src="/logo.png" alt="SoulTrack Logo" width={80} height={80} />
      </div>

      <h1 className="text-5xl sm:text-6xl font-handwriting text-white text-center mb-3">Ajouter un membre</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col gap-4">
        <input type="text" placeholder="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} className="p-3 rounded-xl border focus:outline-none"/>
        <input type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} className="p-3 rounded-xl border focus:outline-none"/>
        <input type="tel" placeholder="Téléphone" value={telephone} onChange={(e) => setTelephone(e.target.value)} className="p-3 rounded-xl border focus:outline-none"/>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="p-3 rounded-xl border focus:outline-none"/>
        <input type="text" placeholder="Ville" value={ville} onChange={(e) => setVille(e.target.value)} className="p-3 rounded-xl border focus:outline-none"/>
        <input type="text" placeholder="Besoin" value={besoin} onChange={(e) => setBesoin(e.target.value)} className="p-3 rounded-xl border focus:outline-none"/>
        <textarea placeholder="Infos supplémentaires" value={infosSup} onChange={(e) => setInfosSup(e.target.value)} className="p-3 rounded-xl border focus:outline-none"/>
        <button type="submit" disabled={saving} className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-2xl transition-all duration-200">
          {saving ? "Enregistrement..." : "Ajouter le membre"}
        </button>
      </form>
    </div>
  );
}
