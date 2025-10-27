"use client";

import { useState } from "react";

export default function TestCreateAdmin() {
  const [message, setMessage] = useState("");

  const createAdmin = async () => {
    try {
      const res = await fetch("/api/create-admin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prenom: "Admin",
          nom: "Principal",
          email: "adminp@soultrack.com",
          password: "111111",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur inconnue");

      setMessage(`✅ ${data.message}`);
    } catch (err) {
      setMessage(`❌ Erreur : ${err.message}`);
    }
  };

  return (
    <div className="p-8">
      <button
        onClick={createAdmin}
        className="bg-blue-700 text-white py-2 px-4 rounded"
      >
        Créer Admin
      </button>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
}
