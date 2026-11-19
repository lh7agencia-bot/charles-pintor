import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildEmailUrl,
  buildWhatsAppMessage,
  buildWhatsAppUrl,
  filterGalleryPhotos,
  stepLightboxIndex,
  validateContactForm,
} from './contactHelpers';
import { GALLERY_PHOTOS } from '../data/portfolioData';

test('validateContactForm rejects empty or invalid fields', () => {
  const errors = validateContactForm({
    nome: 'A',
    email: 'invalido',
    mensagem: 'oi',
  });

  assert.ok(errors.nome);
  assert.ok(errors.email);
  assert.ok(errors.mensagem);
});

test('validateContactForm accepts valid Brazilian contact payload', () => {
  const errors = validateContactForm({
    nome: 'Marcos Silva',
    email: 'marcos@exemplo.com.br',
    mensagem: 'Preciso de pintura interna para sala de 45m2.',
  });

  assert.deepEqual(errors, {});
});

test('buildWhatsAppUrl targets 556282002505 and encodes message cleanly', () => {
  const msg = buildWhatsAppMessage({
    nome: 'Ana Paula',
    email: 'ana@teste.com',
    mensagem: 'Orçamento para fachada moderna.',
  });
  const url = buildWhatsAppUrl(msg);

  assert.ok(url.startsWith('https://wa.me/556282002505?text='));
  assert.ok(decodeURIComponent(url).includes('Ana Paula'));
  assert.ok(decodeURIComponent(url).includes('fachada moderna'));
});

test('buildEmailUrl creates valid mailto URI with subject and body', () => {
  const url = buildEmailUrl({
    nome: 'Carlos Eduardo',
    email: 'carlos@teste.com.br',
    mensagem: 'Gostaria de aplicar cimento queimado na sala.',
  });

  assert.ok(url.startsWith('mailto:?subject='));
  assert.ok(decodeURIComponent(url).includes('Carlos Eduardo'));
  assert.ok(decodeURIComponent(url).includes('cimento queimado'));
});

test('filterGalleryPhotos returns all 11 photos for Todas and subsets for categories', () => {
  const all = filterGalleryPhotos(GALLERY_PHOTOS, 'Todas');
  assert.equal(all.length, 11);

  const fachadas = filterGalleryPhotos(GALLERY_PHOTOS, 'Fachadas');
  assert.ok(fachadas.length >= 3);
  assert.ok(fachadas.every((item) => item.category === 'Fachadas'));
});

test('stepLightboxIndex wraps around cleanly in both directions', () => {
  assert.equal(stepLightboxIndex(0, -1, 11), 10);
  assert.equal(stepLightboxIndex(10, 1, 11), 0);
  assert.equal(stepLightboxIndex(4, 1, 11), 5);
  assert.equal(stepLightboxIndex(0, 1, 0), -1);
});
