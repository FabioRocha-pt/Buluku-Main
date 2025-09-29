import React from "react";
import MenuTopBar from "../components/MenuTopBar";
import StarsField from "../components/StarsField";
import "../styles/sobre.css";

/* --- Types --- */
type RowProps = {
  imgs: string[];
  title: string;
  text: string;
  reverse?: boolean;
};

function ImageCarousel({
  imgs,
  intervalMs = 3500,
  fadeMs = 700,
}: { imgs: string[]; intervalMs?: number; fadeMs?: number }) {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    if (imgs.length <= 1) return;
    const id = setInterval(() => setI(n => (n + 1) % imgs.length), intervalMs);
    return () => clearInterval(id);
  }, [imgs.length, intervalMs]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      {imgs.map((src, idx) => (
        <img
          key={src + idx}
          src={src}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ opacity: idx === i ? 1 : 0, transition: `opacity ${fadeMs}ms ease` }}
          loading="lazy"
        />
      ))}
      <div className="absolute inset-0 pointer-events-none bg-black/10" />
    </div>
  );
}

/* --- Icons (vídeo) --- */
function SpeakerOn(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M3 10v4h4l5 4V6L7 10H3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M16 8a5 5 0 0 1 0 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M19 5a9 9 0 0 1 0 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}
function SpeakerOff(props: any) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M3 10v4h4l5 4V6L7 10H3Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
      <path d="M18 9l-6 6M12 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

/* --- Fullscreen hero video com botão de áudio --- */
function FullscreenHeroVideo() {
  const videoRef = React.useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = React.useState(true);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onCanPlay = () => setReady(true);
    v.addEventListener("canplay", onCanPlay);
    v.muted = true;
    v.play().catch(() => {});
    return () => v.removeEventListener("canplay", onCanPlay);
  }, []);

  const toggleAudio = async () => {
    const v = videoRef.current;
    if (!v) return;
    try {
      if (muted) {
        v.muted = false;
        v.volume = 1;
        await v.play();
      } else {
        v.muted = true;
      }
      setMuted(v.muted);
    } catch {}
  };

  return (
    <section id="hero-video" className="relative w-screen overflow-hidden"
       style={{ height: '100dvh' }} 
       >
      <video
        ref={videoRef}
        className="hero-video__media absolute inset-0 w-full h-full"
        src="/videos/4kvid.mp4"
        poster="/images/intro-poster.jpg"
        autoPlay
        muted={muted}
        loop
        playsInline
        preload="auto"
      />
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />

      <div
        className="absolute left-1/2 -translate-x-1/2 z-[10]"
        style={{ bottom: "calc(env(safe-area-inset-bottom, 0px) + 60px)" }}
      >
        <button
          type="button"
          onClick={toggleAudio}
          aria-pressed={!muted}
          aria-label={muted ? "Ativar som do vídeo" : "Silenciar vídeo"}
          className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-full
                     bg-white/12 text-white backdrop-blur ring-1 ring-white/30
                     hover:bg-white/20 hover:ring-white/50 transition
                     focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          style={{ fontFamily: "Gliker, system-ui, sans-serif" }}
        >
          {muted ? <SpeakerOff className="h-5 w-5" /> : <SpeakerOn className="h-5 w-5" />}
          <span className="text-sm sm:text-base">{muted ? "Ativar som" : "Silenciar"}</span>
        </button>

        {ready && muted && (
          <div
            className="mt-2 text-xs text-white/85 text-center"
            style={{ fontFamily: "Gliker, system-ui, sans-serif", color: "white" }}
          >
            Clique para ouvir o áudio
          </div>
        )}
      </div>
    </section>
  );
}
function RowBlock({ imgs, title, text, reverse = false }: RowProps) {
  const dir = reverse ? "from-right reverse" : "from-left";

  // regra simples: ativa “Ler mais” se texto maior que 240 caracteres
  const needsReadMore = (text ?? "").length > 240;

  return (
    <div className={`sobre-row reveal ${dir}`}>
      <div className="sobre-image">
        <ImageCarousel imgs={imgs} />
      </div>

      <div className="sobre-text">
        <div className="sobre-text-inner">
          <h3>{title}</h3>

          {needsReadMore ? (
            <ExpandableText collapsedLines={6}>
              <p>{text}</p>
            </ExpandableText>
          ) : (
            <p>{text}</p>
          )}
        </div>
      </div>
    </div>
  );
}

function ExpandableText({
  children,
  collapsedLines = 5,         // quantas linhas mostrar antes do “Ler mais”
  className = "",
}: {
  children: React.ReactNode;
  collapsedLines?: number;
  alwaysCollapsedOnMobile?: boolean;
  className?: string;
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={`exp-wrap ${className} ${open ? "open" : "closed"}`}>
      <div
        className="exp-content"
        style={
          !open
            ? ({
                WebkitLineClamp: collapsedLines,
                lineClamp: collapsedLines, // fallback
              } as React.CSSProperties)
            : undefined
        }
      >
        {children}
      </div>

      {/* fade no fim quando está fechado */}
      {!open && <div className="exp-fade" aria-hidden />}

      {/* botão */}
      <button
        type="button"
        className="exp-btn"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {open ? "Ler menos" : "Ler mais"}
      </button>
    </div>
  );
}

/* --- Hook: revela as rows quando entram no viewport --- */
function useRevealOnScroll(selector = ".reveal") {
  React.useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>(selector));
    if (nodes.length === 0) return;
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            obs.unobserve(e.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    nodes.forEach(n => obs.observe(n));
    return () => obs.disconnect();
  }, [selector]);
}

/* --- Página /sobre --- */
export default function Sobre() {
  useRevealOnScroll(); // ativa as animações das rows

const rows: RowProps[] = [
  {
    imgs: ["/images/sobre/1-1.png", "/images/sobre/1-2.png", "/images/sobre/1-3.png"],
    title: "Buluku",
    text:
      "Buluku é um jovem afronauta que vive em Oba Txon, uma cidade africana flutuante que dança entre as nuvens, no encontro do Atlântico com o Cosmos. Desde pequeno aprendeu que as estrelas também contam histórias, e que cada planeta pode guardar um segredo para cuidar da vida.\n\nCurioso, sonhador e cheio de energia, Buluku viaja pelo espaço acompanhado dos seus amigos androids Kandjila e Zuri. Juntos, visitam mundos mágicos feitos de sons, culturas e mitologias africanas futuristas, descobrindo novas formas de viver em harmonia com a natureza.\n\nNo seu fato espacial branco e azul, com um cachecol de pano di terra que o liga à sua origem, Buluku é um viajante destemido: adora semear novas ideias e transformar cada encontro numa aventura.\n\nBuluku é mais do que uma inspiração: é um convite a imaginar futuros divertidos e cheios de esperança.",
  },
  {
    imgs: ["/images/sobre/2-1.png", "/images/sobre/2-2.png", "/images/sobre/2-3.png"],
    title: "Bio Androids",
    text:
      "Kandjila é um cão-robô protetor e brincalhão: corre veloz, fareja energias cósmicas e às vezes mete-se em sarilhos por curiosidade. Zuri é um androide ágil e sem género definido, com um rosto-tela expressivo. Traduz línguas do cosmos, guarda histórias ancestrais e projeta hologramas para explicar tradições e eco-tecnologias — tudo com humor e provérbios africanos.",
    reverse: true,
  },
  {
    imgs: ["/images/sobre/3-1.png", "/images/sobre/3-2.png", "/images/sobre/3-3.png"],
    title: "A ideia por detrás do Projeto",
    text:
      "“Buluku – o Afronauta” nasce para ampliar o imaginário infantil com referências plurais. Em vez do olhar único eurocêntrico, propõe futuros diversos onde todas as crianças se podem ver como protagonistas. A narrativa junta ecologia e diversidade cultural: o futuro só acontece em diálogo com a natureza e com respeito às diferenças. O projeto é transmidiático — espetáculo ao vivo, animação, narrativas digitais e conteúdos interativos — para que Buluku acompanhe as crianças no dia a dia como parceiro de brincadeira, inspiração e aprendizagem.",
  },
  {
    imgs: ["/images/sobre/4-1.png", "/images/sobre/4-2.png", "/images/sobre/4-3.png"],
    title: "Bio de Djam",
    text:
      "Djam Neguin é uma das figuras mais revolucionárias da cena artístico-cultural de Cabo Verde. Atua entre artes cénicas (dança, teatro, música, performance) e visuais (cinema, videoarte, fotoperformance), também como diretor criativo, produtor, curador, formador e artivista. As suas criações exploram perspetivas afrofuturistas e a cultura cabo-verdiana, e já circularam por festivais e cidades como Nova Iorque, Los Angeles, Paris, Madrid, Bogotá, Maputo, Lisboa, Luanda, entre outras.",
  },
];



  return (
    <main
      className="w-screen min-h-screen bg-black text-white overflow-x-hidden"
      style={{ fontFamily: "Gliker, system-ui, sans-serif" }}
    >
      {/* Starfield por trás (fixo, com parallax) */}
      <StarsField speeds={{ far: 0.12, mid: 0.22, near: 0.34 }} />

      {/* top bar centrado */}
      <MenuTopBar heightPx={48} />
      <div className="h-12" aria-hidden />

      {/* vídeo fullscreen */}
      <FullscreenHeroVideo />

      {/* grid xadrez, full-bleed */}
      <section className="sobre-wrap">
        <div className="sobre-grid">
          {rows.map((r, i) => (
            <RowBlock
              key={r.title}
              {...r}
              reverse={r.reverse ?? i % 2 === 1}
            />
          ))}
        </div>
      </section>
      
    </main>
  );
}
