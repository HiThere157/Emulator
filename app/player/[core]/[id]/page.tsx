"use client";

import { useEffect, useRef } from "react";

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

  const initPlayer = () => {
    const playerWindow = playerRef.current?.contentWindow as PlayerWindow;
    if (!playerWindow) return;

    playerWindow.EJS_gameUrl = `/api/roms/${params.id}`;
    playerWindow.EJS_core = params.core;
    playerWindow.init();
  };

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
  }, []);

  return (
    <div className="h-full">
      <iframe ref={playerRef} onLoad={initPlayer} src="/player.html" className="w-full h-full" />
    </div>
  );
}
