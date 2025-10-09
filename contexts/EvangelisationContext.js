"use client";
import { createContext, useContext, useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

const EvangelisationContext = createContext();

export function EvangelisationProvider({ children }) {
  const [evangelises, setEvangelises] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvangelises();
  }, []);

  const fetchEvangelises = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("membres")
      .select("*")
      .eq("statut", "evangelisé");
    if (!error && data) setEvangelises(data);
    setLoading(false);
  };

  const addEvangelise = (newPerson) => {
    setEvangelises((prev) => [...prev, newPerson]);
  };

  return (
    <EvangelisationContext.Provider
      value={{ evangelises, addEvangelise, fetchEvangelises, loading }}
    >
      {children}
    </EvangelisationContext.Provider>
  );
}

export const useEvangelisation = () => useContext(EvangelisationContext);
