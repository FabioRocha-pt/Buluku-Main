import React from "react";
import { useTranslation } from "react-i18next";
import "../styles/menu.css";

type MenuItem = { label: string; href: string };
type Props = {
  items?: MenuItem[];
  heightPx?: number;
};

export default function MenuTopBar({ items, heightPx = 56 }: Props) {
  const { t, i18n } = useTranslation();
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

  const lang = (i18n.language || "pt").toLowerCase().startsWith("en") ? "en" : "pt";
  const toggleLang = () => {
    const next = lang === "pt" ? "en" : "pt";
    i18n.changeLanguage(next);
    localStorage.setItem("buluku_lang", next);
  };

  const defaultItems: MenuItem[] = [
    { label: t("nav.about"), href: "/sobre" },
    { label: t("nav.shows"), href: "/shows" },
    { label: t("nav.gallery"), href: "/galeria" },
    { label: t("nav.contacts"), href: "/contactos" },
  ];

  const navItems = items ?? defaultItems;
  const close = () => setOpen(false);

  return (
    <>
      <header className="mtb-root" style={{ height: heightPx, fontFamily: "Gliker, system-ui, sans-serif" }}>
        <div className="mtb-inner">
          <a href="/" aria-label="Buluku — Home" className="mtb-logo">
            <img src="/images/logo.png" alt="Buluku" width={40} height={60} loading="eager" decoding="async" />
          </a>

          <nav className="mtb-nav-desktop" aria-label="Principal">
            <ul>
              {navItems.map((it) => (
                <li key={it.href}>
                  <a href={it.href}>{it.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mtb-actions">
            <button
              type="button"
              className="mtb-lang"
              onClick={toggleLang}
              aria-label={lang === "pt" ? t("lang.switchToEnglish") : t("lang.switchToPortuguese")}
              title={lang === "pt" ? "EN" : "PT"}
            >
              {lang === "pt" ? "EN" : "PT"}
            </button>

            <button
              type="button"
              className="mtb-burger"
              aria-label="Abrir menu"
              aria-controls="mtb-drawer"
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
            >
              {!open ? (
                <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
                  <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      <div className={`mtb-drawer ${open ? "open" : ""}`} id="mtb-drawer">
        <button className="mtb-backdrop" aria-label={t("common.close")} onClick={close} />
        <div className="mtb-panel" role="dialog" aria-modal="true">
          <div className="mtb-panelTop">
            <button type="button" className="mtb-lang mtb-lang--panel" onClick={toggleLang}>
              {lang === "pt" ? "EN" : "PT"}
            </button>
          </div>

          <ul className="mtb-list" role="menu">
            {navItems.map((it) => (
              <li key={it.href} role="none">
                <a role="menuitem" href={it.href} onClick={close}>
                  {it.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="mtb-footer">© Buluku</div>
        </div>
      </div>
    </>
  );
}