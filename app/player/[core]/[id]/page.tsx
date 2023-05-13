"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import RedirectPopup from "@/components/Popup/RedirectPopup";

type PlayerWindow = Window & {
  EJS_gameUrl: string;
  EJS_core: string;

  init: () => void;
};
type PlayerProps = {
  params: {
    core: string;
    id: string;
  };
};
export default function PlayerPage({ params }: PlayerProps) {
  const playerRef = useRef<HTMLIFrameElement>(null);
  const [redirectHref, setRedirectHref] = useState<string | null>(null);

  const handleClick = useCallback((event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.tagName !== "A") return;

    const parent = target.parentElement as HTMLElement;
    if (parent.getAttribute("data-redirect")) return;

    const href = target.getAttribute("href");
    setRedirectHref(href);
    event.preventDefault();
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClick, { capture: true });

    return () => document.removeEventListener("click", handleClick, { capture: true });
  }, [handleClick]);

  const initPlayer = useCallback(() => {
    const playerWindow = playerRef.current?.contentWindow as PlayerWindow;
    if (!playerWindow) return;

    playerWindow.EJS_gameUrl = `/api/roms/${params.id}`;
    playerWindow.EJS_core = params.core;
    playerWindow.init();
  }, [params]);

  useEffect(() => {
    // Direct navigation:
    //  - onLoad does not trigger
    //  - iframe is loaded before react? no need to wait for load

    // Navbar navigation:
    //  - initPlayer will fail, because iframe is not loaded yet
    //  - onLoad triggers normally
    try {
      initPlayer();
    } catch {}
  }, [initPlayer]);

  return (
    <div className="h-full">
      <RedirectPopup href={redirectHref} onClose={() => setRedirectHref(null)} />
      <iframe ref={playerRef} onLoad={initPlayer} src="/player.html" className="w-full h-full" />
    </div>
  );
}
