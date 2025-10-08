"use client";
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";

export default function SuivisMembres() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("card"); // card ou table

  useEffect(() => {
    const fetchContacts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("suivis_membres") // ✅ bon nom de table
        .select("*")
        .order("created_at", { ascending: false }); // nouveaux en premier

      if (error) {
        console.error("Erreur chargement suivis_membres:", error.message);
      } else {
        setContacts(data || []);
      }
      setLoading(false);
    };

    fetchContacts();
  }, []);

  if (loading) {
    return <p>Chargement...</p>;
  }

  if (!contacts.length) {
    return <p>Aucun contact trouvé</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Chaque personne compte ❤️</h1>

      {/* Toggle du visuel */}
      <div className="mb-4 text-right text-orange-500 cursor-pointer">
        <span onClick={() => setView(view === "card" ? "table" : "card")}>
          Visuel ({view === "card" ? "Card" : "Table"})
        </span>
      </div>

      {view === "card" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {contacts.map((contact) => (
            <div key={contact.id} className="p-4 border rounded-lg shadow bg-white">
              <p><strong>Prénom :</strong> {contact.prenom}</p>
              <p><strong>Nom :</strong> {contact.nom}</p>
              <p><strong>Téléphone :</strong> {contact.telephone}</p>
              <p><strong>Statut :</strong> {contact.statut}</p>
              <p><strong>Besoin :</strong> {contact.besoin}</p>
              <p><strong>Infos :</strong> {contact.info}</p>
              <p><strong>Comment est-il venu ?</strong> {contact.commentaire}</p>
              <p className="text-green-600"><strong>Cellule :</strong> {contact.cellule}</p>
            </div>
          ))}
        </div>
      ) : (
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border p-2">Prénom</th>
              <th className="border p-2">Nom</th>
              <th className="border p-2">Statut</th>
              <th className="border p-2">Détails</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact.id}>
                <td className="border p-2">{contact.prenom}</td>
                <td className="border p-2">{contact.nom}</td>
                <td className="border p-2">{contact.statut}</td>
                <td className="border p-2">
                  <div className="text-sm leading-tight">
                    <p><strong>Téléphone :</strong> {contact.telephone}</p>
                    <p><strong>Besoin :</strong> {contact.besoin}</p>
                    <p><strong>Infos :</strong> {contact.info}</p>
                    <p><strong>Comment est-il venu ?</strong> {contact.commentaire}</p>
                    <p className="text-green-600"><strong>Cellule :</strong> {contact.cellule}</p>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
