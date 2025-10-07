// pages/list-members.js
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";   // ✅ chemin corrigé
import SendLinkPopup from "../components/SendLinkPopup"; // ✅ composant à créer

export default function ListMembers() {
  const [members, setMembers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from("membres")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setMembers(data);
  };

  const openPopup = (member) => {
    setSelectedMember(member);
    setShowPopup(true);
  };

  const closePopup = () => {
    setSelectedMember(null);
    setShowPopup(false);
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center p-6"
      style={{ background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)" }}
    >
      <h1 className="text-4xl font-bold text-white mb-6">Liste des membres</h1>

      {/* Tableau */}
      <div className="overflow-x-auto w-full max-w-5xl">
        <table className="table-auto w-full border-collapse border border-white text-center">
          <thead>
            <tr className="bg-white bg-opacity-20 text-gray-800">
              <th className="border px-4 py-2">Nom</th>
              <th className="border px-4 py-2">Prénom</th>
              <th className="border px-4 py-2">Téléphone</th>
              <th className="border px-4 py-2">Email</th>
              <th className="border px-4 py-2">Statut</th>
              <th className="border px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody className="text-gray-800">
            {members.map((membre) => (
              <tr key={membre.id}>
                <td className="border px-4 py-2">{membre.nom}</td>
                <td className="border px-4 py-2">{membre.prenom}</td>
                <td className="border px-4 py-2">{membre.telephone}</td>
                <td className="border px-4 py-2">{membre.email || "—"}</td>
                <td className="border px-4 py-2">{membre.statut}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => openPopup(membre)}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Envoyer lien
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup */}
      {showPopup && selectedMember && (
        <SendLinkPopup member={selectedMember} onClose={closePopup} />
      )}
    </div>
  );
}
