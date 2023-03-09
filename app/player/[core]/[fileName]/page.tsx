"use client";

import { useEffect, useRef } from "react";

type Props = {
  params: {
    core: string;
    fileName: string;
  };
};
export default function Player({ params }: Props) {
  const playerRef = useRef<HTMLIFrameElement>(null);

  const initPlayer = () => {
    const playerWindow = playerRef.current?.contentWindow as PlayerWindow;
    if (!playerWindow) return;

    playerWindow.EJS_gameUrl = `/api/rom/${params.core}/${params.fileName}`;
    playerWindow.EJS_core = params.core;
    playerWindow.init();
  };

  useEffect(() => {
    // direct navigation:
    //  - onLoad does not trigger
    //  - iframe is loaded before react? no need to wait for load

    // navbar navigation:
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
