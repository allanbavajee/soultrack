// pages/evangelisation.js
"use client";
import { useRouter } from "next/router";
import { useEvangelisation } from "../contexts/EvangelisationContext";
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function Evangelisation() {
  const router = useRouter();
  const { evangelises, loading } = useEvangelisation();
  const [cellules, setCellules] = useState([]);
  const [selectedCellule, setSelectedCellule] = useState(null);
  const [selectedContacts, setSelectedContacts] = useState({});
  const [detailsOpen, setDetailsOpen] = useState({});

  useEffect(() => {
    fetchCellules();
  }, []);

  const fetchCellules = async () => {
    const { data, error } = await supabase
      .from("cellules")
      .select("id, cellule, responsable, telephone");
    if (!error && data) setCellules(data);
  };

  if (loading)
    return <div className="text-center mt-10 text-gray-500">Chargement...</div>;

  // le reste de ton code est identique (checkbox, WhatsApp, affichage cartes)
  // ✅ inutile de refaire fetchEvangelises ici
}


