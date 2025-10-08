// pages/suivis-membres.js
"use client";
import { useState } from "react";

export default function SuivisMembres() {
  const [view, setView] = useState("card");
  const [detailsOpen, setDetailsOpen] = useState({});
  const [selectedCellules, setSelectedCellules] = useState({});

  // Données fictives pour test
  const suivis = [
    {
      id: "1",
      statut: "visiteur",
      membres: {
        prenom: "Jean",
        nom: "Dupont",
        telephone: "123456789",
        besoin: "Prière",
        infos_supplementaires: "Aime le chant",
        ville: "Paris",
        star: false,
        comment: "Amis",
      },
      cellules: { cellule: "Cellule Test", responsable: "Paul", telephone: "987654321" },
    },
    {
      id: "2",
      statut: "actif",
      membres: {
        prenom: "Marie",
        nom: "Durand",
        telephone: "987654321",
        besoin: "Encouragement",
        infos_supplementaires: "Nouvelle venue",
        ville: "Lyon",
        star: true,
        comment: "Annonce",
      },
      cellules: { cellule: "Cellule Alpha", responsable: "Luc", telephone: "123456789" },
    },
  ];

  const getBorderColor = (statut) => {
    if (statut === "visiteur") return "#34A853";
    if (statut === "actif") return "#4285F4";
    return "#ccc";
  };

  const sendWhatsapp = (cellule, membre) => {
    alert(`Simulé WhatsApp pour ${membre.prenom} ${membre.nom} vers ${cellule.telephone}`);
  };

  // Trier : nouveau en haut
  const nouveaux = suivis.filter((s) => s.statut === "visiteur");
  const anciens = suivis.filter((s) => s.statut !== "visiteur");

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <h1 className="text-3xl mb-4">Suivis Membres - Test</h1>

      <p
        className="self-end text-orange-500 cursor-pointer mb-4"
        onClick={() => setView(view === "card" ? "table" : "card")}
      >
        Visuel
      </p>

      {view === "card" ? (
        <div className="w-full max-w-3xl">
          {[...nouveaux, ...anciens].map((s) => (
            <div
              key={s.id}
              className="bg-white p-4 rounded-xl shadow mb-4 border-t-4"
              style={{ borderTopColor: getBorderColor(s.statut) }}
            >
              <h2 className="font-bold flex justify-between">
                {s.membres.prenom} {s.membres.nom}
                {s.statut === "visiteur" && (
                  <span className="ml-2 text-blue-500 text-sm px-2 py-1 rounded-full bg-blue-100">
                    Nouveau
                  </span>
                )}
              </h2>
              <p>📱 {s.membres.telephone}</p>
              <p>Statut : {s.statut}</p>

              <p
                className="text-blue-500 underline cursor-pointer"
                onClick={() =>
                  setDetailsOpen((prev) => ({ ...prev, [s.id]: !prev[s.id] }))
                }
              >
                {detailsOpen[s.id] ? "Fermer détails" : "Détails"}
              </p>

              {detailsOpen[s.id] && (
                <div className="mt-2 text-sm space-y-1">
                  <p>Besoin : {s.membres.besoin}</p>
                  <p>Infos supplémentaires : {s.membres.infos_supplementaires}</p>
                  <p>Comment est-il venu ? : {s.membres.comment}</p>
                  <p>Cellule : {s.cellules.cellule} ({s.cellules.responsable})</p>

                  <button
                    className="mt-2 py-2 px-4 bg-green-500 text-white rounded"
                    onClick={() => sendWhatsapp(s.cellules, s.membres)}
                  >
                    Envoyer par WhatsApp
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full max-w-3xl overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4">Prénom</th>
                <th className="py-2 px-4">Nom</th>
                <th className="py-2 px-4">Statut</th>
                <th className="py-2 px-4">Détails</th>
              </tr>
            </thead>
            <tbody>
              {[...nouveaux, ...anciens].map((s) => (
                <tr key={s.id} className="border-b">
                  <td className="py-2 px-4">{s.membres.prenom}</td>
                  <td className="py-2 px-4">{s.membres.nom}</td>
                  <td className="py-2 px-4">
                    {s.statut}
                    {s.statut === "visiteur" && (
                      <span className="ml-2 text-blue-500 text-sm px-1 py-0.5 rounded-full bg-blue-100">
                        Nouveau
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    <p
                      className="text-blue-500 underline cursor-pointer"
                      onClick={() =>
                        setDetailsOpen((prev) => ({ ...prev, [s.id]: !prev[s.id] }))
                      }
                    >
                      {detailsOpen[s.id] ? "Fermer détails" : "Détails"}
                    </p>
                    {detailsOpen[s.id] && (
                      <div className="mt-2 text-sm space-y-1">
                        <p>Besoin : {s.membres.besoin}</p>
                        <p>Infos supplémentaires : {s.membres.infos_supplementaires}</p>
                        <p>Comment est-il venu ? : {s.membres.comment}</p>
                        <p>Cellule : {s.cellules.cellule} ({s.cellules.responsable})</p>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
