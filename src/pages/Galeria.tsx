import React, { useMemo, useState, useEffect } from "react";

import MenuTopBar from "../components/MenuTopBar";
import "../styles/gallery.css";
import StarsField from "../components/StarsField";

/** Ajuste estes dados às suas imagens reais em /public/images/gallery */
type Photo = {
  id: string;
  src: string;      // caminho da imagem (public/)
  title: string;    // título a mostrar
  cats: string[];   // categorias
};

const PHOTOS: Photo[] = [
  { id: "p1", src: "/images/gallery/01.png", title: "Buluku", cats: ["Buluku"] },
  { id: "p2", src: "/images/gallery/02.png", title: "Buluku & Amigos", cats: ["Amigos"] },
  { id: "p3", src: "/images/gallery/03.png", title: "Em Marte", cats: ["Viagens"] },
  { id: "p4", src: "/images/gallery/04.png", title: "Buluku Na Lua", cats: ["Amigos"] },
  { id: "p5", src: "/images/gallery/05.png", title: "Lua", cats: ["Viagens"] },
  { id: "p6", src: "/images/gallery/06.png", title: "No Espaço", cats: ["Viagens"] },
  { id: "p7", src: "/images/gallery/07.png", title: "Tempestade", cats: ["Aventuras"] },
  { id: "p8", src: "/images/gallery/08.png", title: "Selfies com amigos", cats: ["Selfies"] },
];

const CATS = ["Todos", "Buluku", "Aventuras", "Amigos", "Viagens", "Selfies"] as const;
type Cat = typeof CATS[number];

export default function Galeria() {
  const [cat, setCat] = useState<Cat>("Todos");
  const [q, setQ] = useState("");
  const [active, setActive] = useState<null | {
    src: string;
    title: string;
    rect: { top: number; left: number; width: number; height: number };
  }>(null);

  const items = useMemo(() => {
    const byCat = cat === "Todos" ? PHOTOS : PHOTOS.filter((p) => p.cats.includes(cat));
    const byQuery = q.trim()
      ? byCat.filter((p) => p.title.toLowerCase().includes(q.trim().toLowerCase()))
      : byCat;
    return byQuery;
  }, [cat, q]);

  // lock body scroll when lightbox open
  useEffect(() => {
    if (!active) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = orig;
    };
  }, [active]);

  // ---- Grid entrance animation (alternate per row) ----
  const gridRef = React.useRef<HTMLElement | null>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    // Reset any previous run
    grid.classList.remove("run");
    const cards = Array.from(grid.querySelectorAll<HTMLElement>(".g-card"));
    cards.forEach((el) => {
      el.classList.remove("pre");
      el.style.removeProperty("--delay");
      el.removeAttribute("data-row-even");
    });

    // Group cards by "row" using their top coordinate (with tolerance)
    const tol = 6;
    const rows: HTMLElement[][] = [];
    const tops: number[] = [];
    const byTop = (n: number) => {
      for (let i = 0; i < tops.length; i++) if (Math.abs(tops[i] - n) < tol) return i;
      tops.push(n);
      rows.push([]);
      return tops.length - 1;
    };

    cards.forEach((el) => {
      const r = el.getBoundingClientRect();
      const idx = byTop(r.top);
      rows[idx].push(el);
    });

    // Mark even/odd rows and set a stagger delay within each row
    rows.forEach((line, rowIndex) => {
      const even = rowIndex % 2 === 0; // even rows: slide from left; odd: from right
      line.forEach((el, i) => {
        el.dataset.rowEven = even ? "true" : "false";
        el.classList.add("pre");
        el.style.setProperty("--delay", `${i * 90}ms`); // tweak stagger as you like
      });
    });

    // Next frame, trigger the animation
    const id = requestAnimationFrame(() => grid.classList.add("run"));
    return () => cancelAnimationFrame(id);
  }, [items]);

  return (
    <main className="galeria min-h-screen w-screen bg-black text-white overflow-x-hidden" style={{ fontFamily: "Gliker, system-ui, sans-serif", color: "white" }}>
      <StarsField speeds={{ far: 0.12, mid: 0.22, near: 0.34 }} />
      <MenuTopBar
      
        items={[
          { label: "Sobre", href: "/sobre" },
          { label: "Shows", href: "/shows" },
          { label: "Galeria & Press", href: "/galeria" },
          { label: "Contactos", href: "/contactos" },
        ]}
      />

      <div className="g-container">
        <h1 className="g-brand">BULUKU — GALERIA</h1>

        {/* filtros + busca */}
        <div className="g-toolbar">
          <ul className="g-cats">
            {CATS.map((c) => (
              <li key={c}>
                <button className={c === cat ? "active" : ""} onClick={() => setCat(c)}>
                  {c === "Todos" ? "All" : c[0].toUpperCase() + c.slice(1)}
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

        {/* grid */}
        <section ref={gridRef} className="g-grid" aria-live="polite">
          {items.map((p) => (
            <figure key={p.id} className="g-card">
              <button
                className="g-imgLink"
                aria-label={`Ver ${p.title} ampliada`}
                onClick={(ev) => {
                  const img = (ev.currentTarget as HTMLElement).querySelector("img");
                  if (!img) return;
                  const r = img.getBoundingClientRect();
                  setActive({
                    src: p.src,
                    title: p.title,
                    rect: { top: r.top, left: r.left, width: r.width, height: r.height },
                  });
                }}
              >
                <div className="g-thumb">
                  <img
                    src={p.src}
                    alt={p.title}
                    loading="lazy"
                    onLoad={(e) => e.currentTarget.setAttribute("data-loaded", "true")}
                  />
                </div>

                <figcaption className="g-overlay">
                  <span className="g-title">{p.title}</span>
                  <span className="g-sub">ver</span>
                </figcaption>
              </button>
            </figure>
          ))}
        </section>

        {items.length === 0 && <p className="g-empty">Sem resultados para “{q}”.</p>}
      </div>

      {/* Lightbox modal */}
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
  // Hooks sempre no topo
  const [imgSize, setImgSize] = React.useState<{ w: number; h: number } | null>(null);
  const [toCenter, setToCenter] = React.useState(false);
  const ghostRef = React.useRef<HTMLImageElement | null>(null);

  // ESC fecha
  React.useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setToCenter(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

  // Carrega a imagem para obter tamanho natural
  React.useEffect(() => {
    if (!active) return;
    const im = new Image();
    im.src = active.src;
    const done = () =>
      setImgSize({ w: im.naturalWidth || 1600, h: im.naturalHeight || 900 });
    (im.decode?.() ?? Promise.resolve()).then(done).catch(done);
  }, [active]);

  // Rect alvo (centrado / contain)
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

  // Dispara a animação para o centro
  React.useEffect(() => {
    if (!active || !target) return;
    const id = requestAnimationFrame(() => setToCenter(true));
    return () => cancelAnimationFrame(id);
  }, [active, target]);

  // Inativo: não renderiza nada (hooks já foram avaliados em segurança)
  if (!active) return null;

  const thumb = active.rect;
  const ghostStyle: React.CSSProperties =
    toCenter && target
      ? { top: target.top, left: target.left, width: target.width, height: target.height }
      : { top: thumb.top, left: thumb.left, width: thumb.width, height: thumb.height };

  function onGhostTransitionEnd() {
    // Se estamos a animar de volta (toCenter=false), desmonta
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
        ref={ghostRef}
        src={active.src}
        alt={active.title}
        className={`lb-ghost ${toCenter ? "toCenter" : "fromThumb"}`}
        style={ghostStyle}
        onTransitionEnd={onGhostTransitionEnd}
      />
      <div className={`lb-ui ${toCenter ? "on" : ""}`} onClick={(e) => e.stopPropagation()}>
        <div className="lb-caption">{active.title}</div>
        <button
          className="lb-close"
          aria-label="Fechar"
          onClick={(e) => {
            e.stopPropagation();
            setToCenter(false);
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}

