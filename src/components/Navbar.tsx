import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { buildWhatsAppUrl } from '../utils/contactHelpers';

const NAV_LINKS = [
  { href: '#servicos', label: 'Serviços' },
  { href: '#simulador-3d', label: 'Simulador 3D' },
  { href: '#galeria', label: 'Galeria' },
  { href: '#depoimentos', label: 'Depoimentos' },
  { href: '#faq', label: 'FAQ' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#061C47]/95 text-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6">
        {/* Zone 1: Single-line Brand Wordmark */}
        <a
          href="#inicio"
          className="font-display text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
        >
          Charles Pintor
        </a>

        {/* Zone 2: Concise single-line navigation links */}
        <nav
          aria-label="Navegação principal"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-200"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap shrink-0 py-1 transition-colors hover:text-[#D4AF37] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Single Primary Action + Mobile toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center justify-center rounded-lg bg-[#D4AF37] px-4 py-2 text-xs font-semibold text-[#061C47] transition-colors hover:bg-[#E5C765] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Solicitar Orçamento
          </a>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 text-white transition-colors hover:bg-white/10 md:hidden focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Menu mobile"
          className="border-t border-white/10 bg-[#061C47] px-4 py-4 md:hidden"
        >
          <div className="flex flex-col gap-2">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-100 transition-colors hover:bg-white/10 hover:text-[#D4AF37]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contato"
              onClick={() => setMobileOpen(false)}
              className="mt-2 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-[#061C47] transition-colors hover:bg-[#E5C765]"
            >
              Solicitar Orçamento
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
