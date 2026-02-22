import React from "react";

declare global {
  interface Window {
    google?: any;
    googleTranslateElementInit?: () => void;
    __translatorInits?: Array<() => void>;
  }
}

const SCRIPT_ID = "google-translate-script";
const CONTAINER_ID = "google_translate_element";

type TranslatorToggleProps = {
  label?: string;
  className?: string;
  widgetId?: string;
};

export default function TranslatorToggle({
  label = "Idioma",
  className = "",
  widgetId,
}: TranslatorToggleProps) {
  const autoId = React.useId().replace(/:/g, "-");
  const containerId = widgetId ?? `${CONTAINER_ID}-${autoId}`;
  const hasInitialized = React.useRef(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const registry = (window.__translatorInits = window.__translatorInits || []);
    const cleanArtifacts = () => {
      const selectors = [
        "#goog-gt-tt",
        ".goog-te-banner-frame",
        ".goog-te-balloon-frame",
      ];
      selectors.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el) => el.remove());
      });
      document.documentElement.style.top = "0px";
      document.body.style.top = "0px";
    };
    cleanArtifacts();
    const artifactObserver = new MutationObserver(cleanArtifacts);
    artifactObserver.observe(document.documentElement, { childList: true, subtree: true });

    const initWidget = () => {
      if (hasInitialized.current) return;
      const container = document.getElementById(containerId);
      const google = window.google;

      if (!container || !google?.translate?.TranslateElement) return;

      new google.translate.TranslateElement(
        {
          pageLanguage: "pt",
          includedLanguages: "pt,en",
          layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        containerId
      );

      hasInitialized.current = true;
    };

    if (!registry.includes(initWidget)) registry.push(initWidget);
    window.googleTranslateElementInit = () => {
      window.__translatorInits?.forEach((fn) => fn());
    };

    if (window.google?.translate?.TranslateElement) {
      initWidget();
    } else if (!document.getElementById(SCRIPT_ID)) {
      const script = document.createElement("script");
      script.id = SCRIPT_ID;
      script.src = "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    }

    return () => {
      const idx = registry.indexOf(initWidget);
      if (idx >= 0) registry.splice(idx, 1);
      artifactObserver.disconnect();
    };
  }, [containerId]);

  const wrapperClass = ["mtb-translate", className].filter(Boolean).join(" ");

  return (
    <div className={wrapperClass} role="group" aria-label="Selecionar idioma">
      <span className="mtb-translate__label">{label}</span>
      <div id={containerId} className="mtb-translate__widget" />
    </div>
  );
}
