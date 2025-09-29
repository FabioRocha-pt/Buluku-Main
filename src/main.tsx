// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import "./index.css";


import App from "./App";
import Sobre from "./pages/Sobre";
import Contactos from "./pages/Contactos";
import Galeria from "./pages/Galeria";
import Shows from "./pages/Shows";
import Footer from "./components/Footer";

function RootLayout() {
  const footerGroups = [
  {
    title: "Produção",
    items: [
      { src: "/images/logos/accca.png", alt: "ACCCA" },
    ],
  },
  {
    title: (
      <>
        A ACCCA é uma estrutura financiada por<br />
        República Portuguesa – Cultura | Direção-Geral das Artes
      </>
    ),
    // ORDEM OBRIGATÓRIA: República primeiro, DGArtes depois
    items: [
      { src: "/images/logos/republica-portuguesa.svg", alt: "República Portuguesa — Cultura" },
      { src: "/images/logos/dgartes.png",               alt: "Direção-Geral das Artes" },
    ],
  },
  {
    title: "Apoios",
    items: [
      { src: "/images/logos/cxc.png",            alt: "Caixa Cultura" },
      { src: "/images/logos/cmlisboa.png",       alt: "Câmara Municipal de Lisboa" },
      { src: "/images/logos/interpress_rgb-01.png", alt: "Interpress — Hub Criativo do Bairro Alto" },
    ],
  },
  {
    title: "Parceria de comunicação",
    items: [
      { src: "/images/logos/antena2.jpg",   alt: "Antena 2" },
      { src: "/images/logos/coffeepaste.png", alt: "Coffeepaste" },
    ],
  },
];
  return (
    <div className="page-shell">
      {/* se o teu header for fixed (48px), mantém este padding-top */}
      <main className="page-content" style={{ paddingTop: 48 }}>
        <Outlet />
      </main>
      <Footer groups={footerGroups} />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <App /> },
      { path: "sobre", element: <Sobre /> },
      { path: "shows", element: <Shows /> },
      { path: "contactos", element: <Contactos /> },
      { path: "galeria", element: <Galeria /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
