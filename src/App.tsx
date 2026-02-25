import React, { useEffect, useMemo, useRef, useState } from "react";

function StarsSVGFixed({ scrollY }: { scrollY: number }) {
  const { w, h } = useWindowSize();
  const area = Math.max(1, w * h);
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
      far: mk(220, 0.06, 0.14),
      mid: mk(160, 0.1, 0.22),
      near: mk(100, 0.14, 0.32),
    };
  }, [density]);

  const isMobile = w < 640;
  const pFar = -scrollY * (isMobile ? 0.1 : 0.14);
  const pMid = -scrollY * (isMobile ? 0.18 : 0.24);
  const pNear = -scrollY * (isMobile ? 0.28 : 0.38);

  return (
    <svg
      className="fixed inset-0 -z-10 pointer-events-none"
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid slice"
    >
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
    return () => m.removeEventListener?.("change", update) ?? m.removeListener(update as any);
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

  const moveT = vh ? Math.min(1, scrollY / (vh * 0.18)) : 0;

  const y0 = isMobile ? vh * 0.5 : vh * 0.26;
  const y1 = isMobile ? vh * 0.52 : vh * 0.44;
  const y = y0 + (y1 - y0) * moveT;

  const W = isMobile ? Math.min(vw - 25, 620) : Math.min(vw - 80, 900);

  const fadeStart = vh * 0.06;
  const fadeEnd = vh * 0.55;
  const fadeT = smoothstep(fadeStart, fadeEnd, scrollY);
  const opacity = 1 - fadeT;

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
          viewBox="-80 0 1160 420"
          preserveAspectRatio="xMidYMid meet"
          style={{
            fontFamily: "Genty, system-ui, sans-serif",
            display: "block",
            overflow: "visible",
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
            <textPath
              xlinkHref="#titleArc"
              startOffset={isMobile ? "16%" : "20%"}
              dominantBaseline="middle"
              textLength={isMobile ? 680 : 600}
            >
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

  const HIDE_AT = vh * 0.1;
  const t = vh ? Math.min(1, scrollY / HIDE_AT) : 0;
  const hideBig = scrollY > HIDE_AT;

  const SIZE_START = isMobile ? 190 : isTablet ? 240 : 300;
  const SIZE_END = isMobile ? 52 : 64;

  const xSeat = vw / 2 - SIZE_START / 2;

  const [moonTop, setMoonTop] = useState<number | null>(null);
  useEffect(() => {
    const el = moonRef.current;
    if (!el) return;

    let raf = 0;

    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        setMoonTop(r.top);
      });
    };

    // mede ao montar + após 1 frame
    measure();

    // mede quando a imagem realmente carrega (resolve o “primeiro load”)
    if (!el.complete) {
      el.addEventListener("load", measure, { once: true });
    }

    window.addEventListener("resize", measure);
    // (scroll aqui é opcional; a lua está absolute -> o top muda com scroll,
    // mas a tua lógica já assume viewport coords)
    window.addEventListener("scroll", measure, { passive: true } as any);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("load", measure as any);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure as any);
    };
  }, [moonRef]);
  useEffect(() => {
    const update = () => {
      const el = moonRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setMoonTop(r.top);
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, { passive: true } as any);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update as any);
    };
  }, [moonRef]);

  const SEAT_FACTOR = isMobile ? 0.62 : 0.58;

  const ySeat =
    moonTop != null
      ? moonTop - SIZE_START * SEAT_FACTOR
      : vh * (isMobile ? 0.8 : 0.7) - SIZE_START * SEAT_FACTOR;

  const xCorner = 16;
  const yCorner = 10;

  return (
    <>
      {!hideBig && (
        <a
          href="/sobre"
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
      <nav
        className="tcm-root fixed left-1/2 -translate-x-1/2 z-[500] safe-top"
        style={{ fontFamily: "Gliker, system-ui, sans-serif" }}
        aria-label="Navegação principal"
      >
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
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </nav>

      <div className={`tcm-drawer ${open ? "open" : ""}`} id="tcm-drawer">
        <button className="tcm-backdrop" aria-label="Fechar menu" onClick={() => setOpen(false)} />
        <div className="tcm-panel" role="dialog" aria-modal="true">
          <ul className="tcm-list" role="menu">
            {items.map((it) => (
              <li key={it.label} role="none">
                <a
                  role="menuitem"
                  href={it.href}
                  onClick={() => setOpen(false)}
                  style={{ fontFamily: "Gliker, system-ui, sans-serif", color: "white" }}
                >
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

  // 🔊 áudio (começa muted, botão desmuta)
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(true);

  const toggleAudio = async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      if (v.muted) {
        v.muted = false;
        v.volume = 1;
        await v.play();
      } else {
        v.muted = true;
      }
      setMuted(v.muted);
    } catch {
      // iOS pode bloquear; mantém muted
      v.muted = true;
      setMuted(true);
    }
  };

  // ✅ Fade-in quando o "centro da lua" entra no viewport
  useEffect(() => {
    const moonEl = moonRef.current;
    if (!moonEl) return;

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
            transition:
              "opacity 650ms cubic-bezier(.22,.61,.36,1), transform 650ms cubic-bezier(.22,.61,.36,1)",
            position: "relative",
          }}
        >
          {/* botão som */}
          <button
            type="button"
            onClick={toggleAudio}
            aria-pressed={!muted}
            aria-label={muted ? "Ativar som do vídeo" : "Silenciar vídeo"}
            style={{
              position: "absolute",
              zIndex: 5,
              right: 14,
              top: 14,
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 12px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,.22)",
              background: "rgba(0,0,0,.35)",
              backdropFilter: "blur(8px)",
              color: "white",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 650,
            }}
          >
            {muted ? "🔇 Som" : "🔊 Som"}
          </button>

          <div style={{ position: "relative", width: "100%", aspectRatio: ratio }}>
            <video
              ref={videoRef}
              key={src}
              src={src}
              autoPlay
              muted={muted}
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


function MiniAgenda() {
  const items = [
    { date: "13 Fev", time: "10h30", city: "Praia (CV)", title: "Try Out", status: "Encerrado" },
    { date: "6 Mar", time: "19h00", city: "Lisboa", title: "Try Out", status: "Encerrado" },
    { date: "21–22 Mar", time: "16h00", city: "Lisboa", title: "Estreia — Teatro do Bairro", status: "Em breve" },
    { date: "28 Mar", time: "16h00", city: "Águeda", title: "Espetáculo — Festival Kontornu", status: "Em breve" },
    { date: "5 Jun", time: "10h30 & 14h30", city: "Braga", title: "Theatro Circo (Escolas)", status: "Escolas" },
    { date: "6 Jun", time: "11h30", city: "Braga", title: "Theatro Circo (Público)", status: "Em breve" },
    { date: "6 Jun", time: "15h00", city: "Braga", title: "Oficina", status: "Em breve" },
  ];

  return (
    <section
      className="w-full"
      style={{ fontFamily: "Gliker, system-ui, sans-serif", color: "white", padding: "clamp(18px, 5vh, 56px) 0" }}
    >
      <div className="container">
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
          <h2 style={{ fontSize: "clamp(18px, 2.2vw, 26px)", margin: 0 }}>Agenda</h2>
          <a href="/shows" style={{ opacity: 0.9, fontSize: 14 }}>
            Ver tudo →
          </a>
        </div>

        <div
          style={{
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,.18)",
            background: "rgba(255,255,255,.03)",
            backdropFilter: "blur(8px)",
            overflow: "hidden",
          }}
        >
          {items.map((it, i) => (
            <div
              key={i}
              style={{
                display: "grid",
                gridTemplateColumns: "110px 1fr",
                gap: 14,
                padding: "14px 16px",
                borderTop: i ? "1px solid rgba(255,255,255,.10)" : "none",
              }}
            >
              <div style={{ opacity: 0.95 }}>
                <div style={{ fontWeight: 700 }}>{it.date}</div>
                <div style={{ fontSize: 12, opacity: 0.85 }}>{it.time}</div>
                <div style={{ fontSize: 12, opacity: 0.75 }}>{it.city}</div>
              </div>

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                <div style={{ fontWeight: 650 }}>{it.title}</div>
                {it.status ? (
                  <span
                    style={{
                      fontSize: 12,
                      padding: "6px 10px",
                      borderRadius: 999,
                      border: "1px solid rgba(255,255,255,.22)",
                      background: "rgba(255,255,255,.06)",
                      whiteSpace: "nowrap",
                      opacity: 0.9,
                    }}
                  >
                    {it.status}
                  </span>
                ) : null}
              </div>
            </div>
          ))}
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
  const progress = useMemo(() => (viewportH > 0 ? Math.min(1, scrollY / (viewportH * 1.5)) : 0), [scrollY, viewportH]);

  const { w: vw, h: vh } = useWindowSize();
  const isMobile = vw < 640;
  const isTablet = vw >= 640 && vw < 1024;
  const motion = prefersReducedMotion ? 0 : 1;

  const entry = useEntryProgress(prefersReducedMotion ? 1 : 0, 1200);
  const entryX = (1 - entry) * (vw * (isMobile ? 0.45 : 0.65) + 200);
  const entryOpacity = Math.min(1, entry * 1.2);

  const EARTH_RX = isMobile ? 0.26 : isTablet ? 0.32 : 0.38;
  const EARTH_RY = isMobile ? -0.18 : isTablet ? -0.22 : -0.28;
  const EARTH_ARC = Math.PI * (isMobile ? 1.2 : 1.6);
  const EARTH_SCALE_DELTA = isMobile ? 0.12 : 0.18;

  const angle = progress * EARTH_ARC * motion;
  const orbitTx = Math.cos(angle) * (vw * EARTH_RX);
  const orbitTy = Math.sin(angle) * (vh * EARTH_RY);
  const earthScale = 1 + EARTH_SCALE_DELTA * progress * motion;

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
        <img
          aria-hidden
          src="/images/earth.svg"
          alt=""
          className="absolute left-1/2 top-1/2 pointer-events-none select-none"
          style={{
            transform: `translate(-50%, -50%) translate(${entryX + orbitTx + EARTH_PUSH_RIGHT}px, ${orbitTy}px) scale(${earthScale})`,
            opacity: entryOpacity,
            willChange: "transform, opacity",
            height: "clamp(180px, 36vh, 520px)",
            width: "auto",
            filter: "drop-shadow(0 0 24px rgba(88,180,255,.35))",
          }}
        />

        <img
          ref={moonRef}
          src="/images/moon.webp"
          alt="Moon surface"
          className="absolute bottom-0 left-1/2 select-none"
          style={{
            transform: `translate(-50%, ${MOON_PUSH_DOWN})`,
            width: "clamp(560px, 90vw, 1200px)",
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

      <section
        id="mission"
        className="px-4 sm:px-6 py-20 sm:py-24 md:py-32 bg-gradient-to-b from-black to-[#060a12] relative"
      >
        {/* content later */}
      </section>

      <PromoVideo moonRef={moonRef} />
      <MiniAgenda />

      <section className="w-full" style={{ fontFamily: "Gliker, system-ui, sans-serif", color: "white" }}>
        <div className="container">
          <div
            style={{
              marginTop: 14,
              padding: "14px 16px",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,.14)",
              background: "rgba(255,255,255,.03)",
              backdropFilter: "blur(8px)",
              lineHeight: 1.5,
            }}
          >
            <p style={{ margin: 0, fontSize: "clamp(14px, 1.2vw, 16px)", opacity: 0.92 }}>
              <strong>BULUKU</strong>, um espetáculo criado e interpretado por <strong>Djam Neguin</strong>. Produção{" "}
              <strong>ACCCA — Companhia Clara Andermatt</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* <FeatureCards /> */}
      {/* <div aria-hidden className="h-[320px]" /> */}
    </div>
  );
}