import { Star } from 'lucide-react';
import { TESTIMONIALS } from '../data/portfolioData';

export function TestimonialsSection() {
  return (
    <section id="depoimentos" className="scroll-mt-20 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold text-[#8A6A12]">
            Avaliações de Clientes
          </p>
          <h2
            className="mt-2 font-display text-3xl font-bold tracking-tight text-[#0B3D91] sm:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            Quem contrata recomenda a limpeza e o acabamento
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((item) => (
            <article
              key={item.id}
              className="flex flex-col justify-between rounded-xl border border-[#0B3D91]/12 bg-[#F8F9FC] p-6"
            >
              <div>
                <div
                  className="flex items-center gap-1 text-[#B69121]"
                  aria-label={`${item.rating} de 5 estrelas`}
                >
                  {Array.from({ length: item.rating }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="h-4 w-4 fill-[#D4AF37] text-[#B69121]"
                      aria-hidden="true"
                    />
                  ))}
                </div>

                <blockquote className="mt-4 text-sm leading-relaxed text-slate-700">
                  “{item.text}”
                </blockquote>
              </div>

              <footer className="mt-6 border-t border-[#0B3D91]/10 pt-4">
                <p className="font-display text-base font-bold text-[#0F172A]">
                  {item.name}
                </p>
                <p className="mt-0.5 text-xs font-medium text-slate-500">
                  {item.project}
                </p>
              </footer>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
