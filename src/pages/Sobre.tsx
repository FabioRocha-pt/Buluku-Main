import React from "react";
import MenuTopBar from "../components/MenuTopBar";
import StarsField from "../components/StarsField";
import "../styles/sobre.css";

/* ========= Types ========= */
type RowProps = {
  title: string;
  text: string;
};

type PlanetId = "p1" | "p2" | "p3";

type Planet = {
  id: PlanetId;
  label: string;
  thumb: string;
  hover: string;
  loop: string[]; // 4 imgs em loop
};

/* ========= Utils ========= */
function usePrefersReducedMotion() {
  const [prefers, setPrefers] = React.useState(false);
  React.useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setPrefers(!!m.matches);
    update();
    m.addEventListener?.("change", update) ?? m.addListener(update as any);
    return () => m.removeEventListener?.("change", update) ?? m.removeListener(update as any);
  }, []);
  return prefers;
}

/* ========= UI bits ========= */
function GlovePointer(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 96 96" fill="none" {...props}>
      <path
        d="M44 74c-6 0-10-4-10-10V37c0-4 3-7 7-7s7 3 7 7v12-20c0-4 3-7 7-7s7 3 7 7v20-16c0-4 3-7 7-7s7 3 7 7v22-10c0-4 3-7 7-7s7 3 7 7v22c0 14-10 26-24 28l-15 2-12-6Z"
        fill="rgba(255,255,255,0.92)"
        stroke="rgba(0,0,0,0.35)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M32 60c-5 0-10 3-10 9 0 5 4 9 9 9h10"
        fill="rgba(255,255,255,0.92)"
        stroke="rgba(0,0,0,0.35)"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlanetLoop({ imgs, intervalMs = 2200 }: { imgs: string[]; intervalMs?: number }) {
  const [i, setI] = React.useState(0);

  React.useEffect(() => {
    if (!imgs?.length) return;
    const id = window.setInterval(() => setI((n) => (n + 1) % imgs.length), intervalMs);
    return () => window.clearInterval(id);
  }, [imgs, intervalMs]);

  return (
    <div className="planetLoop">
      {imgs.map((src, idx) => (
        <img
          key={src + idx}
          src={src}
          alt=""
          className={`planetLoopImg ${idx === i ? "on" : ""}`}
          draggable={false}
        />
      ))}
    </div>
  );
}

/* ========= Main Flow ========= */
function SobreUniverse({ rows }: { rows: RowProps[] }) {
  const prefersReducedMotion = usePrefersReducedMotion();

  // 3 temas fixos (um por planeta)
  const contentByPlanet: Record<PlanetId, RowProps> = {
    p1: rows[0],
    p2: rows[1],
    p3: rows[2],
  };

  const PLANETS: Planet[] = [
    {
      id: "p1",
      label: "Sobre o Espetáculo",
      thumb: "/images/planetas/planeta1.png",
      hover: "/images/planetas/hover-planeta1.jpg",
      loop: [
        "/images/planetas/p1/5.jpg",
        "/images/planetas/p1/2.png",
        "/images/planetas/p1/3.png",
        "/images/planetas/p1/4.png",
        "/images/planetas/p1/1.png",
      ],
    },
    {
      id: "p2",
      label: "A ideia por detrás do projeto",
      thumb: "/images/planetas/planeta2.png",
      hover: "/images/planetas/hover-planeta2.png",
      loop: [
        "/images/planetas/p2/1.png",
        "/images/planetas/p2/2.png",
        "/images/planetas/p2/3.png",
        "/images/planetas/p2/4.png",
      ],
    },
    {
      id: "p3",
      label: "Bio de Djam",
      thumb: "/images/planetas/planeta3.png",
      hover: "/images/planetas/hover-planeta3.jpg",
      loop: [
        "/images/planetas/p3/1.jpg",
        "/images/planetas/p3/2.png",
        "/images/planetas/p3/3.jpg",
        "/images/planetas/p3/4.jpg",
      ],
    },
  ];

  const [mode, setMode] = React.useState<"seal" | "warp" | "planets" | "detail">("seal");
  const [selected, setSelected] = React.useState<Planet | null>(null);

  const startWarp = () => {
    setSelected(null);
    if (prefersReducedMotion) {
      setMode("planets");
      return;
    }
    setMode("warp");
    window.setTimeout(() => setMode("planets"), 1100);
  };

  const openPlanet = (p: Planet) => {
    setSelected(p);
    setMode("detail");
  };

  const back = () => {
    if (mode === "detail") {
      setMode("planets");
      setSelected(null);
    } else {
      setMode("seal");
      setSelected(null);
    }
  };

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") back();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  const detail = selected ? contentByPlanet[selected.id] : null;

  return (
    <section className="sobreUniverse">
      {/* Warp overlay full-screen */}
      {mode === "warp" && (
        <div className="warp" aria-hidden>
          {Array.from({ length: 52 }).map((_, i) => (
            <span key={i} className="warpStreak" style={{ ["--i" as any]: i }} />
          ))}
        </div>
      )}

      {/* back button */}
      {mode !== "seal" && (
        <button type="button" className="uiBack" onClick={back}>
          ← Voltar
        </button>
      )}


      {/* SEAL */}
      {mode === "seal" && (
        <div className="sealScreen">
          <button type="button" className="sealBtn" onClick={startWarp} aria-label="Clicar para abrir o portal">
            <div className="sealRing">
              <img src="/images/buluku-lua.png" alt="Buluku na lua" className="sealImg" draggable={false} />
            </div>
          </button>

          <div className="sealHint" aria-hidden>
            <GlovePointer className="glove" />
            <div className="hintBubble">Clica no Buluku</div>
          </div>
        </div>
      )}

      {/* PLANETS */}
      {mode === "planets" && (
        <div className="planetsScreen">
          <div className="planetsCaption">Escolhe um planeta</div>

          <div className="planetsField">
            {PLANETS.map((p) => (
              <button
                key={p.id}
                type="button"
                className={`planetBtn ${p.id}`}
                onClick={() => openPlanet(p)}
                aria-label={p.label}
              >
                <div className="planetRing">
                  <img className="planetImg base" src={p.thumb} alt={p.label} draggable={false} />
                  <img className="planetImg hover" src={p.hover} alt="" aria-hidden draggable={false} />
                </div>
                <div className="planetLabel">{p.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* DETAIL */}
      {mode === "detail" && selected && detail && (
        <div className="detailScreen">
          {/* Left: planeta “close-up” */}
          <div className="detailPlanetWrap">
            <div className="detailPlanetCircle">
              <PlanetLoop imgs={selected.loop} intervalMs={2200} />
            </div>
          </div>

          {/* Right: texto do tema desse planeta */}
          <aside className="detailText">
            <div className="detailTopic">{selected.label}</div>
            <h2 className="detailH">{detail.title}</h2>
            <p className="detailP">{detail.text}</p>
          </aside>
        </div>
      )}
    </section>
  );
}

/* ========= Page ========= */
export default function Sobre() {
  const rows: RowProps[] = [
    {
      title: "Sobre o Espetáculo",
      text:
        "Partindo de pesquisas aprofundadas sobre estórias africanas de criação do mundo e recorrendo a softwares de inteligência artificial e realidade virtual como ferramentas criativas, Djam Neguin concebe um espetáculo multimédia que articula performance ao vivo com conteúdos audiovisuais projetados (vídeo mapping). O resultado é uma experiência poética e sensorial que convoca diferentes linguagens artísticas, criando um ambiente imersivo, envolvente e acessível ao público infantil e familiar. O projeto desdobra-se em atividades paralelas que ampliam a sua dimensão transdisciplinar, como a Roda de Conversa pós-espetáculo e a oficina “O Meu Eu Astronauta e o Metaverso”, direcionada para a criação de personagens.",
    },
    {
      title: "A ideia por detrás do Projeto",
      text:
        "“Buluku – o Afronauta” nasce para ampliar o imaginário infantil com referências plurais. Em vez do olhar único eurocêntrico, propõe futuros diversos onde todas as crianças se podem ver como protagonistas. A narrativa junta ecologia e diversidade cultural: o futuro só acontece em diálogo com a natureza e com respeito às diferenças. O projeto é transmidiático — espetáculo ao vivo, animação, narrativas digitais e conteúdos interativos — para que Buluku acompanhe as crianças no dia a dia como parceiro de brincadeira, inspiração e aprendizagem.",
    },
    {
      title: "Bio de Djam",
      text:
        "Artista multidisciplinar da nova geração de criativos contemporâneos cabo-verdianos, expressando-se através da dança, do teatro, do cinema e da música, cruzando várias formas de criação. Desde 2020, tem se dedicado à exploração de estéticas afro futurísticas queer e agendas descoloniais e antirracistas. Nascido em Cabo Verde, viveu dos 9 aos 19 anos em Braga, onde desenvolveu vários projetos artísticos. Em 2011 ingressou na ESTC - Curso de Teatro, ramo Atores.",
    },
  ];

  return (
    <main className="w-screen min-h-screen bg-black text-white overflow-x-hidden" style={{ fontFamily: "Gliker, system-ui, sans-serif" }}>
      <StarsField speeds={{ far: 0.12, mid: 0.22, near: 0.34 }} />
      <MenuTopBar heightPx={48} />
      <div className="h-12" aria-hidden />

      {/* Full page experience */}
      <SobreUniverse rows={rows} />
    </main>
  );
}