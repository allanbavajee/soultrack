// components/SendWhatsappButton.js
import { FaWhatsapp } from "react-icons/fa";

export default function SendWhatsappButton({ token }) {
  const baseUrl = "https://soultrack-beta.vercel.app/access";
  const link = `${baseUrl}/${token}`;
  const message = `Salut 👋, clique sur ce lien pour accéder à l'application : ${link}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg shadow-md transition"
    >
      <FaWhatsapp className="mr-2 text-xl" />
      Envoyer l’appli
    </a>
  );
}
