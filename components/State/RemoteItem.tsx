import { DragEvent, useState } from "react";

import { formatFileSize, getStateFileMeta, getStateFileName } from "@/helpers/format";

import Input from "../Input";
import Button from "../Button";

import { BsCheck, BsGrid3X2GapFill, BsPencilFill } from "react-icons/bs";

type RemoteItemProps = {
  game: string;
  state: StateFile;
  onRename: () => any;
};
export default function RemoteItem({ game, state, onRename }: RemoteItemProps) {
  const meta = getStateFileMeta(state.fileName);
  const [identifier, setIdentifier] = useState<string>(meta.identifier);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const handleDragStart = (event: DragEvent) => {
    event.dataTransfer.setData("source", "remote");
    event.dataTransfer.setData("game", game);
    event.dataTransfer.setData("fileName", state.fileName);
  };

  const toggleIsEditing = async () => {
    setIsEditing(!isEditing);

    if (isEditing) {
      if (identifier === meta.identifier) return;

      await fetch(`/api/state/${game}/${state.fileName}`, {
        method: "PATCH",
        body: JSON.stringify({
          targetFileName: getStateFileName({ date: meta.date, identifier }),
        }),
      });

      onRename();
    }
  };

  const onIdentifierChange = (identifier: string) => {
    if (identifier.length <= 15) {
      setIdentifier(identifier.replace(/[^0-9a-zA-Z-]/g, ""));
    }
  };

  return (
    <div
      className="group flex items-center justify-between gap-2 px-2 rounded-md cursor-move bg-lightBg"
      draggable
      onDragStart={handleDragStart}
    >
      <div className="flex items-center flex-grow">
        <span className="text-whiteColorAccent mr-2">Time:</span>
        <span>{meta.date.toLocaleString("de-de")}</span>

        <span className="text-whiteColorAccent mx-2">Identifier:</span>
        {isEditing ? (
          <Input
            value={identifier}
            className="mr-1 w-36"
            onChange={onIdentifierChange}
            onEnter={toggleIsEditing}
          />
        ) : (
          <span className="mr-2">{meta.identifier}</span>
        )}
        <Button theme="color" onClick={toggleIsEditing}>
          {isEditing ? <BsCheck className="text-xl" /> : <BsPencilFill className="px-1 text-xl" />}
        </Button>
      </div>

      <div className="flex items-center gap-1 text-whiteColorAccent group-hover:text-whiteColor">
        <span className="text-sm">[{formatFileSize(state.size)}]</span>
        <BsGrid3X2GapFill className="rotate-90" />
      </div>
    </div>
  );
}
