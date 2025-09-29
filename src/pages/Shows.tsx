import MenuTopBar from "../components/MenuTopBar";
import StarsField from "../components/StarsField";
import "../styles/shows.css";

/** Ícones inline */
const Pin = (p: any) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden {...p}>
    <path d="M12 22s7-5.4 7-12a7 7 0 1 0-14 0c0 6.6 7 12 7 12Z" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="2" />
  </svg>
);
const Clock = (p: any) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden {...p}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
    <path d="M12 7v6l3.5 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
const Bolt = (p: any) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden {...p}>
    <path d="M13 2 4 14h7l-2 8 9-12h-7l2-8Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
  </svg>
);
const Check = (p: any) => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden {...p}>
    <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const agenda = [
  {
    title: "Try Out – Apresentação performática do projeto",
    date: "27 de Outubro, 19h00",
    place: "R. Luz Soriano nº67, 1200-246 Lisboa",
    badge: "Estreia",
  },
];

export default function ShowsPage() {
  return (
    <main className="shows-root" style={{ fontFamily: "Gliker, system-ui, sans-serif" }}>
      <StarsField speeds={{ far: 0.10, mid: 0.20, near: 0.32 }} />

      <MenuTopBar items={[
        { label: "Sobre", href: "/sobre" },
        { label: "Shows", href: "/shows" },
        { label: "Galeria & Press", href: "/galeria" },
        { label: "Contactos", href: "/contactos" },
      ]} />
      <div className="h-spacer" aria-hidden />

      <header className="shows-hero">
        <div className="shows-hero__inner">
          <div className="shows-hero__tag">Buluku — o Afronauta</div>
          <h1 className="shows-hero__title">Shows & Próximas Datas</h1>
          <p className="shows-hero__subtitle">
            Espetáculo imersivo para toda a família — luzes, música, dança e ciência com humor,
            fantasia e consciência ecológica.
          </p>
        </div>
        <div className="shows-hero__orb one" aria-hidden />
        <div className="shows-hero__orb two" aria-hidden />
      </header>

      <div className="shows-wrap">
        <section className="shows-grid">
          <article className="shows-card shows-card--wide">
            <div className="card-head">
              <Bolt className="ico" />
              <h2>Sinopse</h2>
            </div>

            <div className="sinopse">
              <p>
                <strong>Sinopse (longa):</strong><br/>
                Buluku é um afronauta brincalhão e curioso, que viaja pelo espaço-tempo para partilhar aventuras sobre a criação do Universo.
                Com humor e leveza, transforma conhecimentos ancestrais em experiências contemporâneas, acessíveis e divertidas.
                Ao lado dos seus inseparáveis androids Kandjila e Zuri, ele visita planetas desconhecidos e celebra o poder da imaginação,
                da diversidade e da convivência entre mundos.
              </p>
              <p>
                Pensado para toda a família, o espetáculo combina teatro, dança, música e narrativas audiovisuais, criando cenários
                espaciais e futuristas com luzes, imagens e sons. O resultado é uma experiência imersiva, lúdica e educativa, que desperta
                nas crianças — e também nos adultos — o desejo de imaginar futuros mais sustentáveis, inclusivos e criativos.
              </p>

             
            </div>
          </article>

          <article className="shows-card">
            <div className="card-head">
              <Clock className="ico" />
              <h2>Agenda</h2>
            </div>

            <ol className="timeline">
              {agenda.map((ev, idx) => (
                <li key={idx} className="timeline-item">
                  <div className="dot" />
                  <div className="t-line" />
                  <div className="t-body">
                    <div className="t-top">
                      <span className="badge">{ev.badge}</span>
                      <span className="t-date">{ev.date}</span>
                    </div>
                    <h3 className="t-title">{ev.title}</h3>
                    <div className="t-row">
                      <Pin className="ico-sm" />
                      <span>{ev.place}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </article>

          <article className="shows-card">
            <div className="card-head">
              <Check className="ico" />
              <h2>Ficha Técnica</h2>
            </div>

            <ul className="techlist">
              <li><span>Classificação:</span> M/6</li>
              <li><span>Duração:</span> 35 minutos</li>
              <li><span>Criação/Interpretação:</span> Djam Neguin</li>
              <li><span>Composição Audiovisual/Operação:</span> Fábio Rocha</li>
              <li><span>Edição Audiovisual/Grafismos:</span> MMStudio</li>
              <li><span>Composição Musical:</span> Khaly Angel &amp; Heber Eliber</li>
              <li><span>Cenografia:</span> Kennart</li>
              <li><span>Customização Figurinos:</span> Gyslenne</li>
              <li><span>Desenho de Luz:</span> Péricles Silva</li>
              <li><span>Acompanhamento Artístico:</span> Clara Andermatt</li>
            </ul>

            <div className="notes">
              <p><strong>Apoios:</strong> logos enviados pelo Miguel.</p>
              <p><strong>Rider Técnico:</strong> mais informações em breve.</p>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
