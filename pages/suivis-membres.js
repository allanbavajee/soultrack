useEffect(() => {
  const fetchSuivis = async () => {
    try {
      const { data, error } = await supabase
        .from("suivis_membres")
        .select(`
          id,
          statut,
          membres: membre_id (*),
          cellules: cellule_id (*)
        `)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setSuivis(data || []);
    } catch (err) {
      console.error("Erreur fetchSuivis:", err.message);
      setSuivis([]);
    }
  };

  fetchSuivis();
}, []);
