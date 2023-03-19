import { DragEvent, useState } from "react";

import { deleteState, moveState, putState } from "@/helpers/indexeddb";

import Button from "../Button";

import { BsCloudArrowUpFill, BsPlusSquare, BsFillTrashFill } from "react-icons/bs";

type LocalItemProps = {
  game: string;
  slot?: string;
  data?: Uint8Array;
  onChange: () => any;
};
export default function LocalItem({ game, slot, data, onChange }: LocalItemProps) {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const uploadState = async () => {
    const date = new Date();
    const time = date.toISOString().replace("T", "_").replace(/:/g, "-").split(".")[0];

    await fetch(`/api/state/${game}/${time}`, {
      method: "POST",
      body: data,
    });

    onChange();
  };

  const saveRemoteState = async (sourceGame: string, sourceFileName: string) => {
    const response = await fetch(`/api/state/${sourceGame}/${sourceFileName}`);
    const blob = await response.arrayBuffer();

    await putState({
      game: sourceGame,
      slot: slot ?? "0",
      data: new Uint8Array(blob),
    });
  };

  const handleRemoteDrop = async (event: DragEvent) => {
    const sourceGame = event.dataTransfer.getData("game");
    const sourceFileName = event.dataTransfer.getData("fileName");

    setIsDragOver(false);

    if (game === "Add") {
      return await saveRemoteState(sourceGame, sourceFileName);
    }

    if (game === "Trash") {
      return await fetch(`/api/state/${sourceGame}/${sourceFileName}`, {
        method: "DELETE",
      });
    }

    if (sourceGame !== game) return;
    return await saveRemoteState(sourceGame, sourceFileName);
  };

  const handleLocalDrop = async (event: DragEvent) => {
    const sourceGame = event.dataTransfer.getData("game");
    const sourceSlot = event.dataTransfer.getData("slot");

    setIsDragOver(false);

    if (game === "Add") {
      await moveState(sourceGame, sourceSlot, slot ?? "0");
    }

    if (game === "Trash") {
      await deleteState(sourceGame, sourceSlot);
    }

    if (sourceGame !== game || sourceSlot === slot) return;
    await moveState(sourceGame, sourceSlot, slot ?? "0");
  };

  const handleDrop = async (event: DragEvent) => {
    const source = event.dataTransfer.getData("source");

    if (source === "remote") {
      await handleRemoteDrop(event);
    }

    if (source === "local") {
      await handleLocalDrop(event);
    }

    onChange();
  };

  const handleDragStart = (event: DragEvent) => {
    event.dataTransfer.setData("source", "local");
    event.dataTransfer.setData("game", game);
    event.dataTransfer.setData("slot", slot ?? "0");
  };

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <div
      className={
        "flex justify-between p-1 border-2 border-dashed rounded-md bg-lightBg " +
        (data ? "cursor-move " : " ") +
        (isDragOver ? "border-el2Accent" : "border-lightBg")
      }
      draggable={!!data}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
    >
      {data && (
        <>
          <div className="flex items-center gap-2">
            <span className="text-whiteColorAccent">Slot:</span>
            <span>{slot}</span>
          </div>

          <Button theme="color" className="px-1" onClick={uploadState}>
            <BsCloudArrowUpFill />
          </Button>
        </>
      )}

      {game === "Add" && (
        <div className="flex items-center justify-center flex-grow">
          <BsPlusSquare className="pointer-events-none text-xl text-el1Active" />
        </div>
      )}

      {game === "Trash" && (
        <div className="flex items-center justify-center flex-grow">
          <BsFillTrashFill className="pointer-events-none text-xl text-redColor" />
        </div>
      )}
    </div>
  );
}
