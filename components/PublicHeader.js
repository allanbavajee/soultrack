"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function PublicHeader() {
  const router = useRouter();
  const [openMenu, setOpenMenu] = useState(false);

  return (
    <header className="w-full bg-[#333699]">

      <div className="max-w-5xl mx-auto grid grid-cols-3 items-center py-4">

        {/* LEFT NAV (rapproché du centre) */}
        <div className="hidden md:flex items-center gap-3 justify-end pr-4">
          <span onClick={() => router.push("/site/HomePage")} className="cursor-pointer text-amber-300 hover:text-white font-semibold text-sm">
            Accueil
          </span>
          <span onClick={() => router.push("/CommentCaMarche")} className="cursor-pointer text-amber-300 hover:text-white font-semibold text-sm">
            Process
          </span>
          <span onClick={() => router.push("/about")} className="cursor-pointer text-amber-300 hover:text-white font-semibold text-sm">
            À propos
          </span>
        </div>

        {/* CENTER LOGO (PLUS GROS) */}
        <div
          className="flex flex-col items-center justify-center cursor-pointer"
          onClick={() => router.push("/site/HomePage")}
        >
          <Image src="/logo.png" alt="Logo SoulTrack" width={70} height={70} />
          <span className="text-white font-extrabold text-2xl leading-none mt-1 tracking-wide">
            SoulTrack
          </span>
        </div>

        {/* RIGHT NAV (rapproché du centre) */}
        <div className="hidden md:flex items-center gap-3 justify-start pl-4">

          <span onClick={() => router.push("/pricing")} className="cursor-pointer text-amber-300 hover:text-white font-semibold text-sm">
            Pricing
          </span>
          <span onClick={() => router.push("/contact")} className="cursor-pointer text-amber-300 hover:text-white font-semibold text-sm">
            Contact
          </span>

          <button
            onClick={() => router.push("/login")}
            className="ml-3 px-3 py-1.5 bg-white text-[#333699] rounded-xl hover:scale-105 transition font-semibold text-sm"
          >
            Connexion
          </button>

          <button
            onClick={() => router.push("/SignupEglise")}
            className="ml-2 px-3 py-1.5 border border-white text-white rounded-xl hover:bg-white hover:text-[#333699] transition font-semibold text-sm"
          >
            Inscription
          </button>

        </div>

        {/* MOBILE */}
        <div className="md:hidden col-span-3 flex justify-end px-4">
          <button
            onClick={() => setOpenMenu(!openMenu)}
            className="text-white text-2xl"
          >
            ☰
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {openMenu && (
        <div className="md:hidden bg-[#333699] px-4 pb-4 flex flex-col gap-3">

          <span onClick={() => router.push("/site/HomePage")} className="text-amber-300">Accueil</span>
          <span onClick={() => router.push("/CommentCaMarche")} className="text-amber-300">Process</span>
          <span onClick={() => router.push("/about")} className="text-amber-300">À propos</span>
          <span onClick={() => router.push("/pricing")} className="text-amber-300">Pricing</span>
          <span onClick={() => router.push("/contact")} className="text-amber-300">Contact</span>

          <button
            onClick={() => router.push("/login")}
            className="mt-2 px-4 py-2 bg-white text-[#333699] rounded-xl"
          >
            Connexion
          </button>

          <button
            onClick={() => router.push("/SignupEglise")}
            className="px-4 py-2 border border-white text-white rounded-xl"
          >
            Inscription
          </button>

        </div>
      )}
    </header>
  );
}
