import React, { useMemo, useEffect, useRef, useState } from "react";
import MenuTopBar from "../components/MenuTopBar";
import StarsField from "../components/StarsField";
import "../styles/gallery.css";

/* ========= Types ========= */
type Kind = "Buluku" | "Try-out PT" | "Try-out CV";

type Photo = {
  id: string;
  base: string;     // <-- sem extensão
  title: string;
  kind: Kind;
  date?: string;
  place?: string;
};
/* ========= Data (auto 13 por pasta) ========= */
const COUNT = 13;

const makeSet = (kind: Kind, folder: string) =>
  Array.from({ length: COUNT }, (_, i) => {
    const n = i + 1;
    const date = kind === "Try-out PT" ? "Brevemente" : undefined;

    return {
      id: `${folder}-${n}`,
      base: `/images/gallery/${folder}/${n}`, // <-- sem extensão
      title: `${kind} #${n}`,
      kind,
      date,
    } satisfies Photo;
  });
function ImgWithFallback({
  base,
  alt,
  onResolvedSrc,
}: {
  base: string;
  alt: string;
  onResolvedSrc?: (src: string) => void;
}) {
  const exts = ["png", "JPG", "jpg"];
  const [idx, setIdx] = React.useState(0);

  const src = `${base}.${exts[idx]}`;

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onLoad={(e) => {
        e.currentTarget.setAttribute("data-loaded", "true");
        onResolvedSrc?.(src); // <-- devolve a src real
      }}
      onError={() => {
        if (idx < exts.length - 1) setIdx(idx + 1);
      }}
    />
  );
}
const PHOTOS: Photo[] = [
  ...makeSet("Buluku", "Buluku"),
  ...makeSet("Try-out PT", "Try-out-PT"),
  ...makeSet("Try-out CV", "Try-out-CV"),
];

const KINDS = ["Todos", "Buluku", "Try-out PT", "Try-out CV"] as const;
type Cat = (typeof KINDS)[number];

export default function Galeria() {
  const [kind, setKind] = useState<Cat>("Todos");
  const [q, setQ] = useState("");
  const [active, setActive] = useState<null | {
    src: string;
    title: string;
    rect: { top: number; left: number; width: number; height: number };
  }>(null);

  const items = useMemo(() => {
    const byKind = kind === "Todos" ? PHOTOS : PHOTOS.filter((p) => p.kind === kind);
    const qq = q.trim().toLowerCase();
    if (!qq) return byKind;
    return byKind.filter((p) => (p.title + " " + (p.place ?? "") + " " + (p.date ?? ""))
      .toLowerCase()
      .includes(qq)
    );
  }, [kind, q]);

  // lock body scroll when lightbox open
  useEffect(() => {
    if (!active) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = orig;
    };
  }, [active]);

  // reveal cards on scroll (premium)
  const gridRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = Array.from(grid.querySelectorAll<HTMLElement>(".g-card"));
    cards.forEach((c) => c.classList.remove("in"));

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          const idx = cards.indexOf(el);
          el.style.setProperty("--delay", `${Math.max(0, idx) * 60}ms`);
          el.classList.add("in");
          obs.unobserve(el);
        });
      },
      { threshold: 0.15 }
    );

    cards.forEach((c) => obs.observe(c));
    return () => obs.disconnect();
  }, [items]);

  return (
    <main className="galeria" style={{ fontFamily: "Gliker, system-ui, sans-serif" }}>
      <StarsField speeds={{ far: 0.12, mid: 0.22, near: 0.34 }} />

      <MenuTopBar />

      <header className="g-hero">
        <div className="g-heroInner">
          <div className="g-kicker">Buluku — Galeria</div>
          <h1 className="g-title">Galeria & Press</h1>
          <p className="g-subtitle">
            Conteúdos organizados por <strong>Buluku</strong>, <strong>Try-out PT</strong> e <strong>Try-out CV</strong>.
          </p>
        </div>
      </header>

      <div className="g-container">
        <div className="g-toolbar">
          <ul className="g-cats" role="tablist" aria-label="Filtros da galeria">
            {KINDS.map((k) => (
              <li key={k}>
                <button type="button" className={k === kind ? "active" : ""} onClick={() => setKind(k)}>
                  {k}
                </button>
              </li>
            ))}
          </ul>

          <div className="g-search">
            <input
              type="search"
              placeholder="Pesquisar…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Pesquisar na galeria"
            />
          </div>
        </div>

        <section ref={gridRef} className="g-grid" aria-live="polite">
          {items.map((p, i) => {
  let resolvedSrc = "";

  return (
    <figure key={p.id} className="g-card" style={{ ["--i" as any]: i }}>
      <button
        className="g-imgLink"
        aria-label={`Ver ${p.title} ampliada`}
        onClick={(ev) => {
          const img = (ev.currentTarget as HTMLElement).querySelector("img");
          if (!img) return;

          const r = img.getBoundingClientRect();
          const srcForLightbox = resolvedSrc || img.getAttribute("src") || "";

          setActive({
            src: srcForLightbox,
            title: p.title,
            rect: { top: r.top, left: r.left, width: r.width, height: r.height },
          });
        }}
      >
        <div className="g-thumb">
          <div className="g-skeleton" aria-hidden />
          <ImgWithFallback
            base={p.base}
            alt={p.title}
            onResolvedSrc={(s) => (resolvedSrc = s)}
          />
        </div>

        {/* overlay igual */}
        <figcaption className="g-overlay">
          <div className="g-ovTop">
            <span className="g-pill">{p.kind}</span>
            {p.date ? <span className="g-date">{p.date}</span> : <span />}
          </div>

          <div className="g-ovBottom">
            <span className="g-title2">{p.title}</span>
            {p.place ? <span className="g-place">{p.place}</span> : null}
          </div>
        </figcaption>
      </button>
    </figure>
  );
})}
        </section>

        {items.length === 0 && <p className="g-empty">Sem resultados para “{q}”.</p>}
      </div>

      <Lightbox active={active} onClose={() => setActive(null)} />
    </main>
  );
}

function Lightbox({
  active,
  onClose,
}: {
  active: null | {
    src: string;
    title: string;
    rect: { top: number; left: number; width: number; height: number };
  };
  onClose: () => void;
}) {
  const [imgSize, setImgSize] = React.useState<{ w: number; h: number } | null>(null);
  const [toCenter, setToCenter] = React.useState(false);

  React.useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setToCenter(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  React.useEffect(() => {
    if (!active) return;
    const im = new Image();
    im.src = active.src;
    const done = () => setImgSize({ w: im.naturalWidth || 1600, h: im.naturalHeight || 900 });
    (im.decode?.() ?? Promise.resolve()).then(done).catch(done);
  }, [active]);

  const target = React.useMemo(() => {
    if (!active || !imgSize) return null;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const maxW = vw * 0.92;
    const maxH = vh * 0.88;

    const ratio = imgSize.w / imgSize.h;
    let tw = maxW;
    let th = tw / ratio;
    if (th > maxH) {
      th = maxH;
      tw = th * ratio;
    }
    const left = (vw - tw) / 2;
    const top = (vh - th) / 2;
    return { top, left, width: tw, height: th };
  }, [active, imgSize]);

  React.useEffect(() => {
    if (!active || !target) return;
    const id = requestAnimationFrame(() => setToCenter(true));
    return () => cancelAnimationFrame(id);
  }, [active, target]);

  if (!active) return null;

  const thumb = active.rect;
  const ghostStyle: React.CSSProperties =
    toCenter && target
      ? { top: target.top, left: target.left, width: target.width, height: target.height }
      : { top: thumb.top, left: thumb.left, width: thumb.width, height: thumb.height };

  function onGhostTransitionEnd() {
    if (!toCenter) onClose();
  }

  return (
    <div
      className="lb-root"
      role="dialog"
      aria-modal="true"
      aria-label={active.title}
      onClick={(e) => {
        if (e.target === e.currentTarget) setToCenter(false);
      }}
    >
      <div className={`lb-backdrop ${toCenter ? "show" : ""}`} />
      <img
        src={active.src}
        alt={active.title}
        className={`lb-ghost ${toCenter ? "toCenter" : "fromThumb"}`}
        style={ghostStyle}
        onTransitionEnd={onGhostTransitionEnd}
      />
      <div className={`lb-ui ${toCenter ? "on" : ""}`} onClick={(e) => e.stopPropagation()}>
        <div className="lb-caption">{active.title}</div>
        <button className="lb-close" aria-label="Fechar" onClick={() => setToCenter(false)}>
          ✕
        </button>
      </div>
    </div>
  );
}