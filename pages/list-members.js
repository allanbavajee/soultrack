"use client";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Image from "next/image";

export default function ListMembers() {
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState("");
  const [detailsOpen, setDetailsOpen] = useState({});
  const [cellules, setCellules] = useState([]);
  const [selectedCellules, setSelectedCellules] = useState({});

  useEffect(() => { fetchMembers(); fetchCellules(); }, []);

  const fetchMembers = async () => {
    const { data, error } = await supabase.from("membres").select("*").order("created_at",{ascending:false});
    if (!error && data) setMembers(data);
  };

  const fetchCellules = async () => {
    const { data, error } = await supabase.from("cellules").select("id, cellule, responsable, telephone");
    if (!error && data) setCellules(data);
  };

  const handleChangeStatus = async (id, newStatus) => {
    await supabase.from("membres").update({ statut: newStatus }).eq("id", id);
    setMembers(prev => prev.map(m => m.id === id ? {...m, statut:newStatus} : m));
  };

  const filteredMembers = members.filter(m => !filter || (filter==="star"? m.star===true : m.statut===filter));
  const countFiltered = filteredMembers.length;

  const getBorderColor = (member) => {
    if(member.star) return "#FBC02D";
    if(member.statut==="actif") return "#4285F4";
    if(member.statut==="a déjà mon église") return "#EA4335";
    if(member.statut==="ancien") return "#999999";
    if(member.statut==="veut rejoindre ICC" || member.statut==="visiteur") return "#34A853";
  };

  const scrollToTop = () => window.scrollTo({top:0, behavior:"smooth"});

  return (
    <div className="min-h-screen flex flex-col items-center p-6" style={{background:"linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)"}}>
      <button onClick={()=>window.history.back()} className="self-start mb-4 flex items-center text-white font-semibold hover:text-gray-200">← Retour</button>
      <div className="mt-2 mb-2"><Image src="/logo.png" alt="SoulTrack Logo" width={80} height={80}/></div>
      <h1 className="text-5xl sm:text-6xl font-handwriting text-white text-center mb-3">SoulTrack</h1>
      <p className="text-center text-white text-lg mb-6 font-handwriting-light">Chaque personne a une valeur infinie...</p>

      <div className="flex flex-col md:flex-row items-center gap-4 mb-4 w-full max-w-md">
        <select value={filter} onChange={e=>setFilter(e.target.value)} className="border rounded-lg px-4 py-2 text-gray-700 shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-400">
          <option value="">-- Filtrer par statut --</option>
          <option value="actif">Actif</option>
          <option value="ancien">Ancien</option>
          <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
          <option value="visiteur">Visiteur</option>
          <option value="a déjà mon église">A déjà mon église</option>
          <option value="star">⭐ Star</option>
        </select>
        <span className="text-white italic text-opacity-80">Résultats: {countFiltered}</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        {filteredMembers.map(member=>(
          <div key={member.id} className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between" style={{borderTop:`4px solid ${getBorderColor(member)}`}}>
            <h2 className="text-lg font-bold text-gray-800 mb-1">{member.prenom} {member.nom} {member.star && <span className="ml-1 text-yellow-400">⭐</span>}</h2>
            <p className="text-sm text-gray-600 mb-1">📱 {member.telephone||"—"}</p>
            <p className="text-sm font-semibold" style={{color:getBorderColor(member)}}>{member.statut||"—"}</p>
          </div>
        ))}
      </div>

      <button onClick={scrollToTop} className="fixed bottom-5 right-5 text-white text-2xl font-bold">↑</button>
    </div>
  );
}
