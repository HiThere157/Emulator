import { useState } from "react";
import { usePathname } from "next/navigation";

import { makeFriendlyName } from "@/helpers/upload";

import LocalItem from "./LocalItem";
import RemoteItem from "./RemoteItem";
import Button from "../Button";

import { BsPlus, BsDash } from "react-icons/bs";

type GameItemProps = {
  game: string;
  remoteState: StateFile[];
  localState: State[];
  onChange: () => any;
};
export default function GameItem({ game, remoteState, localState, onChange }: GameItemProps) {
  const path = usePathname();
  const currentGame = path.split("/").at(-1)?.split(".")[0];
  const [isCollapsed, setIsCollapsed] = useState<boolean>(game != currentGame);
  const [isDragOver, setIsDragOver] = useState<boolean>(false);

  const handleDragStart = () => {
    setIsDragOver(true);
  };

  const handleDragEnd = () => {
    setIsDragOver(false);
  };

  return (
    <div className="mb-1" onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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
          <div className="grid grid-cols-5 gap-2 px-2 mb-2">
            {localState.map((state, index) => {
              return <LocalItem key={index} game={game} state={state} onChange={onChange} />;
            })}

            {isDragOver && (
              <>
                <LocalItem game="Add" onChange={onChange} />
                <LocalItem game="Trash" onChange={onChange} />
              </>
            )}
          </div>

          <span className="text-whiteColorAccent text-sm mx-1">Remote State:</span>
          <div className="flex flex-col gap-2 px-2 mb-4">
            {remoteState.map((state, index) => {
              return <RemoteItem key={index} game={game} state={state} />;
            })}
          </div>
        </>
      )}
    </div>
  );
}
