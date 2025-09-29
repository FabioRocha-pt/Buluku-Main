import React from "react";
import "../styles/footer.css";

type Logo = {
  src: string;
  alt: string;
  href?: string;
  title?: string;
};

type LogoGroup = {
  title: React.ReactNode;   // título/legenda da secção
  items: Logo[];            // logos da secção (na ORDEM certa)
};

type Props = {
  groups: LogoGroup[];      // << agora recebemos grupos
  compact?: boolean;
};

export default function Footer({ groups, compact = false }: Props) {
  return (
    <footer className={`site-footer ${compact ? "site-footer--compact" : ""}`}>
      <div className="footer__container">
        {groups.map((g, i) => (
          <section key={i} className="footer-section">
            <h4 className="footer-section__title">{g.title}</h4>

            <ul className="footer-logos" aria-label="Logotipos">
              {g.items.map((l, j) => (
                <li key={`${l.alt}-${j}`} className="footer-logos__item">
                  {l.href ? (
                    <a href={l.href} target="_blank" rel="noopener noreferrer" aria-label={l.alt} title={l.title ?? l.alt}>
                      <img className="footer-logos__img" src={l.src} alt={l.alt} loading="lazy" decoding="async" />
                    </a>
                  ) : (
                    <img className="footer-logos__img" src={l.src} alt={l.alt} loading="lazy" decoding="async" title={l.title ?? l.alt}/>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}

        <div className="footer__bottom">
          © {new Date().getFullYear()} Buluku. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
