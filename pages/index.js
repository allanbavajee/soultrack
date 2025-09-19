/* /pages/index.js */
import Link from "next/link";

export default function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>🙏 SoulTrack Dashboard</h1>
      <p>Bienvenue sur votre plateforme de suivi des membres de l’église.</p>
      <ul>
        <li><Link href="/add-member">➕ Ajouter un membre</Link></li>
        <li><Link href="/new-members">🚀 Nouveaux venus</Link></li>
      </ul>
    </div>
  );
}
