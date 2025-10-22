import supabase from "../../lib/supabaseClient";
import { useEffect, useState } from "react";

export default function MembresCellule() {
  const [membres, setMembres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembres = async () => {
      setLoading(true);

      // 🔹 Étape 1 : récupérer les membres qui ont un cellule_id
      const { data, error } = await supabase
        .from("membres")
        .select("*") // on prend tout pour vérifier
        .not("cellule_id", "is", null);

      if (error) {
        console.error("Erreur Supabase :", error);
      } else {
        console.log("Membres avec cellule_id :", data);
        setMembres(data);
      }

      setLoading(false);
    };

    fetchMembres();
  }, []);

  if (loading) return <p>Chargement...</p>;
  if (membres.length === 0)
    return <p>Aucun membre assigné à une cellule.</p>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Membres avec cellule_id</h2>
      <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden">
        <thead className="bg-indigo-600 text-white">
          <tr>
            <th className="py-2 px-4 text-left">Nom</th>
            <th className="py-2 px-4 text-left">Prénom</th>
            <th className="py-2 px-4 text-left">Téléphone</th>
            <th className="py-2 px-4 text-left">Cellule ID</th>
          </tr>
        </thead>
        <tbody>
          {membres.map((m) => (
            <tr key={m.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{m.nom}</td>
              <td className="py-2 px-4">{m.prenom}</td>
              <td className="py-2 px-4">{m.telephone}</td>
              <td className="py-2 px-4">{m.cellule_id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
