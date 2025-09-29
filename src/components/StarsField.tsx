// src/components/StarsField.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";

type StarsFieldProps = {
  /** Se já controlas o scrollY na página, passa-o aqui. Caso contrário o componente escuta o scroll por si. */
  scrollY?: number;
  /** Semente para gerar constelações diferentes entre páginas (opcional). */
  seed?: number;
  /** Velocidades base do parallax (podes afinar por página). */
  speeds?: { far?: number; mid?: number; near?: number };
  /** Extra classes/styles (ex.: para mudar z-index). */
  className?: string;
  style?: React.CSSProperties;
};

/** Starfield em SVG, fixo e em ecrã inteiro, com parallax + twinkle. */
export default function StarsField({
  scrollY,
  seed = 1337,
  speeds = { far: 0.14, mid: 0.24, near: 0.38 },
  className = "",
  style,
}: StarsFieldProps) {
  const { w, h } = useWindowSize();

  // densidade de estrelas escalada pela área do ecrã (baseline ~1440x900)
  const area = Math.max(1, w * h);
  const density = Math.max(0.6, Math.min(1.25, area / (1440 * 900)));

  // Se não receber scrollY, mede internamente
  const internalScrollY = useScrollY(scrollY === undefined);
  const y = scrollY ?? internalScrollY;

  // Parallax — suavizado em mobile para evitar jitter
  const isMobile = w < 640;
  const pFar  = -y * (isMobile ? speeds.far! * 0.72 : speeds.far!);
  const pMid  = -y * (isMobile ? speeds.mid! * 0.75 : speeds.mid!);
  const pNear = -y * (isMobile ? speeds.near! * 0.74 : speeds.near!);

  // Geração determinística das estrelas
  const stars = useMemo(() => {
    const rng = makeRng(seed);
    const mk = (count: number, rMin: number, rMax: number) =>
      Array.from({ length: Math.round(count * density) }).map(() => ({
        x: rng() * 100,
        y: rng() * 100,
        r: rMin + rng() * (rMax - rMin),
        delay: (rng() * 6).toFixed(2),
        dur: (3 + rng() * 5).toFixed(2),
      }));
    return {
      far:  mk(220, 0.06, 0.14),
      mid:  mk(160, 0.10, 0.22),
      near: mk(100, 0.14, 0.32),
    };
  }, [density, seed]);

  return (
    <svg
      className={`fixed inset-0 -z-10 pointer-events-none ${className}`}
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
      style={style}
    >
      {/* CAMADA LONGE */}
      <g transform={`translate(0 ${(pFar / Math.max(1, h)) * 100})`}>
        {stars.far.map((s, i) => (
          <circle key={`f${i}`} cx={s.x} cy={s.y} r={s.r} fill="white" opacity="0.7">
            <animate
              attributeName="opacity"
              values="0.4;0.9;0.4"
              dur={`${s.dur}s`}
              begin={`${s.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </g>

      {/* CAMADA MÉDIA */}
      <g transform={`translate(0 ${(pMid / Math.max(1, h)) * 100})`}>
        {stars.mid.map((s, i) => (
          <circle key={`m${i}`} cx={s.x} cy={s.y} r={s.r} fill="white" opacity="0.85">
            <animate
              attributeName="opacity"
              values="0.5;1;0.5"
              dur={`${s.dur}s`}
              begin={`${s.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </g>

      {/* CAMADA PERTO */}
      <g transform={`translate(0 ${(pNear / Math.max(1, h)) * 100})`}>
        {stars.near.map((s, i) => (
          <circle key={`n${i}`} cx={s.x} cy={s.y} r={s.r} fill="white" opacity="0.95">
            <animate
              attributeName="opacity"
              values="0.6;1;0.6"
              dur={`${s.dur}s`}
              begin={`${s.delay}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </g>
    </svg>
  );
}

/* ----------------- Helpers locais (drop-in) ----------------- */
function useWindowSize() {
  const [s, setS] = useState({
    w: typeof window === "undefined" ? 1920 : window.innerWidth,
    h: typeof window === "undefined" ? 1080 : window.innerHeight,
  });
  useEffect(() => {
    const onR = () => setS({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener("resize", onR);
    return () => window.removeEventListener("resize", onR);
  }, []);
  return s;
}

function useScrollY(enabled: boolean) {
  const [y, setY] = useState(0);
  const ticking = useRef(false);
  useEffect(() => {
    if (!enabled) return;
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        setY(window.scrollY || window.pageYOffset);
        ticking.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true } as any);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled]);
  return y;
}

function makeRng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t ^= t << 13;
    t ^= t >>> 17;
    t ^= t << 5;
    return (t >>> 0) / 4294967296;
  };
}
