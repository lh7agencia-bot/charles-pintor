import { ChevronLeft, ChevronRight, Expand, PaintBucket, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
  GALLERY_CATEGORIES,
  GALLERY_PHOTOS,
  GalleryCategory,
  GalleryPhoto,
} from '../data/portfolioData';
import { filterGalleryPhotos, stepLightboxIndex } from '../utils/contactHelpers';

function ResilientGalleryThumb({
  photo,
  onClick,
}: {
  photo: GalleryPhoto;
  onClick: () => void;
}) {
  const [failed, setFailed] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Ampliar foto: ${photo.title}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-[#0B3D91]/12 bg-white text-left transition-colors hover:border-[#D4AF37] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B3D91]"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
        {failed ? (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-[#0B3D91] to-[#061C47] p-4 text-center text-white">
            <PaintBucket className="h-7 w-7 text-[#D4AF37]" />
            <span className="mt-2 text-xs font-medium">{photo.title}</span>
          </div>
        ) : (
          <img
            src={photo.src}
            alt={photo.alt}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={() => setFailed(true)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        )}

        <div className="pointer-events-none absolute inset-0 flex items-end justify-end bg-gradient-to-t from-[#061C47]/60 via-transparent to-transparent p-3 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#D4AF37] text-[#061C47]">
            <Expand className="h-4 w-4" />
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <p className="text-xs font-medium text-[#8A6A12]">{photo.category}</p>
          <h3 className="mt-1 font-display text-base font-bold text-[#0F172A]">
            {photo.title}
          </h3>
        </div>
        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-slate-600">
          {photo.description}
        </p>
      </div>
    </button>
  );
}

export function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>('Todas');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const visiblePhotos = filterGalleryPhotos(GALLERY_PHOTOS, selectedCategory);
  const activePhoto =
    lightboxIndex !== null && visiblePhotos[lightboxIndex]
      ? visiblePhotos[lightboxIndex]
      : null;

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setLightboxIndex(null);
      } else if (event.key === 'ArrowRight') {
        setLightboxIndex((prev) =>
          prev === null ? null : stepLightboxIndex(prev, 1, visiblePhotos.length),
        );
      } else if (event.key === 'ArrowLeft') {
        setLightboxIndex((prev) =>
          prev === null ? null : stepLightboxIndex(prev, -1, visiblePhotos.length),
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, visiblePhotos.length]);

  const handleCategoryChange = (category: GalleryCategory) => {
    setSelectedCategory(category);
    setLightboxIndex(null);
  };

  return (
    <section id="galeria" className="scroll-mt-20 bg-[#F8F9FC] py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-xl">
            <p className="text-sm font-semibold text-[#8A6A12]">
              Portfólio Real
            </p>
            <h2
              className="mt-2 font-display text-3xl font-bold tracking-tight text-[#0B3D91] sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Obras executadas com acabamento de alto nível
            </h2>
          </div>

          {/* Interactive category filter bar */}
          <div
            role="tablist"
            aria-label="Filtrar galeria por categoria"
            className="flex flex-wrap items-center gap-1 rounded-xl border border-[#0B3D91]/12 bg-white p-1 shrink-0 sm:flex-nowrap"
          >
            {GALLERY_CATEGORIES.map((category) => {
              const isActive = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => handleCategoryChange(category)}
                  className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    isActive
                      ? 'bg-[#0B3D91] text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-[#0B3D91]'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Responsive Photo Grid */}
        <div
          data-testid="gallery-grid"
          className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {visiblePhotos.map((photo, index) => (
            <ResilientGalleryThumb
              key={photo.id}
              photo={photo}
              onClick={() => setLightboxIndex(index)}
            />
          ))}
        </div>
      </div>

      {/* Accessible Lightbox Modal */}
      {activePhoto && lightboxIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={activePhoto.title}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#061C47]/92 p-4 sm:p-6"
          onClick={() => setLightboxIndex(null)}
        >
          <div
            className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-white/15 bg-[#072760] text-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/10 px-5 py-3.5">
              <div className="min-w-0">
                <p className="text-xs font-medium text-[#E5C765]">
                  {activePhoto.category}{' '}
                  <span className="font-mono text-white/60 tabular-nums">
                    · {lightboxIndex + 1} / {visiblePhotos.length}
                  </span>
                </p>
                <h3 className="truncate font-display text-base font-bold text-white sm:text-lg">
                  {activePhoto.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setLightboxIndex(null)}
                aria-label="Fechar visualização da foto"
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/15 text-white transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-[#041330] p-3 sm:p-5">
              <img
                src={activePhoto.src}
                alt={activePhoto.alt}
                referrerPolicy="no-referrer"
                className="max-h-[65vh] w-auto max-w-full rounded-lg object-contain"
              />

              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((prev) =>
                    prev === null ? null : stepLightboxIndex(prev, -1, visiblePhotos.length),
                  )
                }
                aria-label="Foto anterior"
                className="absolute left-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#061C47]/85 text-white transition-colors hover:border-[#D4AF37] hover:bg-[#0B3D91] focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                onClick={() =>
                  setLightboxIndex((prev) =>
                    prev === null ? null : stepLightboxIndex(prev, 1, visiblePhotos.length),
                  )
                }
                aria-label="Próxima foto"
                className="absolute right-3 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-[#061C47]/85 text-white transition-colors hover:border-[#D4AF37] hover:bg-[#0B3D91] focus-visible:outline-2 focus-visible:outline-[#D4AF37]"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <div className="border-t border-white/10 px-5 py-3.5 text-sm text-slate-200">
              {activePhoto.description}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
