"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-yellow-50 to-blue-100 p-6">
      <div className="bg-white p-10 rounded-3xl shadow-lg w-full max-w-md flex flex-col items-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Test du Login 🧩
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("✅ FORMULAIRE SOUMIS !");
            alert("✅ FORMULAIRE SOUMIS !");
          }}
          className="flex flex-col w-full gap-4"
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-full text-center"
          />

          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-300 p-3 rounded-lg w-full text-center"
          />

          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg shadow-md"
          >
            Tester
          </button>
        </form>
      </div>
    </div>
  );
}
