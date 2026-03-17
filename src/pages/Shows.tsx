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

type AgendaStatus = "NORMAL" | "EM_BREVE" | "SOLD_OUT" | "ENCERRADO" | "ESCOLAS";

type AgendaItem = {
  title: string;
  badge?: string;
  dateLabel: string;
  time: string;
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
    title: "1º Try Out",
    badge: "Try Out",
    dateLabel: "27 de outubro",
    time: "19h00",
    city: "Lisboa",
    venue: "Estúdio ACCCA",
    status: "ENCERRADO",
  },
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
    title: "Espetáculo | Estreia",
    badge: "Estreia",
    dateLabel: "21 e 22 de março",
    time: "16h00",
    city: "Lisboa",
    venue: "Teatro do Bairro",
    address: "R. Luz Soriano, 63 1200-246 Lisboa",
    status: "NORMAL",
    ticketUrl: "https://www.bol.pt/Comprar/Bilhetes/172871-buluku-teatro_do_bairro/",
  },
  {
    title: "Espetáculo",
    badge: "Público",
    dateLabel: "27 de março",
    time: "10h00",
    city: "Águeda",
    venue: "Centro de Artes de Águeda",
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
      <StarsField speeds={{ far: 0.1, mid: 0.2, near: 0.32 }} />

      <MenuTopBar />
      <div className="h-spacer" aria-hidden />

      <header className="shows-hero">
        <div className="shows-hero__inner">
          <div className="shows-hero__tag">Buluku — o Afronauta</div>
          <h1 className="shows-hero__title">Agenda</h1>
          <p className="shows-hero__subtitle">
            Próximas datas, sessões públicas, escolas e oficina.
          </p>
        </div>
        <div className="shows-hero__orb one" aria-hidden />
        <div className="shows-hero__orb two" aria-hidden />
      </header>

      <div className="shows-wrap">
        <section className="shows-grid">
          <article className="shows-card shows-card--agenda">
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
        </section>
      </div>
    </main>
  );
}