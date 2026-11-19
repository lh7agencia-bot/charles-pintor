import { CheckCircle2, Mail, MessageCircle, Phone } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { WHATSAPP_NUMBER_DISPLAY } from '../data/portfolioData';
import {
  buildEmailUrl,
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  ContactFormErrors,
  validateContactForm,
} from '../utils/contactHelpers';

type DispatchChannel = 'whatsapp' | 'email';

export function ContactSection() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [submittedChannel, setSubmittedChannel] = useState<DispatchChannel | null>(
    null,
  );
  const [lastSubmittedLinks, setLastSubmittedLinks] = useState<{
    whatsappUrl: string;
    emailUrl: string;
    preview: string;
  } | null>(null);

  const dispatchContact = (channel: DispatchChannel) => {
    const payload = { nome, email, mensagem };
    const nextErrors = validateContactForm(payload);
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setSubmittedChannel(null);
      return;
    }

    const formattedMsg = buildWhatsAppMessage(payload);
    const whatsappUrl = buildWhatsAppUrl(formattedMsg);
    const emailUrl = buildEmailUrl(payload);

    setLastSubmittedLinks({
      whatsappUrl,
      emailUrl,
      preview: formattedMsg,
    });
    setSubmittedChannel(channel);

    // Navigate via temporary anchor rather than window.open/alert
    const targetUrl = channel === 'whatsapp' ? whatsappUrl : emailUrl;
    const anchor = document.createElement('a');
    anchor.href = targetUrl;
    if (channel === 'whatsapp') {
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';
    }
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    dispatchContact('whatsapp');
  };

  return (
    <section id="contato" className="scroll-mt-20 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Direct Contact Info (No invented address, no map section) */}
          <div className="lg:col-span-5">
            <p className="text-sm font-semibold text-[#8A6A12]">
              Solicite Seu Orçamento
            </p>
            <h2
              className="mt-2 font-display text-3xl font-bold tracking-tight text-[#0B3D91] sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Atendimento ágil direto com Charles Pintor
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Envie os detalhes do seu ambiente ou fachada para receber um orçamento
              transparente. Se preferir, chame diretamente pelo WhatsApp.
            </p>

            <div className="mt-8 rounded-2xl border border-[#0B3D91]/12 bg-[#061C47] p-6 text-white">
              <p className="text-xs font-semibold tracking-wide text-[#E5C765]">
                Telefone e WhatsApp
              </p>
              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-3 font-mono text-2xl font-bold text-white transition-colors hover:text-[#D4AF37] tabular-nums"
              >
                <Phone className="h-5 w-5 text-[#D4AF37]" aria-hidden="true" />
                <span>{WHATSAPP_NUMBER_DISPLAY}</span>
              </a>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Envie fotos do local e conte qual acabamento deseja para agilizar a
                avaliação técnica.
              </p>

              <a
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-[#D4AF37] px-5 py-2.5 text-sm font-semibold text-[#061C47] transition-colors hover:bg-[#E5C765]"
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
                <span>Chamar no WhatsApp Agora</span>
              </a>
            </div>
          </div>

          {/* Right Column: Static Contact Form (WhatsApp & E-mail) */}
          <div className="rounded-2xl border border-[#0B3D91]/12 bg-[#F8F9FC] p-6 sm:p-8 lg:col-span-7">
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              <div>
                <label
                  htmlFor="contato-nome"
                  className="block text-sm font-semibold text-[#0F172A]"
                >
                  Nome completo
                </label>
                <input
                  id="contato-nome"
                  name="nome"
                  type="text"
                  autoComplete="name"
                  required
                  value={nome}
                  onChange={(e) => {
                    setNome(e.target.value);
                    if (errors.nome) setErrors((prev) => ({ ...prev, nome: undefined }));
                  }}
                  placeholder="Ex.: Mariana Oliveira"
                  aria-invalid={Boolean(errors.nome)}
                  className={`mt-1.5 w-full rounded-lg border bg-white px-4 py-3 text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                    errors.nome
                      ? 'border-red-600 focus:ring-red-600/20'
                      : 'border-[#0B3D91]/20 focus:border-[#0B3D91] focus:ring-[#0B3D91]/20'
                  }`}
                />
                {errors.nome && (
                  <p role="alert" className="mt-1.5 text-xs font-medium text-red-700">
                    {errors.nome}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contato-email"
                  className="block text-sm font-semibold text-[#0F172A]"
                >
                  E-mail
                </label>
                <input
                  id="contato-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="voce@exemplo.com.br"
                  aria-invalid={Boolean(errors.email)}
                  className={`mt-1.5 w-full rounded-lg border bg-white px-4 py-3 text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                    errors.email
                      ? 'border-red-600 focus:ring-red-600/20'
                      : 'border-[#0B3D91]/20 focus:border-[#0B3D91] focus:ring-[#0B3D91]/20'
                  }`}
                />
                {errors.email && (
                  <p role="alert" className="mt-1.5 text-xs font-medium text-red-700">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contato-mensagem"
                  className="block text-sm font-semibold text-[#0F172A]"
                >
                  Mensagem
                </label>
                <textarea
                  id="contato-mensagem"
                  name="mensagem"
                  rows={4}
                  required
                  value={mensagem}
                  onChange={(e) => {
                    setMensagem(e.target.value);
                    if (errors.mensagem)
                      setErrors((prev) => ({ ...prev, mensagem: undefined }));
                  }}
                  placeholder="Descreva o imóvel (casa, apartamento ou fachada), metragem aproximada ou tipo de efeito desejado..."
                  aria-invalid={Boolean(errors.mensagem)}
                  className={`mt-1.5 w-full rounded-lg border bg-white px-4 py-3 text-sm text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
                    errors.mensagem
                      ? 'border-red-600 focus:ring-red-600/20'
                      : 'border-[#0B3D91]/20 focus:border-[#0B3D91] focus:ring-[#0B3D91]/20'
                  }`}
                />
                {errors.mensagem && (
                  <p role="alert" className="mt-1.5 text-xs font-medium text-red-700">
                    {errors.mensagem}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3 pt-1 sm:flex-row">
                <button
                  type="submit"
                  className="inline-flex min-h-[48px] flex-1 items-center justify-center gap-2 rounded-lg bg-[#0B3D91] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#072760] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3D91]"
                >
                  <MessageCircle className="h-4 w-4 shrink-0 text-[#D4AF37]" />
                  <span>Enviar via WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => dispatchContact('email')}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-[#0B3D91]/25 bg-white px-5 py-3 text-sm font-semibold text-[#0B3D91] transition-colors hover:border-[#0B3D91] hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3D91]"
                >
                  <Mail className="h-4 w-4 shrink-0" />
                  <span>Enviar por E-mail</span>
                </button>
              </div>
            </form>

            {submittedChannel && lastSubmittedLinks && (
              <div
                role="status"
                data-testid="contact-confirmation"
                className="mt-6 rounded-xl border border-emerald-700/25 bg-emerald-50 p-4 text-sm text-emerald-950"
              >
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                  <div>
                    <p className="font-semibold">
                      {submittedChannel === 'whatsapp'
                        ? 'Mensagem pronta para envio pelo WhatsApp!'
                        : 'Mensagem pronta para envio por E-mail!'}
                    </p>
                    <p className="mt-1 text-xs text-emerald-900">
                      Caso o aplicativo não tenha aberto automaticamente, utilize um dos
                      links diretos abaixo:
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3">
                      <a
                        href={lastSubmittedLinks.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#0B3D91] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#072760]"
                      >
                        Abrir no WhatsApp
                      </a>
                      <a
                        href={lastSubmittedLinks.emailUrl}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#0B3D91]/30 bg-white px-3.5 py-2 text-xs font-semibold text-[#0B3D91] hover:bg-slate-50"
                      >
                        Abrir no E-mail
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
