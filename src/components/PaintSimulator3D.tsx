import { ChevronDown, ChevronUp, RotateCcw, Sun, Sunset } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import {
  LightingMood,
  mountArchitecturalRoomScene,
  RoomSceneController,
} from '../three/architecturalRoomScene';
import {
  PAINT_COLORS,
  PAINT_FINISHES,
  PaintFinishType,
} from '../three/proceduralTextures';

export function PaintSimulator3D() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<RoomSceneController | null>(null);

  const [selectedColorId, setSelectedColorId] = useState<string>(PAINT_COLORS[0].id);
  const [selectedFinish, setSelectedFinish] = useState<PaintFinishType>('acetinado');
  const [lightingMood, setLightingMood] = useState<LightingMood>('day');
  const [dockCollapsed, setDockCollapsed] = useState(false);

  const activeColor =
    PAINT_COLORS.find((c) => c.id === selectedColorId) ?? PAINT_COLORS[0];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const controller = mountArchitecturalRoomScene(
      container,
      activeColor.hex,
      selectedFinish,
      lightingMood,
    );
    controllerRef.current = controller;

    return () => {
      controller.dispose();
      controllerRef.current = null;
    };
    // Mount WebGL scene once on mount; updates happen imperatively via controllerRef
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectColor = (colorId: string, hex: string) => {
    setSelectedColorId(colorId);
    controllerRef.current?.setWallColor(hex);
  };

  const handleSelectFinish = (finish: PaintFinishType) => {
    setSelectedFinish(finish);
    controllerRef.current?.setFinish(finish);
  };

  const handleToggleMood = (mood: LightingMood) => {
    setLightingMood(mood);
    controllerRef.current?.setLightingMood(mood);
  };

  const handleResetCamera = () => {
    controllerRef.current?.resetCamera();
  };

  return (
    <section id="simulador-3d" className="scroll-mt-20 bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold text-[#8A6A12]">
              Estúdio Interativo 3D
            </p>
            <h2
              className="mt-2 font-display text-3xl font-bold tracking-tight text-[#0B3D91] sm:text-4xl"
              style={{ textWrap: 'balance' }}
            >
              Simule cores e acabamentos antes da pintura
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-600">
            Arraste para girar o ambiente 3D, teste como a luz reage ao fosco, acetinado,
            cimento queimado ou textura com cristais e escolha a paleta ideal.
          </p>
        </div>

        {/* Full-width 3D Viewport with Unified Collapsible Bottom Control Dock */}
        <div
          data-testid="paint-simulator-3d"
          data-color={activeColor.id}
          data-finish={selectedFinish}
          data-mood={lightingMood}
          className="relative mt-8 h-[520px] w-full overflow-hidden rounded-2xl border border-[#0B3D91]/15 bg-[#E8ECF4] sm:h-[580px]"
        >
          {/* Isolated WebGL canvas mount node (no React children inside) */}
          <div ref={mountRef} className="h-full w-full cursor-grab active:cursor-grabbing" />

          {/* Minimal Top-Left Readout (solid rgba surface, no backdrop-filter over WebGL) */}
          <div className="pointer-events-none absolute top-4 left-4 rounded-xl border border-[#0B3D91]/15 bg-[#061C47]/90 px-4 py-2.5 text-white">
            <div className="flex items-center gap-2.5">
              <span
                className="h-3.5 w-3.5 rounded-sm border border-white/40"
                style={{ backgroundColor: activeColor.hex }}
              />
              <span className="text-xs font-semibold">{activeColor.name}</span>
              <span aria-hidden="true" className="text-white/40">
                ·
              </span>
              <span className="text-xs text-[#E5C765]">
                {PAINT_FINISHES.find((f) => f.id === selectedFinish)?.label}
              </span>
            </div>
          </div>

          {/* Unified Collapsible Bottom Control Dock (solid/rgba surface, no backdrop-filter) */}
          <div className="pointer-events-none absolute inset-x-0 bottom-3 flex flex-col items-center px-3 sm:bottom-4">
            <button
              type="button"
              onClick={() => setDockCollapsed((prev) => !prev)}
              aria-expanded={!dockCollapsed}
              className="pointer-events-auto mb-2 inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-[#061C47]/92 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#0B3D91] whitespace-nowrap"
            >
              {dockCollapsed ? (
                <>
                  <ChevronUp className="h-3.5 w-3.5 text-[#D4AF37]" />
                  <span>Mostrar Controles</span>
                </>
              ) : (
                <>
                  <ChevronDown className="h-3.5 w-3.5 text-[#D4AF37]" />
                  <span>Ocultar Controles</span>
                </>
              )}
            </button>

            {!dockCollapsed && (
              <div className="pointer-events-auto flex w-full max-w-[1020px] flex-col gap-2.5 rounded-xl border border-white/15 bg-[#061C47]/94 px-3.5 py-2.5 text-white shadow-lg lg:flex-row lg:items-center lg:justify-between">
                {/* Color Swatches */}
                <div className="flex flex-wrap items-center gap-1.5 sm:flex-nowrap">
                  <span className="mr-1 text-xs font-medium text-slate-300">Cor:</span>
                  {PAINT_COLORS.map((color) => {
                    const isSelected = color.id === selectedColorId;
                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => handleSelectColor(color.id, color.hex)}
                        aria-label={`Cor ${color.name}`}
                        aria-pressed={isSelected}
                        title={color.name}
                        className={`h-7 w-7 shrink-0 rounded-md border-2 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] ${
                          isSelected
                            ? 'border-[#D4AF37] scale-105'
                            : 'border-white/30'
                        }`}
                        style={{ backgroundColor: color.hex }}
                      />
                    );
                  })}
                </div>

                {/* Finish Selector */}
                <div className="flex flex-wrap items-center gap-1 rounded-lg bg-white/10 p-1 sm:flex-nowrap">
                  {PAINT_FINISHES.map((finish) => {
                    const active = selectedFinish === finish.id;
                    return (
                      <button
                        key={finish.id}
                        type="button"
                        onClick={() => handleSelectFinish(finish.id)}
                        aria-pressed={active}
                        className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                          active
                            ? 'bg-[#D4AF37] text-[#061C47] font-semibold'
                            : 'text-slate-200 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        {finish.label}
                      </button>
                    );
                  })}
                </div>

                {/* Lighting & Camera */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleToggleMood('day')}
                    aria-pressed={lightingMood === 'day'}
                    aria-label="Iluminação natural de dia"
                    className={`inline-flex h-8 items-center gap-1 rounded-md px-2.5 text-xs font-medium transition-colors whitespace-nowrap ${
                      lightingMood === 'day'
                        ? 'bg-white text-[#061C47]'
                        : 'bg-white/10 text-slate-200 hover:bg-white/20'
                    }`}
                  >
                    <Sun className="h-3.5 w-3.5" />
                    <span>Dia</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleMood('warm')}
                    aria-pressed={lightingMood === 'warm'}
                    aria-label="Iluminação quente aconchegante"
                    className={`inline-flex h-8 items-center gap-1 rounded-md px-2.5 text-xs font-medium transition-colors whitespace-nowrap ${
                      lightingMood === 'warm'
                        ? 'bg-[#D4AF37] text-[#061C47]'
                        : 'bg-white/10 text-slate-200 hover:bg-white/20'
                    }`}
                  >
                    <Sunset className="h-3.5 w-3.5" />
                    <span>Quente</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetCamera}
                    aria-label="Resetar ângulo da câmera 3D"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-white/10 text-slate-200 transition-colors hover:bg-white/20 hover:text-white"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
