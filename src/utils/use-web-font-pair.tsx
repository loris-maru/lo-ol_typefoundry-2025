import { useEffect, useState } from "react";

function useWebFontPair(fontFamilyName: string, uprightUrl: string, italicUrl?: string) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;

    async function injectFace(id: string, css: string) {
      // Reuse style tag if present, else create it
      let el = document.getElementById(id) as HTMLStyleElement | null;
      if (!el) {
        el = document.createElement("style");
        el.id = id;
        document.head.appendChild(el);
      }
      el.textContent = css;
    }

    async function load() {
      setLoaded(false);
      setError(null);
      try {
        const fmt = uprightUrl.endsWith(".woff2") ? "woff2" : "opentype";

        // Always load the upright face
        await injectFace(
          `font-${fontFamilyName}-upright`,
          `
            @font-face {
              font-family: "${fontFamilyName}";
              src: url("${uprightUrl}") format("${fmt}");
              font-style: normal;
              font-weight: 1 1000; /* variable-safe range */
              font-display: swap;
            }
          `,
        );

        // Conditionally load italic face (still not a hook; just runtime CSS)
        if (italicUrl) {
          const fmtItalic = italicUrl.endsWith(".woff2") ? "woff2" : "opentype";
          await injectFace(
            `font-${fontFamilyName}-italic`,
            `
              @font-face {
                font-family: "${fontFamilyName}";
                src: url("${italicUrl}") format("${fmtItalic}");
                font-style: italic;
                font-weight: 1 1000;
                font-display: swap;
              }
            `,
          );
        } else {
          // If no italic provided, make sure any previous italic tag is cleared
          const prevItalic = document.getElementById(`font-${fontFamilyName}-italic`);
          if (prevItalic) prevItalic.textContent = "";
        }
        // Nudge the font subsystem so layout can pick it up immediately
        await document.fonts?.load(`1rem "${fontFamilyName}"`);
        if (!cancelled) setLoaded(true);
      } catch (e) {
        if (!cancelled) setError(e);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [fontFamilyName, uprightUrl, italicUrl]);

  return { loaded, error };
}

export default useWebFontPair;
