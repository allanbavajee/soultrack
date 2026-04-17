"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function PublicHeader() {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);

  const navItems = [
    { label: "Accueil", path: "/site/HomePage" },
    { label: "Process", path: "/CommentCaMarche" },
    { label: "À propos", path: "/about" },
    { label: "Pricing", path: "/pricing" },
    { label: "Contact", path: "/contact" },
  ];

  return (
    <header className="w-full bg-[#333699]">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">

        {/* Logo */}
        <div
          className="flex items-center cursor-pointer"
          onClick={() => router.push("/site/HomePage")}
        >
          <Image src="/logo.png" alt="Logo SoulTrack" width={50} height={50} />
          <span className="ml-3 text-2xl font-bold text-white">
            SoulTrack
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-3">

          {navItems.map((item) => (
            <span
              key={item.label}
              onClick={() => router.push(item.path)}
              className="cursor-pointer text-amber-300 hover:text-white font-semibold transition"
            >
              {item.label}
            </span>
          ))}

          {/* Buttons */}
          <button
            onClick={() => router.push("/login")}
            className="ml-4 px-4 py-2 bg-white text-[#333699] rounded-xl hover:scale-105 transition font-semibold"
          >
            Connexion
          </button>

          <button
            onClick={() => router.push("/SignupEglise")}
            className="ml-2 px-4 py-2 border border-white text-white rounded-xl hover:bg-white hover:text-[#333699] transition font-semibold"
          >
            Inscription
          </button>

        </nav>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="text-white text-2xl"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {openMenu && (
        <div className="md:hidden bg-[#333699] px-4 pb-4 flex flex-col gap-3">

          {navItems.map((item) => (
            <span
              key={item.label}
              onClick={() => {
                router.push(item.path);
                setOpenMenu(false);
              }}
              className="cursor-pointer text-amber-300 hover:text-white font-semibold transition"
            >
              {item.label}
            </span>
          ))}

          <button
            onClick={() => router.push("/login")}
            className="mt-2 px-4 py-2 bg-white text-[#333699] rounded-xl font-semibold"
          >
            Connexion
          </button>

          <button
            onClick={() => router.push("/SignupEglise")}
            className="px-4 py-2 border border-white text-white rounded-xl font-semibold"
          >
            Inscription
          </button>

        </div>
      )}
    </header>
  );
}
