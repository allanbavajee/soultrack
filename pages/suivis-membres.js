// pages/suivis-membres.js
"use client";

import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SuivisMembres() {
  const [suivis, setSuivis] = useState([]);
  const [detailsOpen, setDetailsOpen] = useState({});
  const [selectedStatus, setSelectedStatus] = useState({});
  const [commentaire, setCommentaire] = useState({});
  const [viewList, setViewList] = useState("principale");

  useEffect(() => {
    fetchSuivis();
  }, []);

  const fetchSuivis = async () => {
    try {
      const { data, error } = await supabase
        .from("suivis_membres")
        .select(`
          id,
          statut_suivi,
          commentaire,
          cellule_id,
          how_came,
          membre: membre_id (
            nom,
            prenom,
            statut,
            besoin,
            infos_supplementaires
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setSuivis(data || []);
    } catch (err) {
      console.error("Erreur fetchSuivis:", err.message);
      setSuivis([]);
    }
  };

  const handleStatusUpdate = async (suiviId) => {
    const newStatus = selectedStatus[suiviId];
    const newComment = commentaire[suiviId] || "";

    if (!newStatus) return;

    try {
      await supabase
        .from("suivis_membres")
        .update({ statut_suivi: newStatus, commentaire: newComment })
        .eq("id", suiviId);

      fetchSuivis();
     
