"use client";

import { useEffect, useRef } from "react";

type PlayerProps = {
  params: {
    id: string;
  };
};
export default function Player({ params }: PlayerProps) {
  const playerRef = useRef<HTMLIFrameElement>(null);

  const preparePlayer = async () => {
    const playerWindow = playerRef.current?.contentWindow as PlayerWindow;

    const response = await fetch(`/api/rom/${params.id}`);
    const romInfo: RomFile = await response.json();

    if (!playerWindow) {
      return;
    }

    playerWindow.EJS_player = "#game";
    playerWindow.EJS_gameUrl = `/api/rom/${params.id}/rom`;
    playerWindow.EJS_core = romInfo.core;

    const script = playerWindow.document.getElementById("script") as HTMLScriptElement;
    script.src = "https://www.emulatorjs.com/loader.js";
  };

  useEffect(() => {
    preparePlayer();
  }, []);

  return (
    <div className="h-full">
      <iframe ref={playerRef} src="/test.html" className="w-full h-full" />
    </div>
  );
}
