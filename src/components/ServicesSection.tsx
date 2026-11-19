import { Check, PaintBucket } from 'lucide-react';
import { useState } from 'react';
import { SERVICES_LIST } from '../data/portfolioData';

function ResilientServiceImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#0B3D91] to-[#061C47] p-6 text-center text-white">
        <PaintBucket className="h-8 w-8 text-[#D4AF37]" />
        <span className="mt-2 text-xs font-medium text-slate-200">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
    />
  );
}

export function ServicesSection() {
  return (
    <section id="servicos" className="scroll-mt-20 bg-[#F8F9FC] py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-6 border-b border-[#0B3D91]/10 pb-8 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#8A6A12]">
              Especialidades Técnicas
            </p>
            <h2
              className="mt-2 font-display text-3xl font-bold tracking-tight text-[#0B3D91] sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Da preparação da parede ao recorte final sem respingos
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-600 sm:text-base">
            Cada projeto recebe planejamento de proteção, nivelamento criterioso e tintas
            adequadas para ambientes internos, fachadas expostas e efeitos especiais.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {SERVICES_LIST.map((service) => (
            <article
              key={service.number}
              className="group grid grid-cols-1 overflow-hidden rounded-xl border border-[#0B3D91]/12 bg-white transition-colors hover:border-[#D4AF37]/60 sm:grid-cols-12"
            >
              <div className="relative h-56 overflow-hidden sm:col-span-5 sm:h-full sm:min-h-[250px]">
                <ResilientServiceImage src={service.image} alt={service.imageAlt} />
              </div>

              <div className="flex flex-col justify-between p-6 sm:col-span-7">
                <div>
                  <span className="font-mono text-xs font-semibold text-[#8A6A12] tabular-nums">
                    {service.number}.
                  </span>
                  <h3 className="mt-1.5 font-display text-xl font-bold text-[#0F172A]">
                    {service.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-600">
                    {service.description}
                  </p>
                </div>

                <ul className="mt-5 space-y-2 border-t border-slate-100 pt-4">
                  {service.highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-xs font-medium text-slate-700"
                    >
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#0B3D91]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
