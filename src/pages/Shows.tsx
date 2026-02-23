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
type AgendaStatus = "NORMAL" | "EM_BREVE" | "SOLD_OUT" | "ENCERRADO" | "ESCOLAS";

type AgendaItem = {
  title: string;
  badge?: string;
  dateLabel: string;   // "13 de fevereiro"
  time: string;        // "10h30" | "10h30 e 14h30"
  city: string;
  venue: string;
  address?: string;
  status: AgendaStatus;
  ticketUrl?: string;
  note?: string;
};

const statusLabel: Record<AgendaStatus, string> = {
  NORMAL: "Bilhetes",
  EM_BREVE: "Em breve",
  SOLD_OUT: "Sold Out",
  ENCERRADO: "Encerrado",
  ESCOLAS: "Escolas",
};
const agenda: AgendaItem[] = [
  {
    title: "Try Out",
    badge: "Try Out",
    dateLabel: "13 de fevereiro",
    time: "10h30",
    city: "Praia, Cabo Verde",
    venue: "Centro Cultural Português na Praia",
    status: "ENCERRADO",
  },
  {
    title: "Try Out",
    badge: "Try Out",
    dateLabel: "6 de março",
    time: "19h00",
    city: "Lisboa",
    venue: "Estúdio ACCCA",
    status: "EM_BREVE",
    note: "Bilhetes em breve.",
  },
  {
    title: "Espetáculo | Estreia",
    badge: "Estreia",
    dateLabel: "21 e 22 de março",
    time: "16h00",
    city: "Lisboa",
    venue: "Teatro do Bairro",
    address: "R. Luz Soriano, 63 1200-246 Lisboa",
    status: "EM_BREVE",
    note: "Bilhetes em breve.",
  },
  {
    title: "Espetáculo",
    badge: "Público",
    dateLabel: "28 de março",
    time: "16h00",
    city: "Águeda",
    venue: "Local a definir",
    status: "EM_BREVE",
    note: "Bilhetes em breve.",
  },
  {
    title: "Espetáculo",
    badge: "Escolas",
    dateLabel: "5 de junho",
    time: "10h30 e 14h30",
    city: "Braga",
    venue: "Theatro Circo",
    address: "Av. da Liberdade 697, 4710-251 Braga",
    status: "ESCOLAS",
    note: "Sessões para escolas (sem bilheteira online).",
  },
  {
    title: "Espetáculo",
    badge: "Público",
    dateLabel: "6 de junho",
    time: "11h30",
    city: "Braga",
    venue: "Theatro Circo",
    address: "Av. da Liberdade 697, 4710-251 Braga",
    status: "EM_BREVE",
    note: "Bilhetes em breve.",
  },
  {
    title: "Oficina — O Meu Eu Astronauta e o Metaverso",
    badge: "Oficina",
    dateLabel: "6 de junho",
    time: "15h00",
    city: "Braga",
    venue: "Theatro Circo",
    address: "Av. da Liberdade 697, 4710-251 Braga",
    status: "EM_BREVE",
    note: "Inscrições em breve.",
  },
];

export default function ShowsPage() {
  return (
    <main className="shows-root" style={{ fontFamily: "Gliker, system-ui, sans-serif" }}>
      <StarsField speeds={{ far: 0.10, mid: 0.20, near: 0.32 }} />

      <MenuTopBar />
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
                Buluku é um espetáculo cheio de aventuras. Viajamos pelo espaço com um afronauta curioso e brincalhão, que cria planetas, 
                inventa danças e faz grandes perguntas, como: “de onde vem o mundo?”
              </p>
              <p>
                No palco há brinquedos, imagens em movimento, luzes, sons e um corpo que brinca o tempo todo. 
                Tudo se junta para criar mundos inspirados em antigas estórias de África sobre a origem do mundo.
              </p>
              <p>
                Em Buluku, não há respostas certas. Há imaginação, movimento e descoberta. 
                Um espetáculo para crianças e adultos verem, sentirem e brincarmos juntos.
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
          {ev.badge && <span className="badge">{ev.badge}</span>}
          <span className="t-date">
            {ev.dateLabel} — {ev.time}
          </span>
        </div>

        <h3 className="t-title">{ev.title}</h3>

        <div className="t-row">
          <Pin className="ico-sm" />
          <span>
            <strong>{ev.venue}</strong> — {ev.city}
            {ev.address ? <span> · {ev.address}</span> : null}
          </span>
        </div>

        <div className="t-row" style={{ marginTop: 10, gap: 10, alignItems: "center" }}>
          <span className="mini-status">{statusLabel[ev.status]}</span>

          {ev.ticketUrl && ev.status === "NORMAL" ? (
            <a className="mini-link" href={ev.ticketUrl} target="_blank" rel="noreferrer">
              Abrir link
            </a>
          ) : null}

          {ev.note ? <span className="mini-note">{ev.note}</span> : null}
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
  <li><span>Concepção e Interpretação:</span> DJAM NEGUIN</li>
  <li><span>Composição Musical e Sonoplastia:</span> ELIAS GOMES e NDU CARLOS</li>
  <li><span>Composição Audiovisual e Operação:</span> FÁBIO ROCHA</li>
  <li><span>Desenho de Luz e Direção Técnica:</span> PÉRICLES SILVA</li>
  <li><span>Espaço Cénico e Adereços:</span> KENNART</li>
  <li><span>Customização Figurinos:</span> GHISLENE ALVES</li>
  <li><span>Consultoria Artística:</span> CLARA ANDERMATT</li>
  <li><span>Edição Audiovisual e Grafismos:</span> MMSTUDIO</li>
  <li><span>Operação de Luz e Acompanhamento Técnico:</span> MANUEL ABRANTES</li>
  <li><span>Produção:</span> COMPANHIA CLARA ANDERMATT (MIGUEL PEREIRA, RUANA CAROLINA)</li>
  <li><span>Parceiros de Comunicação:</span> ANTENA 2; COFFEEPASTE</li>
  <li><span>Classificação Etária:</span> M/6</li>
  <li><span>Duração:</span> 35 MINUTOS (aprox.)</li>
</ul>

            <div className="notes">
              <p>
    <strong>Apoios:</strong> REPÚBLICA PORTUGUESA – CULTURA, JUVENTUDE E DESPORTO / DIREÇÃO-GERAL DAS ARTES; PROGRAMA CAIXA CULTURA, DA CAIXA GERAL DE DEPÓSITOS; CÂMARA MUNICIPAL DE LISBOA; INTERPRESS - HUB CRIATIVO DO BAIRRO ALTO; TEATRO DO BAIRRO; ESTUFA - Plataforma Cultural
  </p>
              <p><strong>Rider Técnico:</strong> mais informações em breve.</p>
               <p><strong>SOBRE A PARCERIA:</strong> Reconhecendo em Djam Neguin uma voz artística singular, 
               enraizada nas tradições africanas e voltada para a contemporaneidade, a Companhia Clara Andermatt produz a sua nova criação BULUKU, 
               desenvolvida em estreita colaboração com o artista. O projeto reflete a missão da Companhia de promover diversidade, diálogo e pensamento crítico,
                dando continuidade à sua relação com Cabo Verde desde 1994 e assinalando a sua primeira produção dirigida ao público infantil e familiar.</p>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
