import { MessageCircle } from 'lucide-react';
import { buildWhatsAppUrl } from '../utils/contactHelpers';

export function FloatingWhatsApp() {
  return (
    <a
      href={buildWhatsAppUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com Charles Pintor no WhatsApp 62 8200-2505"
      className="fixed right-4 bottom-4 z-40 inline-flex h-12 items-center gap-2 rounded-full border border-[#D4AF37] bg-[#0B3D91] px-4 text-sm font-semibold text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#072760] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] sm:right-6 sm:bottom-6"
    >
      <MessageCircle className="h-5 w-5 shrink-0 text-[#D4AF37]" aria-hidden="true" />
      <span className="whitespace-nowrap">WhatsApp</span>
    </a>
  );
}
