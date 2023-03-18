import { DragEvent, useState } from "react";

import { putState } from "@/helpers/indexeddb";

import Button from "../Button";

import { BsCloudArrowUpFill, BsPlusSquare, BsFillTrashFill } from "react-icons/bs";

type LocalItemProps = {
  game: string;
  state?: State;
  freeSlot?: number;
  onChange: () => any;
};
export default function LocalItem({ game, state, freeSlot, onChange }: LocalItemProps) {
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const uploadState = async (data: Uint8Array) => {
    const date = new Date();
    const time = date.toISOString().replace("T", "_").replace(/:/g, "-").split(".")[0];

    await fetch(`/api/state/${game}/${time}.state`, {
      method: "POST",
      body: data,
    });

    onChange();
  };

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const saveRemoteState = async (sourceGame: string, fileName: string, slot: number) => {
    const response = await fetch(`/api/state/${sourceGame}/${fileName}`);
    const blob = await response.arrayBuffer();

    await putState({
      game: sourceGame,
      slot: slot,
      data: new Uint8Array(blob),
    });
  };

  const handleDrop = async (event: DragEvent) => {
    const sourceGame = event.dataTransfer.getData("game");
    const fileName = event.dataTransfer.getData("fileName");

    setIsDragOver(false);
    if (game === "Add") {
      await saveRemoteState(sourceGame, fileName, freeSlot ?? 9);
    } else if (game === "Trash") {
      await fetch(`/api/state/${sourceGame}/${fileName}`, {
        method: "DELETE",
      });
    } else {
      if (sourceGame !== game) return;
      await saveRemoteState(sourceGame, fileName, state?.slot ?? 9);
    }

    onChange();
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  return (
    <div
      className={
        "flex justify-between p-1 border-2 border-dashed rounded-md bg-lightBg " +
        (isDragOver ? "border-el2Accent" : "border-lightBg")
      }
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onDragLeave={handleDragLeave}
    >
      {state && (
        <>
          <div className="flex items-center gap-2">
            <span className="text-whiteColorAccent">Slot:</span>
            <span>{state?.slot}</span>
          </div>

          <Button theme="color" className="px-1" onClick={() => uploadState(state.data)}>
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
