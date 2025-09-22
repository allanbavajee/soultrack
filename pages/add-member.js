// pages/add-member.js
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { motion } from "framer-motion";

export default function AddMember() {
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    telephone: "",
    email: "",
    statut: "visiteur",
    how_came: "",
    besoin: "",
    responsable_suivi: "",
  });

  const cellules = [
    "Cellule de Curepipe",
    "Cellule de Bois Rouge",
    "Cellule de Bambous",
    "Cellule de Rose Hill",
    "Cellule de Mon Gout",
    "Eglise",
  ];

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from("membres").insert([form]);
    if (error) {
      alert("❌ Erreur : " + error.message);
    } else {
      alert("✅ Nouveau membre ajouté !");
      setForm({
        nom: "",
        prenom: "",
        telephone: "",
        email: "",
        statut: "visiteur",
        how_came: "",
        besoin: "",
        responsable_suivi: "",
      });
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 p-6">
      
      {/* Blobs flottants */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-pink-400 rounded-full opacity-30 animate-blob"></div>
      <div className="absolute top-20 right-0 w-64 h-64 bg-purple-400 rounded-full opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-orange-400 rounded-full opacity-20 animate-blob animation-delay-4000"></div>

      {/* Header */}
      <motion.div 
        className="z-10 mb-8 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <div className="inline-block bg-white/20 backdrop-blur-md px-6 py-4 rounded-3xl shadow-lg animate-pulse">
          <img
            src="/logo.png"
            alt="Logo ICC"
            className="mx-auto w-24 h-24 rounded-full shadow-lg mb-3 animate-pulse"
          />
          <p className="text-white font-bold text-lg italic drop-shadow-md">
            « Allez, faites de toutes les nations des disciples » – Matthieu 28:19
          </p>
        </div>
      </motion.div>

      {/* Form Card */}
      <motion.div 
        className="relative z-10 w-full max-w-lg bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl p-8 space-y-6 border border-white/20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <h1 className="text-3xl font-extrabold text-center text-purple-800 mb-4">
          ➕ Ajouter un membre
        </h1>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <motion.input
              type="text"
              name="nom"
              placeholder="Nom"
              value={form.nom}
              onChange={handleChange}
              className="p-4 rounded-2xl border-2 border-purple-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 shadow-sm transition duration-300 hover:scale-105"
              whileFocus={{ scale: 1.02 }}
              required
            />
            <motion.input
              type="text"
              name="prenom"
              placeholder="Prénom"
              value={form.prenom}
              onChange={handleChange}
              className="p-4 rounded-2xl border-2 border-purple-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-200 shadow-sm transition duration-300 hover:scale-105"
              whileFocus={{ scale: 1.02 }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <motion.input
              type="text"
              name="telephone"
              placeholder="📞 Téléphone"
              value={form.telephone}
              onChange={handleChange}
              className="p-4 rounded-2xl border-2 border-indigo-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 shadow-sm transition duration-300 hover:scale-105"
            />
            <motion.input
              type="email"
              name="email"
              placeholder="✉️ Email"
              value={form.email}
              onChange={handleChange}
              className="p-4 rounded-2xl border-2 border-indigo-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 shadow-sm transition duration-300 hover:scale-105"
            />
          </div>

          <motion.select
            name="statut"
            value={form.statut}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl border-2 border-green-400 bg-green-50 focus:border-green-500 focus:ring-1 focus:ring-green-200 shadow-sm transition duration-300 hover:scale-105"
            whileFocus={{ scale: 1.02 }}
          >
            <option value="visiteur">👋 Visiteur</option>
            <option value="veut rejoindre ICC">🙏 Veut rejoindre ICC</option>
            <option value="a déjà mon église">⛪ A déjà mon église</option>
          </motion.select>

          <motion.select
            name="how_came"
            value={form.how_came}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl border-2 border-yellow-400 bg-yellow-50 focus:border-yellow-500 focus:ring-1 focus:ring-yellow-200 shadow-sm transition duration-300 hover:scale-105"
            whileFocus={{ scale: 1.02 }}
          >
            <option value="">Comment es-tu venu à l'église ?</option>
            <option value="invite">👤 Invité</option>
            <option value="reseaux">🌐 Réseaux</option>
            <option value="autre">📌 Autre</option>
          </motion.select>

          <motion.textarea
            name="besoin"
            placeholder="📝 Besoin de la personne"
            value={form.besoin}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl border-2 border-pink-400 focus:border-pink-500 focus:ring-1 focus:ring-pink-200 shadow-sm transition duration-300 hover:scale-105"
            whileFocus={{ scale: 1.02 }}
          />

          <motion.select
            name="responsable_suivi"
            value={form.responsable_suivi}
            onChange={handleChange}
            className="w-full p-4 rounded-2xl border-2 border-indigo-300 bg-indigo-50 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 shadow-sm transition duration-300 hover:scale-105"
            whileFocus={{ scale: 1.02 }}
          >
            <option value="">Assignée à</option>
            {cellules.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </motion.select>

          <motion.button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white font-extrabold rounded-3xl shadow-lg hover:scale-105 transition transform duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Ajouter le membre
          </motion.button>
        </form>
      </motion.div>

      <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(20px, -10px) scale(1.1); }
          66% { transform: translate(-15px, 15px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 8s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
