import React, { useMemo, useState } from "react";
import MenuTopBar from "../components/MenuTopBar";
import StarsField from "../components/StarsField";
import "../styles/contact.css"; 

type FormState = { name: string; email: string; subject: string; message: string; };
const initialState: FormState = { name: "", email: "", subject: "", message: "" };
const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

export default function Contactos() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<Partial<FormState>>({});
  const [sent, setSent] = useState(false);

  const disabled = useMemo(
    () =>
      !form.name.trim() ||
      !isEmail(form.email) ||
      !form.subject.trim() ||
      form.message.trim().length < 8,
    [form]
  );

  function set<K extends keyof FormState>(k: K, v: string) {
    setForm((f) => ({ ...f, [k]: v }));
    setErrors((e) => ({ ...e, [k]: undefined }));
  }
  function validate() {
    const e: Partial<FormState> = {};
    if (!form.name.trim()) e.name = "Escreva o seu nome.";
    if (!isEmail(form.email)) e.email = "E-mail inválido.";
    if (!form.subject.trim()) e.subject = "Assunto obrigatório.";
    if (form.message.trim().length < 8) e.message = "Mensagem muito curta.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function onSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    const to = "afronautabuluku@gmail.com";
    const subject = encodeURIComponent(`[Buluku] ${form.subject}`);
    const body = encodeURIComponent(`Nome: ${form.name}\nEmail: ${form.email}\n\n${form.message}`);
    window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <main className="contact-hero min-h-screen w-screen bg-black text-white overflow-x-hidden">
      {/* BG parallax atrás */}
      <StarsField speeds={{ far: 0.12, mid: 0.22, near: 0.34 }} />
      {/* FX sci-fi */}
      <div className="fx fx-grid" aria-hidden />
      <div className="fx-aurora" aria-hidden />

      <MenuTopBar />

      <section className="contact-wrap">
        <div className="contact-card">
          <div className="sheen" aria-hidden />

          <header className="contact-head">
            <h1>CONTACTOS</h1>
            <p>Dúvidas, parcerias ou marcações? Envie-nos uma mensagem — respondemos com a velocidade de um cometa.</p>
          </header>

          <form onSubmit={onSubmit} className="contact-form" noValidate>
            {/* Nome */}
            <label className="field">
              <span>O seu nome</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Escreva aqui…"
                autoComplete="name"
                required
              />
              {errors.name && <em>{errors.name}</em>}
            </label>

            {/* Email */}
            <label className="field">
              <span>O seu e-mail</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="nome@exemplo.com"
                autoComplete="email"
                required
              />
              {errors.email && <em>{errors.email}</em>}
            </label>

            {/* Assunto */}
            <label className="field">
              <span>Assunto</span>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => set("subject", e.target.value)}
                placeholder="Sobre o que quer falar?"
                required
              />
              {errors.subject && <em>{errors.subject}</em>}
            </label>

            {/* Mensagem */}
            <label className="field">
              <span>Mensagem</span>
              <textarea
                value={form.message}
                onChange={(e) => set("message", e.target.value)}
                placeholder="Escreva a sua mensagem…"
                rows={5}
                required
              />
              {errors.message && <em>{errors.message}</em>}
            </label>

            <div className="actions">
              <button type="submit" disabled={disabled}>
                ENVIAR <span>➜</span>
              </button>
              {sent && <small className="sent">Abrimos o seu cliente de e-mail ✉️</small>}
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}
