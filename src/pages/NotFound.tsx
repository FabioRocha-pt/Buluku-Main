// src/pages/NotFound.tsx
import { Link, useRouteError } from "react-router-dom";

export default function NotFound() {
  const err = useRouteError() as any;
  return (
    <main className="min-h-screen grid place-items-center text-white bg-black"
          style={{ fontFamily: "Gliker, system-ui, sans-serif" }}>
      <div className="text-center px-6">
        <h1 className="text-5xl font-extrabold mb-3">404</h1>
        <p className="text-white/80 mb-6">Página não encontrada.</p>
        {err?.statusText || err?.message ? (
          <p className="text-white/60 text-sm mb-6">{err.statusText || err.message}</p>
        ) : null}
        <Link to="/" className="inline-block rounded-xl bg-white text-black px-5 py-2.5 font-semibold">
          Voltar à Home
        </Link>
      </div>
    </main>
  );
}
