import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { FAQ_ITEMS } from '../data/portfolioData';

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id);

  const toggleItem = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <section id="faq" className="scroll-mt-20 bg-[#F8F9FC] py-20 sm:py-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-sm font-semibold text-[#8A6A12]">
            Dúvidas Frequentes
          </p>
          <h2
            className="mt-2 font-display text-3xl font-bold tracking-tight text-[#0B3D91] sm:text-4xl"
            style={{ textWrap: 'balance' }}
          >
            Perguntas comuns antes de iniciar sua pintura
          </h2>
        </div>

        <div className="mt-10 divide-y divide-[#0B3D91]/12 rounded-2xl border border-[#0B3D91]/12 bg-white">
          {FAQ_ITEMS.map((item) => {
            const isOpen = openId === item.id;
            const panelId = `${item.id}-panel`;
            return (
              <div key={item.id} className="px-5 py-4 sm:px-7 sm:py-5">
                <button
                  type="button"
                  onClick={() => toggleItem(item.id)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full items-center justify-between gap-4 py-1 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0B3D91]"
                >
                  <span className="font-display text-base font-bold text-[#0F172A] sm:text-lg">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[#0B3D91] transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#8A6A12]' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {isOpen && (
                  <div
                    id={panelId}
                    className="mt-3 pr-8 text-sm leading-relaxed text-slate-600 sm:text-base"
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
