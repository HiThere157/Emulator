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

  const preparePlayer = async () => {
    const playerWindow = playerRef.current?.contentWindow as PlayerWindow;

    if (!playerWindow) {
      return;
    }

    playerWindow.EJS_player = "#game";
    playerWindow.EJS_gameUrl = `/api/rom/${params.core}/${params.fileName}`;
    playerWindow.EJS_core = params.core;

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
