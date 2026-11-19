import * as THREE from 'three';

export type PaintFinishType = 'fosco' | 'acetinado' | 'cimento' | 'cristais';

export interface PaintColorPreset {
  id: string;
  name: string;
  hex: string;
  description: string;
}

export const PAINT_COLORS: PaintColorPreset[] = [
  {
    id: 'azul-marinho',
    name: 'Azul Marinho',
    hex: '#0B3D91',
    description: 'Profundidade sofisticada para paredes de destaque.',
  },
  {
    id: 'dourado-areia',
    name: 'Dourado Areia',
    hex: '#B89545',
    description: 'Tom quente mineral com toque contemporâneo.',
  },
  {
    id: 'grafite-moderno',
    name: 'Grafite Moderno',
    hex: '#3E454E',
    description: 'Elegância arquitetônica para salas e fachadas.',
  },
  {
    id: 'cinza-urbano',
    name: 'Cinza Urbano',
    hex: '#8C929B',
    description: 'Neutro equilibrado que realça iluminação natural.',
  },
  {
    id: 'verde-salvia',
    name: 'Verde Sálvia',
    hex: '#576B60',
    description: 'Calma orgânica com leitura aconchegante.',
  },
  {
    id: 'branco-neve',
    name: 'Branco Neve',
    hex: '#ECEFF4',
    description: 'Amplitude e luminosidade pura em qualquer ambiente.',
  },
];

export const PAINT_FINISHES: {
  id: PaintFinishType;
  label: string;
  roughness: number;
  clearcoat: number;
  bumpScale: number;
}[] = [
  { id: 'fosco', label: 'Fosco Suave', roughness: 0.88, clearcoat: 0.0, bumpScale: 0.004 },
  { id: 'acetinado', label: 'Acetinado', roughness: 0.42, clearcoat: 0.28, bumpScale: 0.002 },
  { id: 'cimento', label: 'Cimento Queimado', roughness: 0.54, clearcoat: 0.16, bumpScale: 0.018 },
  { id: 'cristais', label: 'Textura Cristais', roughness: 0.46, clearcoat: 0.2, bumpScale: 0.032 },
];

function createSeededRandom(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

export function createFinishMaps(
  finish: PaintFinishType,
  maxAnisotropy: number,
): {
  bumpMap: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
  colorVariationMap: THREE.CanvasTexture;
} {
  const size = 512;
  const rand = createSeededRandom(
    finish === 'cimento' ? 401 : finish === 'cristais' ? 917 : 123,
  );

  // Bump canvas (linear data)
  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d')!;

  // Roughness canvas (linear data)
  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = size;
  roughCanvas.height = size;
  const rCtx = roughCanvas.getContext('2d')!;

  // Subtle albedo modulation map (SRGB, white-based so material.color tints it cleanly)
  const albedoCanvas = document.createElement('canvas');
  albedoCanvas.width = size;
  albedoCanvas.height = size;
  const aCtx = albedoCanvas.getContext('2d')!;

  bCtx.fillStyle = '#808080';
  bCtx.fillRect(0, 0, size, size);

  rCtx.fillStyle = '#c8c8c8';
  rCtx.fillRect(0, 0, size, size);

  aCtx.fillStyle = '#ffffff';
  aCtx.fillRect(0, 0, size, size);

  if (finish === 'fosco' || finish === 'acetinado') {
    const count = 4200;
    for (let i = 0; i < count; i++) {
      const x = rand() * size;
      const y = rand() * size;
      const r = 0.6 + rand() * 1.4;
      const v = Math.floor(118 + rand() * 20);
      bCtx.fillStyle = `rgb(${v},${v},${v})`;
      bCtx.fillRect(x, y, r, r);

      const rv = finish === 'acetinado' ? Math.floor(95 + rand() * 35) : Math.floor(205 + rand() * 30);
      rCtx.fillStyle = `rgb(${rv},${rv},${rv})`;
      rCtx.fillRect(x, y, r * 1.5, r * 1.5);
    }
  } else if (finish === 'cimento') {
    // Organic troweled plaster clouds
    for (let i = 0; i < 180; i++) {
      const x = rand() * size;
      const y = rand() * size;
      const rad = 28 + rand() * 75;
      const shade = Math.floor(195 + rand() * 58);
      const grad = aCtx.createRadialGradient(x, y, 2, x, y, rad);
      grad.addColorStop(0, `rgba(${shade},${shade},${shade},0.22)`);
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      aCtx.fillStyle = grad;
      aCtx.fillRect(x - rad, y - rad, rad * 2, rad * 2);

      const bShade = Math.floor(85 + rand() * 90);
      const bGrad = bCtx.createRadialGradient(x, y, 2, x, y, rad * 0.8);
      bGrad.addColorStop(0, `rgba(${bShade},${bShade},${bShade},0.28)`);
      bGrad.addColorStop(1, 'rgba(128,128,128,0)');
      bCtx.fillStyle = bGrad;
      bCtx.fillRect(x - rad, y - rad, rad * 2, rad * 2);

      const rShade = Math.floor(95 + rand() * 110);
      const rGrad = rCtx.createRadialGradient(x, y, 4, x, y, rad);
      rGrad.addColorStop(0, `rgba(${rShade},${rShade},${rShade},0.25)`);
      rGrad.addColorStop(1, 'rgba(140,140,140,0)');
      rCtx.fillStyle = rGrad;
      rCtx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
    }
  } else if (finish === 'cristais') {
    // Mineral stone & mica crystal texture
    for (let i = 0; i < 9500; i++) {
      const x = rand() * size;
      const y = rand() * size;
      const s = 1 + rand() * 2.6;
      const bVal = Math.floor(60 + rand() * 175);
      bCtx.fillStyle = `rgb(${bVal},${bVal},${bVal})`;
      bCtx.fillRect(x, y, s, s);

      const isSparkle = rand() > 0.86;
      const rVal = isSparkle ? 38 : Math.floor(150 + rand() * 70);
      rCtx.fillStyle = `rgb(${rVal},${rVal},${rVal})`;
      rCtx.fillRect(x, y, s, s);

      const aVal = isSparkle ? 255 : Math.floor(215 + rand() * 35);
      aCtx.fillStyle = `rgb(${aVal},${aVal},${aVal})`;
      aCtx.fillRect(x, y, s, s);
    }
  }

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = THREE.RepeatWrapping;
  bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(3, 2);
  bumpMap.anisotropy = maxAnisotropy;

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(3, 2);
  roughnessMap.anisotropy = maxAnisotropy;

  const colorVariationMap = new THREE.CanvasTexture(albedoCanvas);
  colorVariationMap.colorSpace = THREE.SRGBColorSpace;
  colorVariationMap.wrapS = THREE.RepeatWrapping;
  colorVariationMap.wrapT = THREE.RepeatWrapping;
  colorVariationMap.repeat.set(3, 2);
  colorVariationMap.anisotropy = maxAnisotropy;

  return { bumpMap, roughnessMap, colorVariationMap };
}

export function createPorcelainFloorTexture(maxAnisotropy: number): {
  map: THREE.CanvasTexture;
  roughnessMap: THREE.CanvasTexture;
} {
  const size = 512;
  const rand = createSeededRandom(777);

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#e7e4de';
  ctx.fillRect(0, 0, size, size);

  // Subtle marble veining
  ctx.strokeStyle = 'rgba(182, 178, 170, 0.35)';
  for (let i = 0; i < 18; i++) {
    ctx.beginPath();
    let x = rand() * size;
    let y = rand() * size;
    ctx.moveTo(x, y);
    ctx.lineWidth = 0.8 + rand() * 1.8;
    for (let s = 0; s < 5; s++) {
      x += (rand() - 0.5) * 140;
      y += (rand() - 0.5) * 140;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // Porcelain tile grout lines (2x2 per repeat)
  ctx.strokeStyle = 'rgba(165, 162, 155, 0.55)';
  ctx.lineWidth = 2;
  ctx.strokeRect(0, 0, size / 2, size / 2);
  ctx.strokeRect(size / 2, 0, size / 2, size / 2);
  ctx.strokeRect(0, size / 2, size / 2, size / 2);
  ctx.strokeRect(size / 2, size / 2, size / 2, size / 2);

  const rCanvas = document.createElement('canvas');
  rCanvas.width = size;
  rCanvas.height = size;
  const rCtx = rCanvas.getContext('2d')!;
  rCtx.fillStyle = '#383838';
  rCtx.fillRect(0, 0, size, size);
  rCtx.strokeStyle = '#c8c8c8';
  rCtx.lineWidth = 3;
  rCtx.strokeRect(0, 0, size / 2, size / 2);
  rCtx.strokeRect(size / 2, 0, size / 2, size / 2);
  rCtx.strokeRect(0, size / 2, size / 2, size / 2);
  rCtx.strokeRect(size / 2, size / 2, size / 2, size / 2);

  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(4, 4);
  map.anisotropy = maxAnisotropy;

  const roughnessMap = new THREE.CanvasTexture(rCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(4, 4);
  roughnessMap.anisotropy = maxAnisotropy;

  return { map, roughnessMap };
}

export function createContactShadowTexture(): THREE.CanvasTexture {
  const size = 256;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const grad = ctx.createRadialGradient(
    size / 2,
    size / 2,
    8,
    size / 2,
    size / 2,
    size / 2,
  );
  grad.addColorStop(0, 'rgba(10, 18, 36, 0.55)');
  grad.addColorStop(0.55, 'rgba(10, 18, 36, 0.18)');
  grad.addColorStop(1, 'rgba(10, 18, 36, 0)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
