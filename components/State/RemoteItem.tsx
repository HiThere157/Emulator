import { DragEvent } from "react";

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
      className="group flex items-center justify-between gap-2 px-2 bg-lightBg rounded-md cursor-move"
      draggable
      onDragStart={handleDragStart}
    >
      <div className="flex-grow">
        <span className="text-whiteColorAccent mr-2">Name:</span>
        <span>{state.fileName}</span>
      </div>

      <BsGrid3X2GapFill className="rotate-90 text-whiteColorAccent group-hover:text-whiteColor" />
    </div>
  );
}
