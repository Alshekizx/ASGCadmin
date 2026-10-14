import { useEffect, useRef } from 'react';

/** Controls the document loader, which is visible before React downloads. */
export default function LoadingIndicator({ navigationKey }: { navigationKey: string }) {
  const firstRender = useRef(true);

  useEffect(() => {
    const loader = document.getElementById('asgc-loader');
    if (!loader) return;
    let timer: ReturnType<typeof setTimeout>;
    let safetyTimer: ReturnType<typeof setTimeout>;
    const hide = () => {
      loader.classList.add('is-hidden');
      loader.setAttribute('aria-hidden', 'true');
    };
    const show = () => {
      loader.classList.remove('is-hidden');
      loader.removeAttribute('aria-hidden');
    };
    const initial = firstRender.current;
    show();
    const ready = () => {
      clearTimeout(timer);
      timer = setTimeout(hide, initial ? 700 : 300);
    };
    if (initial && document.readyState !== 'complete') {
      window.addEventListener('load', ready, { once: true });
      // A stalled external image must not block the site indefinitely.
      safetyTimer = setTimeout(hide, 8000);
    } else {
      ready();
    }
    // Mark initial loading complete only after the effect survives StrictMode cleanup.
    const settled = setTimeout(() => { firstRender.current = false; }, 0);
    return () => {
      clearTimeout(timer);
      clearTimeout(safetyTimer);
      clearTimeout(settled);
      window.removeEventListener('load', ready);
    };
  }, [navigationKey]);

  return null;
}
