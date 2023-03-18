import { DragEvent, useState } from "react";

import { putState } from "@/helpers/indexeddb";

import Button from "../Button";

import { BsCloudArrowUpFill, BsPlusSquare, BsFillTrashFill } from "react-icons/bs";

type LocalItemProps = {
  game: string;
  slot?: number;
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

  const handleDragOver = (event: DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const saveRemoteState = async (sourceGame: string, fileName: string) => {
    const response = await fetch(`/api/state/${sourceGame}/${fileName}`);
    const blob = await response.arrayBuffer();

    await putState({
      game: sourceGame,
      slot: slot ?? 0,
      data: new Uint8Array(blob),
    });
  };

  const handleDrop = async (event: DragEvent) => {
    const sourceGame = event.dataTransfer.getData("game");
    const fileName = event.dataTransfer.getData("fileName");

    setIsDragOver(false);
    if (game === "Add") {
      await saveRemoteState(sourceGame, fileName);
    } else if (game === "Trash") {
      await fetch(`/api/state/${sourceGame}/${fileName}`, {
        method: "DELETE",
      });
    } else {
      if (sourceGame !== game) return;
      await saveRemoteState(sourceGame, fileName);
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
