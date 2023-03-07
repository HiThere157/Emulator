"use client";

import { useRef } from "react";

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

    playerWindow.EJS_gameUrl = `/api/rom/${params.core}/${params.fileName}`;
    playerWindow.EJS_core = params.core;
    playerWindow.init();
  };

  return (
    <div className="h-full">
      <iframe ref={playerRef} onLoad={preparePlayer} src="/player.html" className="w-full h-full" />
    </div>
  );
}
