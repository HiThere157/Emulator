import { useState } from "react";

import { makeFriendlyName } from "@/helpers/upload";

import Button from "../Button";

import { BsPlus, BsDash, BsCloudArrowUpFill, BsFillTrashFill } from "react-icons/bs";

type GameItemProps = {
  game: string;
  remoteState: StateFile[];
  localState: State[];
  onUpload: () => any;
};
export default function GameItem({ game, remoteState, localState, onUpload }: GameItemProps) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const uploadState = async (data: Blob) => {
    const date = new Date();
    const time = date.toISOString().replace("T", "_").replace(/:/g, "-").split(".")[0];
    console.log(time);
    await fetch(`/api/state/${game}/${time}.state`, {
      method: "POST",
      body: data,
    });

    onUpload();
  };

  const deleteState = async (fileName: string) => {
    await fetch(`/api/state/${game}/${fileName}`, {
      method: "DELETE",
    });

    onUpload();
  };

  return (
    <div className="mb-1">
      <div>
        <Button className="px-2 w-full" onClick={() => setIsCollapsed(!isCollapsed)}>
          <div className="flex items-center gap-1">
            <div className="text-xl">{isCollapsed ? <BsPlus /> : <BsDash />}</div>
            <span className="text-lg">{makeFriendlyName(game)}</span>
          </div>
        </Button>
      </div>
      {!isCollapsed && (
        <>
          <span className="text-whiteColorAccent text-sm mx-1">Local State:</span>
          <div className="grid grid-cols-3 gap-2 px-2 mb-2">
            {localState.map((state, index) => {
              return (
                <div key={index} className="flex justify-between p-2 bg-lightBg rounded-md">
                  <div className="flex items-center gap-2">
                    <span className="text-whiteColorAccent">Slot:</span>
                    <span>{state.slot}</span>
                  </div>

                  <Button theme="color" className="px-1" onClick={() => uploadState(state.data)}>
                    <BsCloudArrowUpFill />
                  </Button>
                </div>
              );
            })}
          </div>

          <span className="text-whiteColorAccent text-sm mx-1">Remote State:</span>
          <div className="flex flex-col gap-2 px-2 mb-4">
            {remoteState.map((state, index) => {
              return (
                <div key={index} className="flex justify-between px-2 bg-lightBg rounded-md">
                  <div>
                    <span className="text-whiteColorAccent mr-2">Name:</span>
                    <span>{state.fileName}</span>
                  </div>

                  <Button
                    theme="color"
                    className="px-1"
                    onClick={() => deleteState(state.fileName)}
                  >
                    <BsFillTrashFill className="text-redColor" />
                  </Button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
