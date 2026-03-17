import React from "react";
import MenuTopBar from "../components/MenuTopBar";
import StarsField from "../components/StarsField";
import "../styles/sobre.css";

/* ========= Types ========= */
type RowProps = {
  title: string;
  text: string[];
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
            <div className="detailCopy">
              {detail.text.map((paragraph, idx) => (
                <p key={idx} className="detailP">
                  {paragraph}
                </p>
              ))}
            </div>
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
  text: [
    "Buluku é um espetáculo cheio de aventuras. Viajamos pelo espaço com um afronauta curioso e brincalhão, que cria planetas, inventa danças e faz grandes perguntas, como: “de onde vem o mundo?”",
    "No palco há brinquedos, imagens em movimento, luzes, sons e um corpo que brinca o tempo todo. Tudo se junta para criar mundos inspirados em antigas estórias de África sobre a origem do mundo.",
    "Em Buluku, não há respostas certas. Há imaginação, movimento e descoberta. Um espetáculo para crianças e adultos verem, sentirem e brincarmos juntos.",
    "Concepção e Interpretação: DJAM NEGUIN",
    "Composição Musical e Sonoplastia: ELIAS GOMES e NDU CARLOS",
    "Composição Audiovisual e Operação: FÁBIO ROCHA",
    "Desenho de Luz e Direção Técnica: PÉRICLES SILVA",
    "Espaço Cénico e Adereços: KENNART",
    "Customização Figurinos: GHISLENE ALVES",
    "Consultoria Artística: CLARA ANDERMATT",
    "Edição Audiovisual e Grafismos: MMSTUDIO",
    "Operação de Luz e Acompanhamento Técnico: MANUEL ABRANTES",
    "Produção: COMPANHIA CLARA ANDERMATT (MIGUEL PEREIRA, RUANA CAROLINA)",
    "Parceiros de Comunicação: ANTENA 2; COFFEEPASTE",
    "Classificação Etária: M/6",
    "Duração: 35 MINUTOS (aprox.)",
    "Apoios: REPÚBLICA PORTUGUESA – CULTURA, JUVENTUDE E DESPORTO / DIREÇÃO-GERAL DAS ARTES; PROGRAMA CAIXA CULTURA, DA CAIXA GERAL DE DEPÓSITOS; INTERPRESS - HUB CRIATIVO DO BAIRRO ALTO; TEATRO DO BAIRRO; ESTUFA - Plataforma Cultural.",
    "Rider Técnico: mais informações em breve.",
    "Sobre a parceria: Reconhecendo em Djam Neguin uma voz artística singular, enraizada nas tradições africanas e voltada para a contemporaneidade, a Companhia Clara Andermatt produz a sua nova criação BULUKU, desenvolvida em estreita colaboração com o artista. O projeto reflete a missão da Companhia de promover diversidade, diálogo e pensamento crítico, dando continuidade à sua relação com Cabo Verde desde 1994 e assinalando a sua primeira produção dirigida ao público infantil e familiar."
  ],
},
  {
    title: "A ideia por detrás do Projeto",
    text: [
      "O projeto parte da constatação de que os imaginários coletivos sobre a origem e o futuro do mundo foram historicamente moldados por perspectivas ocidentais e eurocêntricas, ainda hoje reproduzidas nos media e nas linguagens tecnológicas. Mesmo no universo digital e futurista, predominam representações homogéneas que limitam a diversidade simbólica e identitária.",
      "Buluku propõe reconfigurar esse espaço simbólico partindo de mitologias africanas de criação do mundo, apropriando-se da tecnologia e assumindo-a como território democrático de transformação, abrindo assim o imaginário contemporâneo à pluralidade de cosmovisões.",
      "A escolha de um nome de origem africana responde a uma necessidade ética e estética de coerência com o projeto. Nas cosmologias do povo Fon, da antiga região do Daomé (atual Benim), Buluku designa o princípio criador primordial: uma força que dá origem ao universo e que, após a criação, se retira, permitindo que a existência se desenvolva autonomamente.",
      "Esta ideia de criação não intervencionista sustenta o enquadramento filosófico do projeto, entendendo a criação como impulso gerador de possibilidades - em Buluku, não há respostas certas. Há imaginação, movimento e descoberta."
    ],
  },
  {
    title: "Bio de Djam",
    text: [
      "Artista multidisciplinar da nova geração de criativos contemporâneos cabo-verdianos, expressando-se através da dança, do teatro, do cinema e da música, cruzando várias formas de criação.",
      "Desde 2020, tem se dedicado à exploração de estéticas afro futurísticas queer e agendas descoloniais e antirracistas.",
      "Nascido em Cabo Verde, viveu dos 9 aos 19 anos em Braga, onde desenvolveu vários projetos artísticos. Em 2011 ingressou na ESTC - Curso de Teatro, ramo Atores."
    ],
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