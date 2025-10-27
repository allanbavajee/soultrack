"use client";
import AccessGuard from "../components/AccessGuard";

export default function HomePage() {
  return (
    <AccessGuard>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Bienvenue sur SoulTrack 👋
        </h1>
        <p className="text-gray-600 text-center max-w-md">
          Vous êtes connecté en toute sécurité.  
          Choisissez votre espace selon votre rôle.
        </p>
      </div>
    </AccessGuard>
  );
}
