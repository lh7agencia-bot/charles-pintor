import { WHATSAPP_NUMBER_DISPLAY } from '../data/portfolioData';
import { buildWhatsAppUrl } from '../utils/contactHelpers';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#061C47] text-slate-300">
      <div className="mx-auto flex max-w-6xl flex-col justify-between gap-8 px-4 py-12 sm:px-6 md:flex-row md:items-center">
        <div>
          <p className="font-display text-xl font-bold text-white">
            Charles Pintor
          </p>
          <p className="mt-1 text-sm text-[#E5C765]">
            Cor que transforma ambientes
          </p>
          <p className="mt-2 text-xs text-slate-400">
            WhatsApp:{' '}
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-slate-200 underline decoration-[#D4AF37]/50 underline-offset-4 hover:text-[#D4AF37]"
            >
              {WHATSAPP_NUMBER_DISPLAY}
            </a>
          </p>
        </div>

        <nav
          aria-label="Links do rodapé"
          className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm"
        >
          <a href="#servicos" className="hover:text-[#D4AF37]">
            Serviços
          </a>
          <a href="#simulador-3d" className="hover:text-[#D4AF37]">
            Simulador 3D
          </a>
          <a href="#galeria" className="hover:text-[#D4AF37]">
            Galeria
          </a>
          <a href="#depoimentos" className="hover:text-[#D4AF37]">
            Depoimentos
          </a>
          <a href="#faq" className="hover:text-[#D4AF37]">
            FAQ
          </a>
          <a href="#contato" className="hover:text-[#D4AF37]">
            Contato
          </a>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-4 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:px-6">
          <p>© {new Date().getFullYear()} Charles Pintor. Todos os direitos reservados.</p>
          <p>Pintura residencial, comercial, fachadas e efeitos decorativos.</p>
        </div>
      </div>
    </footer>
  );
}
