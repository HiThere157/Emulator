import { DragEvent } from "react";

import { formatFileSize, makeStateFriendlyName } from "@/helpers/format";

import { BsGrid3X2GapFill } from "react-icons/bs";

type RemoteItemProps = {
  game: string;
  state: StateFile;
};
export default function RemoteItem({ game, state }: RemoteItemProps) {
  const handleDragStart = (event: DragEvent) => {
    event.dataTransfer.setData("source", "remote");
    event.dataTransfer.setData("game", game);
    event.dataTransfer.setData("fileName", state.fileName);
  };

  return (
    <div
      className="group flex items-center justify-between gap-2 px-2 rounded-md cursor-move bg-lightBg"
      draggable
      onDragStart={handleDragStart}
    >
      <div className="flex-grow">
        <span className="text-whiteColorAccent mr-2">Time:</span>
        <span>{makeStateFriendlyName(state.fileName).toLocaleString("de-de")}</span>
      </div>

      <div className="flex items-center gap-1 text-whiteColorAccent group-hover:text-whiteColor">
        <span className="text-sm">[{formatFileSize(state.size)}]</span>
        <BsGrid3X2GapFill className="rotate-90" />
      </div>
    </div>
  );
}
