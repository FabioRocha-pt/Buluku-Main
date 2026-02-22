import React, { useEffect, useMemo, useRef, useState } from "react";

function useHasScrolled(px = 40) {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => {
      if (!scrolled && (window.scrollY || window.pageYOffset) > px) setScrolled(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true } as any);
    onScroll(); // in case you're already past the threshold
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrolled, px]);
  return scrolled;
}

function useRevealOnScroll(
  delayMs = 0,
  opts?: { threshold?: number; rootMargin?: string; enabled?: boolean }
) {
  const { threshold = 0.5, rootMargin = "0px 0px -25% 0px", enabled = true } = opts || {};
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    if (!enabled) return;             // don’t observe yet
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const t = setTimeout(() => setShow(true), delayMs);
          obs.unobserve(entry.target);
          return () => clearTimeout(t);
        }
      },
      { threshold, rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delayMs, enabled, threshold, rootMargin]);

  return { ref, show };
}



function StarsSVGFixed({ scrollY }: { scrollY: number }) {
  const { w, h } = useWindowSize();
  const area = Math.max(1, w * h);
  // scale star count by screen area (baseline ≈ 1440x900)
  const density = Math.max(0.6, Math.min(1.25, area / (1440 * 900)));

  const stars = useMemo(() => {
    const rng = makeRng(1337);
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
  }, [density]);

  // gentler drift on phones so it doesn’t jitter
  const isMobile = w < 640;
  const pFar  = -scrollY * (isMobile ? 0.10 : 0.14);
  const pMid  = -scrollY * (isMobile ? 0.18 : 0.24);
  const pNear = -scrollY * (isMobile ? 0.28 : 0.38);

  return (
    <svg className="fixed inset-0 -z-10 pointer-events-none"
         width="100%" height="100%"
         viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
      <g transform={`translate(0 ${(pFar  / Math.max(1,h)) * 100})`}>
        {stars.far.map((s, i) => (
          <circle key={`f${i}`} cx={s.x} cy={s.y} r={s.r} fill="white" opacity="0.7">
            <animate attributeName="opacity" values="0.4;0.9;0.4" dur={`${s.dur}s`} begin={`${s.delay}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </g>
      <g transform={`translate(0 ${(pMid  / Math.max(1,h)) * 100})`}>
        {stars.mid.map((s, i) => (
          <circle key={`m${i}`} cx={s.x} cy={s.y} r={s.r} fill="white" opacity="0.85">
            <animate attributeName="opacity" values="0.5;1;0.5" dur={`${s.dur}s`} begin={`${s.delay}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </g>
      <g transform={`translate(0 ${(pNear / Math.max(1,h)) * 100})`}>
        {stars.near.map((s, i) => (
          <circle key={`n${i}`} cx={s.x} cy={s.y} r={s.r} fill="white" opacity="0.95">
            <animate attributeName="opacity" values="0.6;1;0.6" dur={`${s.dur}s`} begin={`${s.delay}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </g>
    </svg>
  );
}


/* --- Hooks + helpers --- */
function useScroll(onFrame: (p: { y: number }) => void, deps: any[] = []) {
  const ticking = useRef(false);
  useEffect(() => {
    const handle = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(() => {
          onFrame({ y: window.scrollY || window.pageYOffset });
          ticking.current = false;
        });
      }
    };
    window.addEventListener("scroll", handle, { passive: true } as any);
    handle();
    return () => window.removeEventListener("scroll", handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
function useViewportHeight() {
  const [h, setH] = useState<number>(typeof window === "undefined" ? 0 : window.innerHeight);
  useEffect(() => {
    const r = () => setH(window.innerHeight);
    window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  }, []);
  return h;
}
function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefers(!!m.matches);
    update();
    m.addEventListener?.("change", update) ?? m.addListener(update as any);
    return () =>
      m.removeEventListener?.("change", update) ?? m.removeListener(update as any);
  }, []);
  return prefers;
}
function useEntryProgress(startAt = 0, durationMs = 1200) {
  const [p, setP] = useState(startAt);
  useEffect(() => {
    if (startAt >= 1) {
      setP(1);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const loop = () => {
      const t = (performance.now() - t0) / durationMs;
      setP(Math.min(1, easeOutCubic(Math.max(0, t))));
      if (t < 1) raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [startAt, durationMs]);
  return p;
}
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
function makeRng(seed: number) {
  let t = seed >>> 0;
  return () => {
    t ^= t << 13;
    t ^= t >>> 17;
    t ^= t << 5;
    return (t >>> 0) / 4294967296;
  };
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

function TitleMorph({ scrollY }: { scrollY: number }) {
  const { w: vw, h: vh } = useWindowSize();
  const isMobile = vw < 640;

  // posição (igual ao que tinhas)
  const moveT = vh ? Math.min(1, scrollY / (vh * 0.18)) : 0;

  const y0 = isMobile ? vh * 0.50: vh * 0.26;
  const y1 = isMobile ? vh * 0.52 : vh * 0.44;
  const y = y0 + (y1 - y0) * moveT;

  const W = isMobile ? Math.min(vw - 25, 620) : Math.min(vw - 80, 900);

  // ✅ FADE até "à lua"
  // começa a desaparecer ligeiramente após iniciar scroll
  const fadeStart = vh * 0.06;  // 6vh
  // desaparece completamente perto da lua (ajusta se quiseres)
  const fadeEnd   = vh * 0.55;  // 55vh  (experimentar 0.50–0.70)
  const fadeT = smoothstep(fadeStart, fadeEnd, scrollY);
  const opacity = 1 - fadeT;

  // ✅ quando já está invisível, remove do DOM (garante que “desaparece” mesmo)
  if (opacity <= 0.01) return null;

  return (
    <div
      className="fixed left-0 top-0 w-screen pointer-events-none"
      style={{ zIndex: 520, opacity, transition: "opacity 60ms linear" }}
    >
      <div
        className="mx-auto flex justify-center"
        style={{
          transform: `translateY(${y}px)`,
          width: "100%",
          paddingInline: isMobile ? 12 : 24,
        }}
      >
        <svg
          width={W}
          viewBox="-80 0 1160 420"   // ✅ mais espaço à esquerda e direita
          preserveAspectRatio="xMidYMid meet"
          style={{
            fontFamily: "Genty, system-ui, sans-serif",
            display: "block",        // ✅ ajuda no Safari
            overflow: "visible",     // ok, mas o principal é o viewBox maior
          }}
        >
          <defs>
            <path id="titleArc" d="M 60 320 C 220 60, 780 60, 940 320" />
            <linearGradient id="yg" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor="#FFE36A" />
              <stop offset="45%" stopColor="#FBBF24" />
              <stop offset="100%" stopColor="#FB923C" />
            </linearGradient>
          </defs>

          <text
            fontSize={isMobile ? 190 : 170}
            fontWeight="400"
            fill="url(#yg)"
            style={{ letterSpacing: "-10px" }}
          >
            <textPath xlinkHref="#titleArc" startOffset={isMobile ? "16%" : "20%"} dominantBaseline="middle" textLength={isMobile ? 680 : 600} >
              Buluku
            </textPath>
          </text>
        </svg>
      </div>
    </div>
  );
}
function LogoMorph({
  scrollY,
  moonRef,
}: {
  scrollY: number;
  moonRef: React.RefObject<HTMLImageElement | null>;
}) {
  const { w: vw, h: vh } = useWindowSize();
  const isMobile = vw < 640;
  const isTablet = vw >= 640 && vw < 1024;

  const entry = useEntryProgress(0, 800);
  const entryOpacity = 0.2 + 0.8 * entry;

  const HIDE_AT = vh * 0.10;
  const t = vh ? Math.min(1, scrollY / HIDE_AT) : 0;
  const hideBig = scrollY > HIDE_AT;

  const SIZE_START = isMobile ? 190 : isTablet ? 240 : 300;
  const SIZE_END = isMobile ? 52 : 64;

  const xSeat = vw / 2 - SIZE_START / 2;

  // ✅ SNAP AO TOPO DA LUA (real position)
  const [moonTop, setMoonTop] = useState<number | null>(null);

  useEffect(() => {
    const update = () => {
      const el = moonRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setMoonTop(r.top); // topo real no viewport
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true } as any);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update as any);
    };
  }, [moonRef]);

  // quanto do boneco "entra" na lua (ajusta a gosto)
  const SEAT_FACTOR = isMobile ? 0.62 : 0.58;

  // se ainda não temos moonTop (primeiro render), fallback para vh
  const ySeat =
    moonTop != null
      ? moonTop - SIZE_START * SEAT_FACTOR
      : (vh * (isMobile ? 0.80 : 0.70)) - (SIZE_START * SEAT_FACTOR);

  const xCorner = 16;
  const yCorner = 10;

  return (
    <>
      {!hideBig && (
        <a
          href="/"
          aria-label="Buluku — voltar à Home"
          className="fixed z-[420] select-none"
          style={{
            top: 0,
            left: 0,
            transform: `translate(${xSeat}px, ${ySeat}px)`,
            pointerEvents: "auto",
            cursor: "pointer",
            opacity: entryOpacity * (1 - t),
            transition: "opacity 220ms ease-out",
          }}
        >
          <img
            src="/images/logo.png"
            alt="Buluku logo seated"
            style={{
              width: SIZE_START,
              height: "auto",
              filter: "drop-shadow(0 0 26px rgba(255,255,255,.35))",
              display: "block",
            }}
          />
        </a>
      )}

      <a
        href="/"
        aria-label="Buluku — voltar à Home"
        className="fixed z-[421] select-none"
        style={{
          top: 0,
          left: 0,
          transform: `translate(${xCorner}px, ${yCorner}px)`,
          pointerEvents: scrollY > HIDE_AT ? "auto" : "none",
          cursor: "pointer",
          opacity: scrollY > HIDE_AT ? 1 : 0,
          transition: "opacity 220ms ease-out",
        }}
      >
        <img
          src="/images/logo.png"
          alt="Buluku logo docked"
          style={{
            width: SIZE_END,
            height: "auto",
            filter: "drop-shadow(0 0 12px rgba(255,255,255,.25))",
            display: "block",
          }}
        />
      </a>
    </>
  );
}


function TopCenterMenu() {
  const items = [
    { label: "Sobre", href: "/sobre" },
    { label: "Shows", href: "/shows" },
    { label: "Galeria & Press", href: "/galeria" },
    { label: "Contactos", href: "/contactos" },
  ];

  const [open, setOpen] = React.useState(false);

  // Acessibilidade: ESC fecha; ao subir p/ desktop também fecha
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 768 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      {/* NAV container fixo no topo */}
      <nav
        className="tcm-root fixed left-1/2 -translate-x-1/2 z-[500] safe-top"
        style={{ fontFamily: "Gliker, system-ui, sans-serif" }}
        aria-label="Navegação principal"
      >
        {/* Desktop: lista centrada */}
        <ul className="tcm-desktop topmenu flex items-center justify-center gap-6 sm:gap-10 lg:gap-14 text-base sm:text-xl lg:text-2xl">
          {items.map((it) => (
            <li key={it.label} className="inline-block">
              <a
                href={it.href}
                className="px-3 py-1 hover:opacity-80 active:opacity-70 transition
                           focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70 rounded-md"
                
              >
                {it.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Mobile: só hambúrguer */}
        <button
          type="button"
          className="tcm-burger"
          aria-label="Abrir menu"
          aria-controls="tcm-drawer"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {!open ? (
            <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </button>
      </nav>

      {/* Drawer mobile */}
      <div className={`tcm-drawer ${open ? "open" : ""}`} id="tcm-drawer">
        <button className="tcm-backdrop" aria-label="Fechar menu" onClick={() => setOpen(false)} />
        <div className="tcm-panel" role="dialog" aria-modal="true">
          <ul className="tcm-list" role="menu">
            {items.map((it) => (
              <li key={it.label} role="none">
                <a role="menuitem" href={it.href} onClick={() => setOpen(false)} style={{ fontFamily: "Gliker, system-ui, sans-serif", color: "white" }}>
                  {it.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="tcm-foot">© Buluku</div>
        </div>
      </div>
    </>
  );
}
function PromoVideo({ moonRef }: { moonRef: React.RefObject<HTMLImageElement | null> }) {
  const { w } = useWindowSize();
  const isMobile = w < 640;

  const src = isMobile ? "/videos/promomobile.mp4" : "/videos/promo.mp4";
  const ratio = isMobile ? "9 / 16" : "16 / 9";

  const [show, setShow] = useState(false);

  // ✅ Fade-in quando o "centro da lua" entra no viewport
  useEffect(() => {
    const moonEl = moonRef.current;
    if (!moonEl) return;

    // cria um sentinel invisível no centro da lua (posição absoluta no body)
    const sentinel = document.createElement("div");
    sentinel.setAttribute("data-moon-sentinel", "1");
    sentinel.style.position = "absolute";
    sentinel.style.width = "1px";
    sentinel.style.height = "1px";
    sentinel.style.pointerEvents = "none";
    sentinel.style.opacity = "0";

    document.body.appendChild(sentinel);

    const placeSentinel = () => {
      const r = moonEl.getBoundingClientRect();
      const docY = window.scrollY || window.pageYOffset;

      // centro da lua no documento
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2 + docY;

      sentinel.style.left = `${cx}px`;
      sentinel.style.top = `${cy}px`;
    };

    placeSentinel();
    window.addEventListener("resize", placeSentinel);
    window.addEventListener("scroll", placeSentinel, { passive: true } as any);

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShow(true);
      },
      {
        threshold: 0.15,
        // faz trigger quando o ponto chega perto do centro do ecrã
        rootMargin: "-40% 0px -40% 0px",
      }
    );

    obs.observe(sentinel);

    return () => {
      obs.disconnect();
      window.removeEventListener("resize", placeSentinel);
      window.removeEventListener("scroll", placeSentinel as any);
      sentinel.remove();
    };
  }, [moonRef]);

  return (
    <section
      id="promo"
      className="w-full"
      style={{
        fontFamily: "Gliker, system-ui, sans-serif",
        color: "white",
        paddingTop: "clamp(18px, 5vh, 56px)",
        paddingBottom: "clamp(18px, 5vh, 56px)",
      }}
    >
      <div className="w-full px-3 sm:px-6">
        <div
          className="mx-auto overflow-hidden rounded-[24px]"
          style={{
            maxWidth: isMobile ? "520px" : "100%",
            background: "rgba(255,255,255,0.03)",
            border: "2px solid rgba(255,255,255,0.70)",
            boxShadow: "0 0 26px rgba(255,255,255,0.28)",
            backdropFilter: "blur(8px)",
            opacity: show ? 1 : 0,
            transform: show ? "translateY(0)" : "translateY(18px)",
            transition: "opacity 650ms cubic-bezier(.22,.61,.36,1), transform 650ms cubic-bezier(.22,.61,.36,1)",
          }}
        >
          <div style={{ position: "relative", width: "100%", aspectRatio: ratio }}>
            <video
              key={src}
              src={src}
              autoPlay
              muted
              playsInline
              loop
              preload="auto"
              controls={false}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCards() {
  const cards = [
    {
      title: "🚀🌍 Buluku – o Afronauta",
      desc:
        "Buluku mora em Oba Txon, uma incrível cidade africana que flutua no céu! Junto com os androids Kandjila e Zuri, ele viaja pelo espaço à procura de planetas mágicos e cheios de vida.",
      href: "/sobre",
      videoSrc: "/videos/video-desc1.mp4",
      poster: "/images/poster-desc1.jpg",
    },
    {
      title: "Sobre o que é o Show?",
      desc:
        "Performance lúdica com tema espacial, que combina música, teatro, dança e interação com o público.",
      href: "/shows",
      videoSrc: "/videos/video-desc2.mp4",
    },
    {
      title: "Próximas Datas",
      desc:
        "👉 Try Out – 27 de Outubro.",
     
      videoSrc: "/videos/video-desc3.mp4",
    },
  ];

  return (
<section
  id="projects"
  // push the entire section further down the page
  className="mt-[48vh] sm:mt-[52vh] lg:mt-[60vh]"
  style={{ fontFamily: "Gliker, system-ui, sans-serif", color: "white" }}
>
  {/* make the section tall and anchor the row to the bottom */}
  <div className="container min-h-[50vh] flex items-end">
+   <div className="cards-grid w-full">
  {cards.map((c, i) => {
    const allow = useHasScrolled(40);
    const { ref, show } = useRevealOnScroll(i * 140, {
      enabled: allow,
      threshold: 0.5,
      rootMargin: "0px 0px -25% 0px",
    });

    return (
      <div key={c.title} ref={ref} className={`reveal-card ${show ? "show" : ""} projects-card`}>
        <a
          href={c.href}
          className="group block rounded-[24px] overflow-hidden
+            bg-white/[0.03] backdrop-blur-sm ring-2 ring-white/70
+            shadow-[0_0_26px_rgba(255,255,255,0.28)]
+            hover:shadow-[0_0_42px_rgba(255,255,255,0.45)]
+            transition-all duration-300 hover:-translate-y-1 text-white"
        >
          {/* VIDEO BAND */}
          <div className="w-full overflow-hidden" style={{ aspectRatio: "16 / 9" }}>
            <video
              className="w-full h-full object-cover"
              src={c.videoSrc}
              poster={c.poster}
              muted
              loop
              autoPlay
              playsInline
              preload="metadata"
            />
          </div>

          <div className="min-h-[260px] px-8 pt-12 pb-8 flex flex-col items-center justify-center text-center">
            <h3 className="text-2xl md:text-[26px] leading-snug mb-3 md:mb-4 text-white mx-auto max-w-[300px]">
              {c.title}
            </h3>

            <p className="text-white/90 leading-relaxed text-[15px] mx-auto max-w-[320px]">
              {c.desc}
            </p>

            <span className="inline-flex items-center gap-2 mt-6 text-white font-semibold">
              Saber +
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  className="translate-x-0 group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14M13 5l7 7-7 7"
                      stroke="currentColor" strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </div>

        </a>
      </div>
    );
  })}
</div>
  </div>
</section>

);
}


/* --- MAIN APP --- */
export default function App() {
  const moonRef = useRef<HTMLImageElement | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const prefersReducedMotion = usePrefersReducedMotion();
  useScroll(({ y }) => setScrollY(y), []);

  const viewportH = useViewportHeight();
  const progress = useMemo(
    () => (viewportH > 0 ? Math.min(1, scrollY / (viewportH * 1.5)) : 0),
    [scrollY, viewportH]
  );

  const { w: vw, h: vh } = useWindowSize();
  const isMobile = vw < 640;
  const isTablet = vw >= 640 && vw < 1024;
  const motion = prefersReducedMotion ? 0 : 1;
  // Earth entry + orbit (responsive)
  const entry = useEntryProgress(prefersReducedMotion ? 1 : 0, 1200);
  const entryX = (1 - entry) * (vw * (isMobile ? 0.45 : 0.65) + 200);
  const entryOpacity = Math.min(1, entry * 1.2);

  const EARTH_RX = isMobile ? 0.26 : isTablet ? 0.32 : 0.38;
  const EARTH_RY = isMobile ? -0.18 : isTablet ? -0.22 : -0.28;
  const EARTH_ARC = Math.PI * (isMobile ? 1.2 : 1.6);
  const EARTH_SCALE_DELTA = isMobile ? 0.12 : 0.18;

  const angle = (progress * EARTH_ARC) * motion;
  const orbitTx = Math.cos(angle) * (vw * EARTH_RX);
  const orbitTy = Math.sin(angle) * (vh * EARTH_RY);
  const earthScale = 1 + (EARTH_SCALE_DELTA * progress * motion);

  // Moon
  const MOON_PUSH_DOWN = isMobile ? "95%" : "58%";
  const moonOpacity = 1 - progress;
  const moonFadeOpacity = progress * 0.9;
  
  const EARTH_PUSH_RIGHT = isMobile ? vw * 0.28 : 0;

  return (
    <div className="min-h-[200vh] text-white bg-black">
      <TitleMorph scrollY={scrollY} />
      <StarsSVGFixed scrollY={scrollY} />
      <LogoMorph scrollY={scrollY} moonRef={moonRef} />
      <TopCenterMenu />

      <section id="top" className="h-[100svh] overflow-x-hidden overflow-y-visible">
        {/* EARTH */}
        <img
          aria-hidden
          src="/images/earth.svg"
          alt=""
          className="absolute left-1/2 top-1/2 pointer-events-none select-none"
          style={{
            transform: `translate(-50%, -50%) translate(${entryX + orbitTx + EARTH_PUSH_RIGHT}px, ${orbitTy}px) scale(${earthScale})`,
            opacity: entryOpacity,
            willChange: "transform, opacity",
            height: 'clamp(180px, 36vh, 520px)',
            width: "auto",
            filter: "drop-shadow(0 0 24px rgba(88,180,255,.35))",
          }}
        />

        {/* MOON */}
        <img
        ref={moonRef}
        src="/images/moon.webp"
        alt="Moon surface"
        className="absolute bottom-0 left-1/2 select-none"
        style={{
          transform: `translate(-50%, ${MOON_PUSH_DOWN})`,
          width: "clamp(560px, 90vw, 1200px)",          // ou: width: 'clamp(560px, 90vw, 1200px)'
          height: "auto",
          opacity: moonOpacity,
          filter: "brightness(0.95) contrast(1.05)",
          willChange: "opacity",
        }}
      />
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 22%, rgba(0,0,0,0.6) 40%, rgba(0,0,0,0) 70%)",
            opacity: moonFadeOpacity,
            transition: "opacity 0.1s linear",
            willChange: "opacity",
          }}
        />

      </section>

      <section id="mission" className="px-4 sm:px-6 py-20 sm:py-24 md:py-32 bg-gradient-to-b from-black to-[#060a12] relative">
        {/* content later */}
      </section>
      <PromoVideo moonRef={moonRef} />
      {/* give some extra scroll room so you can actually reach the sentinel */}
<div aria-hidden className="h-[320px]" />

{/* the sentinel that triggers the footer slide-up */}

{/* footer that slides up when the sentinel hits the viewport */}

    </div>
  );
}
