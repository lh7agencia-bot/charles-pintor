import { ArrowDownRight, MessageCircle } from 'lucide-react';
import { WHATSAPP_NUMBER_DISPLAY } from '../data/portfolioData';
import { buildWhatsAppUrl } from '../utils/contactHelpers';

export function HeroVideoSection() {
  return (
    <section
      id="inicio"
      className="relative flex min-h-[88vh] w-full items-center overflow-hidden bg-[#061C47] text-white"
    >
      {/* Full-Screen Looping Background Video (autoplay, infinite loop, zero visible controls) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="/images/fachada-moderna-grafite.jpeg"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
      >
        <source src="/videos/hero-pintura.webm" type="video/webm" />
        <source src="/videos/hero-pintura.mp4" type="video/mp4" />
      </video>

      {/* Measured dark navy overlay scrim for >= 4.5:1 text contrast over all frames */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-[#061C47]/80 via-[#072760]/68 to-[#061C47]/92"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-[#061C47]/85 via-[#061C47]/45 to-transparent"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
        <div className="max-w-2xl">
          <p className="text-sm font-medium tracking-wide text-[#E5C765]">
            Charles Pintor · Pintura Residencial, Comercial e Efeitos Decorativos
          </p>

          <h1
            className="mt-4 font-display font-bold tracking-tight text-white leading-[1.08]"
            style={{ fontSize: 'clamp(2.45rem, 5vw, 4.1rem)', textWrap: 'balance' }}
          >
            Cor que transforma ambientes
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-200 sm:text-lg">
            Acabamento de alto padrão para residências, fachadas e espaços comerciais.
            Executamos preparação fina, pé-direito duplo, cimento queimado e texturas com
            proteção completa de pisos e mobiliário.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={buildWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-[#061C47] transition-colors hover:bg-[#E5C765] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <MessageCircle className="h-4 w-4 shrink-0" />
              <span>Solicitar Orçamento no WhatsApp</span>
            </a>

            <a
              href="#galeria"
              className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-white/25 bg-[#061C47]/70 px-5 py-3 text-sm font-medium text-white transition-colors hover:border-[#D4AF37] hover:text-[#E5C765] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
            >
              <span>Ver Obras Realizadas</span>
              <ArrowDownRight className="h-4 w-4 shrink-0" />
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/15 pt-6 text-sm text-slate-200">
            <span>
              Atendimento direto:{' '}
              <strong className="font-mono font-semibold text-[#E5C765] tabular-nums">
                {WHATSAPP_NUMBER_DISPLAY}
              </strong>
            </span>
            <span aria-hidden="true" className="text-white/30">
              ·
            </span>
            <span>Proteção total com lona e fita antes da pintura</span>
            <span aria-hidden="true" className="text-white/30">
              ·
            </span>
            <span>Orçamento transparente sem compromisso</span>
          </div>
        </div>
      </div>
    </section>
  );
}
