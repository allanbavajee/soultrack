import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export default function SendWhatsappButton({ token }) {
  const baseUrl = "https://soultrack-beta.vercel.app/access";
  const link = `${baseUrl}/${token}`;
  const message = `Bonjour 👋, voici ton lien d'accès : ${link}`;

  const handleClick = () => {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <Button
      onClick={handleClick}
      className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md"
    >
      <MessageCircle size={18} />
      Envoyer l’appli
    </Button>
  );
}
