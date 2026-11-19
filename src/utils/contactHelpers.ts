import {
  GalleryCategory,
  GalleryPhoto,
  WHATSAPP_NUMBER_E164,
} from '../data/portfolioData';

export interface ContactFormValues {
  nome: string;
  email: string;
  mensagem: string;
}

export interface ContactFormErrors {
  nome?: string;
  email?: string;
  mensagem?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContactForm(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {};
  const nome = values.nome.trim();
  const email = values.email.trim();
  const mensagem = values.mensagem.trim();

  if (nome.length < 2) {
    errors.nome = 'Informe seu nome completo.';
  }

  if (!email) {
    errors.email = 'Informe seu e-mail para contato.';
  } else if (!EMAIL_REGEX.test(email)) {
    errors.email = 'Digite um endereço de e-mail válido.';
  }

  if (mensagem.length < 10) {
    errors.mensagem = 'Descreva brevemente o serviço desejado (mínimo 10 caracteres).';
  }

  return errors;
}

export function buildWhatsAppMessage(values: ContactFormValues): string {
  const lines = [
    'Olá Charles Pintor! Gostaria de solicitar um orçamento.',
    '',
    `Nome: ${values.nome.trim()}`,
    `E-mail: ${values.email.trim()}`,
    `Mensagem: ${values.mensagem.trim()}`,
  ];
  return lines.join('\n');
}

export function buildWhatsAppUrl(customMessage?: string): string {
  const text =
    customMessage ??
    'Olá Charles Pintor! Vi seu site e gostaria de solicitar um orçamento de pintura.';
  return `https://wa.me/${WHATSAPP_NUMBER_E164}?text=${encodeURIComponent(text)}`;
}

export function buildEmailUrl(values: ContactFormValues): string {
  const subject = `Orçamento de Pintura — ${values.nome.trim() || 'Novo Contato'}`;
  const body = buildWhatsAppMessage(values);
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function filterGalleryPhotos(
  photos: GalleryPhoto[],
  category: GalleryCategory,
): GalleryPhoto[] {
  if (category === 'Todas') {
    return photos;
  }
  return photos.filter((photo) => photo.category === category);
}

export function stepLightboxIndex(
  currentIndex: number,
  delta: number,
  total: number,
): number {
  if (total <= 0) {
    return -1;
  }
  return ((currentIndex + delta) % total + total) % total;
}
