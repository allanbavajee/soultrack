// pages/list-members.js
"use client";

import { useState, useEffect } from "react";
import supabase from "../../lib/supabaseClient";
import SendLinkPopup from "../../components/SendLinkPopup";

export default function ListMembers() {
  const [members, setMembers] = useState([]);

  // Charger la liste des membres
  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from("membres")
      .select("*")
      .order("id", { ascending: false });

    if (!error) setMembers(data || []);
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // --- Marquer comme envoyé ---
  const markAsSent = async (memberId) => {
    // 1. Récupérer le membre
    const { data: member, error } = await supabase
      .from("membres")
      .select("*")
      .eq("id", memberId)
      .single();

    if (error || !member) return;

    // 2. Ajouter dans suivis_membres
    await supabase.from("suivis_membres").insert([
      {
        membre_id: member.id,
        cellule_id: null, // à remplir si besoin
        statut: "envoye",
      },
    ]);

    // 3. Mettre à jour son statut dans membres
    await supabase
      .from("membres")
      .update({ statut: "envoye" })
      .eq("id", member.id);

    // 4. Rafraîchir
    fetchMembers();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Liste des Membres</h1>
      <div className="grid gap-4">
        {members.map((membre) => (
          <div
            key={membre.id}
            className="p-4 bg-white rounded-2xl shadow flex justify-between items-center"
          >
            <div>
              <p className="font-bold">{membre.nom}</p>
              <p className="text-sm text-gray-500">{membre.telephone}</p>
              <span className="text-xs px-2 py-1 rounded-full bg-gray-200">
                {membre.statut}
              </span>
            </div>
            <div className="flex gap-2">
              <SendLinkPopup
                label="Envoyer sur WhatsApp"
                type="ajouter_membre"
                buttonColor="from-green-400 via-green-500 to-green-600"
              />
              {(membre.statut === "visiteur" ||
                membre.statut === "veut rejoindre ICC") && (
                <button
                  onClick={() => markAsSent(membre.id)}
                  className="px-3 py-2 rounded-xl bg-blue-500 text-white text-sm"
                >
                  Marquer envoyé
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

