import { DragEvent, useState } from "react";

import { deleteState, moveState, putState } from "@/helpers/indexeddb";
import { makeStateFileName } from "@/helpers/format";

import Button from "../Button";

import { BsCloudArrowUpFill, BsPlusSquare, BsFillTrashFill } from "react-icons/bs";

type LocalItemProps = {
  role?: string;
  game: string;
  slot: string;
  data?: Uint8Array;
  onChange: () => any;
};
export default function LocalItem({ role, game, slot, data, onChange }: LocalItemProps) {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const uploadState = async () => {
    const time = makeStateFileName(new Date());

    await fetch(`/api/state/${game}/${time}`, {
      method: "POST",
      body: data,
    });

    onChange();
  };

  const handleRemoteDrop = async (event: DragEvent) => {
    const sourceGame = event.dataTransfer.getData("game");
    const sourceFileName = event.dataTransfer.getData("fileName");

    setIsDragOver(false);
    if (sourceGame !== game) return;

    if (role === "Trash") {
      return await fetch(`/api/state/${sourceGame}/${sourceFileName}`, {
        method: "DELETE",
      });
    }

    const response = await fetch(`/api/state/${sourceGame}/${sourceFileName}`);
    const blob = await response.arrayBuffer();

    await putState({
      game: sourceGame,
      slot: slot,
      data: new Uint8Array(blob),
    });
  };

  const handleLocalDrop = async (event: DragEvent) => {
    const sourceGame = event.dataTransfer.getData("game");
    const sourceSlot = event.dataTransfer.getData("slot");

    setIsDragOver(false);
    if (sourceGame !== game || sourceSlot === slot) return;

    if (role === "Trash") {
      return await deleteState(sourceGame, sourceSlot);
    }

    await moveState(sourceGame, sourceSlot, slot);
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
    event.dataTransfer.setData("slot", slot);
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

      {role === "Add" && (
        <div className="flex items-center justify-center flex-grow">
          <BsPlusSquare className="pointer-events-none text-xl text-el1Active" />
        </div>
      )}

      {role === "Trash" && (
        <div className="flex items-center justify-center flex-grow">
          <BsFillTrashFill className="pointer-events-none text-xl text-redColor" />
        </div>
      )}
    </div>
  );
}
