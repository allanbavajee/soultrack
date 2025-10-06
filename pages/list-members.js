// pages/list-members.js
import { useEffect, useState } from "react";
import supabase from "../lib/supabaseClient";
import Image from "next/image";

export default function ListMembers() {
  const [members, setMembers] = useState([]);
  const [filter, setFilter] = useState("");
  const [detailsOpen, setDetailsOpen] = useState({});
  const [cellules, setCellules] = useState([]);
  const [selectedCellules, setSelectedCellules] = useState({});
  const [selectedEvangelises, setSelectedEvangelises] = useState({});

  useEffect(() => {
    fetchMembers();
    fetchCellules();
  }, []);

  const fetchMembers = async () => {
    const { data, error } = await supabase
      .from("membres")
      .select("*")
      .order("created_at", { ascending: false });
    if (!error && data) setMembers(data);
  };

  const fetchCellules = async () => {
    const { data, error } = await supabase
      .from("cellules")
      .select("id, cellule, responsable, telephone");
    if (!error && data) setCellules(data);
  };

  const handleChangeStatus = async (id, newStatus) => {
    await supabase.from("membres").update({ statut: newStatus }).eq("id", id);
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, statut: newStatus } : m))
    );
  };

  const filteredMembers = members.filter((m) => {
    if (!filter) return true;
    if (filter === "star") return m.star === true;
    return m.statut === filter;
  });

  const countFiltered = filteredMembers.length;

  const getBorderColor = (member) => {
    if (member.star) return "#FBC02D";
    if (member.statut === "actif") return "#4285F4";
    if (member.statut === "a déjà mon église") return "#EA4335";
    if (member.statut === "ancien") return "#999999";
    if (member.statut === "veut rejoindre ICC" || member.statut === "visiteur")
      return "#34A853";
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  // Séparer les nouveaux et les anciens
  const nouveaux = filteredMembers.filter(
    (m) => m.statut === "visiteur" || m.statut === "veut rejoindre ICC"
  );
  const anciens = filteredMembers.filter(
    (m) => m.statut !== "visiteur" && m.statut !== "veut rejoindre ICC"
  );

  return (
    <div
      className="min-h-screen flex flex-col items-center p-6"
      style={{ background: "linear-gradient(135deg, #2E3192 0%, #92EFFD 100%)" }}
    >
      {/* Retour */}
      <button
        onClick={() => window.history.back()}
        className="self-start mb-4 flex items-center text-white font-semibold hover:text-gray-200"
      >
        ← Retour
      </button>

      {/* Logo */}
      <div className="mt-2 mb-2">
        <Image src="/logo.png" alt="SoulTrack Logo" width={80} height={80} />
      </div>

      {/* Titre */}
      <h1 className="text-5xl sm:text-6xl font-handwriting text-white text-center mb-3">
        SoulTrack
      </h1>

      {/* Message inspirant */}
      <p className="text-center text-white text-lg mb-6 font-handwriting-light">
        Chaque personne a une valeur infinie. Ensemble, nous avançons, grandissons et partageons
        l’amour de Christ dans chaque action ❤️
      </p>

      {/* Filtres + compte */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-4 w-full max-w-md">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-4 py-2 text-gray-700 shadow-sm w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
        >
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

      {/* Liste des membres */}
      <div className="w-full max-w-5xl">
        {/* Nouveaux membres */}
        {nouveaux.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-2">
            {nouveaux.map((member) => (
              <div key={member.id}>
                <div
                  className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
                  style={{ borderTop: 4px solid ${getBorderColor(member)} }}
                >
                  <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-1 flex items-center justify-between">
                      <span>
                        {member.prenom} {member.nom}
                        <span className="ml-1 text-green-500 font-semibold text-sm">Nouveau</span>
                        {member.star && <span className="ml-1 text-yellow-400">⭐</span>}
                      </span>
                      <select
                        value={member.statut}
                        onChange={(e) => handleChangeStatus(member.id, e.target.value)}
                        className="border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
                      >
                        <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
                        <option value="visiteur">Visiteur</option>
                        <option value="a déjà mon église">A déjà mon église</option>
                        <option value="evangelisé">Evangelisé</option>
                        <option value="actif">Actif</option>
                        <option value="ancien">Ancien</option>
                      </select>
                    </h2>
                    <p className="text-sm text-gray-600 mb-1">📱 {member.telephone || "—"}</p>
                    <p className="text-sm font-semibold" style={{ color: getBorderColor(member) }}>
                      {member.statut || "—"}
                    </p>
                  </div>

                  <p
                    className="mt-2 text-blue-500 underline cursor-pointer"
                    onClick={() =>
                      setDetailsOpen((prev) => ({ ...prev, [member.id]: !prev[member.id] }))
                    }
                  >
                    {detailsOpen[member.id] ? "Fermer détails" : "Détails"}
                  </p>

                  {detailsOpen[member.id] && (
                    <div className="mt-2 text-sm text-gray-700 space-y-2">
                      {/* Détails et bouton WhatsApp */}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Ligne de séparation */}
        {nouveaux.length > 0 && <hr className="border-white border-t w-full my-4" />}

        {/* Anciens membres */}
        {anciens.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {anciens.map((member) => (
              <div key={member.id}>
                <div
                  className="bg-white p-4 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between"
                  style={{ borderTop: 4px solid ${getBorderColor(member)} }}
                >
                  <div>
                    <h2 className="text-lg font-bold text-gray-800 mb-1 flex items-center justify-between">
                      <span>
                        {member.prenom} {member.nom}
                        {member.star && <span className="ml-1 text-yellow-400">⭐</span>}
                      </span>
                      <select
                        value={member.statut}
                        onChange={(e) => handleChangeStatus(member.id, e.target.value)}
                        className="border rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-400"
                      >
                        <option value="veut rejoindre ICC">Veut rejoindre ICC</option>
                        <option value="visiteur">Visiteur</option>
                        <option value="a déjà mon église">A déjà mon église</option>
                        <option value="evangelisé">Evangelisé</option>
                        <option value="actif">Actif</option>
                        <option value="ancien">Ancien</option>
                      </select>
                    </h2>
                    <p className="text-sm text-gray-600 mb-1">📱 {member.telephone || "—"}</p>
                    <p className="text-sm font-semibold" style={{ color: getBorderColor(member) }}>
                      {member.statut || "—"}
                    </p>
                  </div>

                  <p
                    className="mt-2 text-blue-500 underline cursor-pointer"
                    onClick={() =>
                      setDetailsOpen((prev) => ({ ...prev, [member.id]: !prev[member.id] }))
                    }
                  >
                    {detailsOpen[member.id] ? "Fermer détails" : "Détails"}
                  </p>

                  {detailsOpen[member.id] && (
                    <div className="mt-2 text-sm text-gray-700 space-y-2">
                      {/* Détails et bouton WhatsApp */}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Flèche pour remonter en haut */}
      <button
        onClick={scrollToTop}
        className="fixed bottom-5 right-5 text-white text-2xl font-bold bg-transparent hover:text-gray-200"
      >
        ↑
      </button>

      {/* Message final */}
      <p className="mt-6 mb-4 text-center text-white text-lg font-handwriting-light">
        Car le corps ne se compose pas d’un seul membre, mais de plusieurs. 1 Corinthiens 12:14 ❤️
      </p>
    </div>
  );
}
ChatGPT said:
Parfait 👍 tu m’as montré ta page list-members.js.

J’ai remarqué que dans tes Détails, tu as laissé le bloc vide :

{detailsOpen[member.id] && (
  <div className="mt-2 text-sm text-gray-700 space-y-2">
    {/* Détails et bouton WhatsApp */}
  </div>
)}
👉 C’est pour ça que rien ne s’affiche quand on clique sur “Détails”.

Je peux t’aider à compléter ça avec :

Infos supplémentaires du membre (email, date d’ajout, cellule, etc. si tu les as dans ta table).

Un bouton WhatsApp direct (si telephone existe, il ouvrira WhatsApp avec un message).

Par exemple :

{detailsOpen[member.id] && (
  <div className="mt-2 text-sm text-gray-700 space-y-2">
    <p>📧 Email : {member.email || "—"}</p>
    <p>📅 Ajouté le : {new Date(member.created_at).toLocaleDateString()}</p>
    <p>📍 Cellule : {member.cellule || "Non assigné"}</p>

    {member.telephone && (
      <a
        href={`https://wa.me/${member.telephone.replace(/\D/g, "")}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-3 py-1 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition"
      >
        💬 Contacter sur WhatsApp
      </a>
    )}
  </div>
)}
✅ Résultat :

Quand tu cliques sur Détails, ça montre l’email, la date, la cellule, et un bouton WhatsApp si le numéro existe.

Le bouton ouvre WhatsApp (web ou app) directement.

Veux-tu que je t’intègre ça dans tes deux blocs (nouveaux + anciens) et je t’envoie la page complète prête à coller ?

You said:
OUi,
et quand je click sur details ,qu'es ce qui va s'afficher?
ChatGPT said:
Bonne question 👌

Quand tu cliqueras sur “Détails”, tu verras s’afficher un petit panneau sous la carte du membre avec par exemple :

Exemple pour un membre visiteur :
Carte avant d’ouvrir :

Jean Dupont
📱 57481234
Statut : Visiteur
[Détails]
Carte après clic sur “Détails” :

Jean Dupont
📱 57481234
Statut : Visiteur
[Fermer détails]

📧 Email : jean.dupont@mail.com
📅 Ajouté le : 05/10/2025
📍 Cellule : CPE Groupe 2

💬 Contacter sur WhatsApp
Ce qui s’affiche dans la section détails :
Email (si présent dans ta table membres).

Date d’ajout (via created_at).

Cellule (si assignée).

Bouton WhatsApp (seulement si telephone existe → il ouvre WhatsApp avec le numéro du membre).

👉 Et si une info n’existe pas (par exemple pas de cellule), ça affiche — ou Non assigné.

Veux-tu que je t’intègre ça directement dans ton list-members.js pour que tu aies un affichage concret comme ci-dessus ?

You said:
oui.
rien ne dois changer appart quand je clik sur details les detials doivent s'afficher a vla possoiblite d'envouer par whatsapp
ChatGPT said:
Parfait 👍
On ne touche pas au reste de la page, on ajoute juste le contenu de la section "Détails" quand tu cliques dessus.

Voici la partie modifiée de ton list-members.js (j’ai complété uniquement la section des détails) :

{detailsOpen[member.id] && (
  <div className="mt-2 text-sm text-gray-700 space-y-2">
    <p>📧 <strong>Email :</strong> {member.email || "—"}</p>
    <p>📅 <strong>Ajouté le :</strong> {member.created_at ? new Date(member.created_at).toLocaleDateString() : "—"}</p>
    <p>📍 <strong>Cellule :</strong> {member.cellule || "Non assigné"}</p>

    {member.telephone && (
      <a
        href={`https://wa.me/${member.telephone}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600 transition"
      >
        📲 Envoyer un WhatsApp
      </a>
    )}
  </div>
)}
