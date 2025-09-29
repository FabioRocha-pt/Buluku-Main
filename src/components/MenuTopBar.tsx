import React from "react";
import "../styles/menu.css";

type MenuItem = { label: string; href: string };
type Props = {
  items?: MenuItem[];
  heightPx?: number; // altura do header para dares padding-top na página
};

export default function MenuTopBar({
  items = [
    { label: "Sobre", href: "/sobre" },
    { label: "Shows", href: "/shows" },
    { label: "Galeria & Press", href: "/galeria" },
    { label: "Contactos", href: "/contactos" },
  ],
  heightPx = 56,
}: Props) {
  const [open, setOpen] = React.useState(false);

  // fecha no ESC e quando sobe para desktop
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

  const close = () => setOpen(false);

  return (
    <>
      <header
        className="mtb-root"
        style={{ height: heightPx, fontFamily: "Gliker, system-ui, sans-serif" }}
      >
        <div className="mtb-inner">
          {/* logo */}
          <a href="/" aria-label="Buluku — Home" className="mtb-logo">
            <img
              src="/images/logo.png"
              alt="Buluku"
              width={40}
              height={60}
              loading="eager"
              decoding="async"
            />
          </a>

          {/* nav desktop */}
          <nav className="mtb-nav-desktop" aria-label="Principal">
            <ul>
              {items.map((it) => (
                <li key={it.label}>
                  <a href={it.href}>{it.label}</a>
                </li>
              ))}
            </ul>
          </nav>

          {/* botão mobile */}
          <button
            type="button"
            className="mtb-burger"
            aria-label="Abrir menu"
            aria-controls="mtb-drawer"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {/* ícone hambúrguer / X */}
            {!open ? (
              <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            )}
          </button>
        </div>
      </header>

      {/* Drawer mobile */}
      <div className={`mtb-drawer ${open ? "open" : ""}`} id="mtb-drawer">
        <button className="mtb-backdrop" aria-label="Fechar" onClick={close} />
        <div className="mtb-panel" role="dialog" aria-modal="true">
          <ul className="mtb-list" role="menu">
            {items.map((it) => (
              <li key={it.label} role="none">
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
