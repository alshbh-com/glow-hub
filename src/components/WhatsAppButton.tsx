import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "201030806772";

export default function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="تواصلي معنا على واتساب"
      className="fixed bottom-6 left-6 z-40 group"
    >
      <span className="absolute inset-0 rounded-full bg-green-500/40 animate-ping" />
      <span className="relative w-14 h-14 grid place-items-center rounded-full bg-green-500 text-white shadow-luxe hover:bg-green-600 transition-transform group-hover:scale-110">
        <MessageCircle size={26} fill="currentColor" strokeWidth={0} />
      </span>
    </a>
  );
}
