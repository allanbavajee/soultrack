import supabase from "../../lib/supabaseClient";
import { useEffect, useState } from "react";

export default function MembresCellule() {
  const [membres, setMembres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembres = async () => {
      setLoading(true);

      // ✅ Jointure entre "membres" et "cellules"
      const { data, error } = await supabase
        .from("membres")
        .select(`
          id,
          nom,
          prenom,
          telephone,
          cellule_id,
          cellules (nom)
        `)
        .not("cellule_id", "is", null); // Afficher uniquement les membres avec une cellule

      if (error) {
        console.error("Erreur lors du chargement des membres :", error);
      } else {
        setMembres(data);
      }

      setLoading(false);
    };

    fetchMembres();
  }, []);

  if (loading) return <p>Chargement...</p>;

  if (membres.length === 0) {
    return <p>Aucun membre assigné à une cellule.</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Membres assignés à une cellule</h2>
      <table className="min-w-full bg-white rounded-xl shadow-md overflow-hidden">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="py-2 px-4 text-left">Nom</th>
            <th className="py-2 px-4 text-left">Prénom</th>
            <th className="py-2 px-4 text-left">Téléphone</th>
            <th className="py-2 px-4 text-left">Cellule</th>
          </tr>
        </thead>
        <tbody>
          {membres.map((m) => (
            <tr key={m.id} className="border-b hover:bg-gray-50">
              <td className="py-2 px-4">{m.nom}</td>
              <td className="py-2 px-4">{m.prenom}</td>
              <td className="py-2 px-4">{m.telephone}</td>
              <td className="py-2 px-4">{m.cellules?.nom || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
