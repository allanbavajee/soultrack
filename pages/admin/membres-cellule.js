"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import supabase from "../../lib/supabaseClient";
import Image from "next/image";

export default function MembresCellulePage() {
  const router = useRouter();
  const [membres, setMembres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMembres = async () => {
      try {
        const storedCelluleId = localStorage.getItem("celluleId");

        if (!storedCelluleId) {
          alert("Aucune cellule associée trouvée !");
          router.push("/cellule-hub");
          return;
        }

        const { data, error } = await supabase
          .from("membres")
          .select(
            "id, nom, prenom, telephone, ville, statut, is_whatsapp, bapteme_eau, bapteme_esprit"
          )
          .eq("cellule_id", storedCelluleId)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setMembres(data || []);
      } catch (err) {
        console.error("Erreur :", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembres();
  }, [router]);

  return (
    <div
      className="min-h-screen p-6 flex flex-col items-center"
      style={{
        background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)",
      }}
    >
      <div className="flex items-center justify-between w-full max-w-5xl mb-6">
        <button
          onClick={() => router.back()}
          className="text-white font-semibold hover:text-gray-200 transition"
        >
          ← Retour
        </button>

        <Image src="/logo.png" alt="Logo" width={70} height={70} />
      </div>

      <h1 className="text-3xl font-handwriting text-white mb-8 text-center">
        Membres de la Cellule
      </h1>

      {loading && <p className="text-white">Chargement...</p>}
      {error && <p className="text-red-200">Erreur : {error}</p>}

      {!loading && membres.length === 0 && (
        <p className="text-white text-lg">Aucun membre trouvé pour cette cellule.</p>
      )}

      {!loading && membres.length > 0 && (
        <div className="overflow-x-auto w-full max-w-5xl bg-white rounded-3xl shadow-lg p-4">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gradient-to-r from-[#2E3192] to-[#92EFFD] text-white text-left">
                <th className="p-3 rounded-tl-3xl">Nom</th>
                <th className="p-3">Prénom</th>
                <th className="p-3">Téléphone</th>
                <th className="p-3">Ville</th>
                <th className="p-3">Statut</th>
                <th className="p-3">WhatsApp</th>
                <th className="p-3">Baptême Eau</th>
                <th className="p-3 rounded-tr-3xl">Baptême Esprit</th>
              </tr>
            </thead>
            <tbody>
              {membres.map((membre) => (
                <tr
                  key={membre.id}
                  className="border-b hover:bg-gray-100 transition"
                >
                  <td className="p-3 font-semibold">{membre.nom}</td>
                  <td className="p-3">{membre.prenom || "-"}</td>
                  <td className="p-3">{membre.telephone || "-"}</td>
                  <td className="p-3">{membre.ville || "-"}</td>
                  <td
                    className={`p-3 ${
                      membre.statut === "actif"
                        ? "text-green-600 font-bold"
                        : "text-gray-600"
                    }`}
                  >
                    {membre.statut || "-"}
                  </td>
                  <td className="p-3 text-center">
                    {membre.is_whatsapp ? "✅" : "❌"}
                  </td>
                  <td className="p-3 text-center">
                    {membre.bapteme_eau === "TRUE" ? "💧" : "-"}
                  </td>
                  <td className="p-3 text-center">
                    {membre.bapteme_esprit === "TRUE" ? "🔥" : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-8 text-white text-center font-handwriting-light">
        Car le corps ne se compose pas d’un seul membre, mais de plusieurs. <br />
        1 Corinthiens 12:14 ❤️
      </div>
    </div>
  );
}
