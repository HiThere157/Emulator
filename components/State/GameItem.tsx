import { useState } from "react";
import { usePathname } from "next/navigation";

import { makeRomFriendlyName } from "@/helpers/format";

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

  const freeSlots = Array.from({ length: 9 }, (_, i) => i + 1)
    .map((i) => i.toString())
    .filter((slot) => !localState.some((state) => state.slot == slot));

  return (
    <div className="mb-1">
      <div>
        <Button className="px-2 w-full" onClick={() => setIsCollapsed(!isCollapsed)}>
          <div className="flex items-center gap-1">
            <div className="text-xl">{isCollapsed ? <BsPlus /> : <BsDash />}</div>
            <span className="text-lg">{makeRomFriendlyName(game)}</span>
          </div>
        </Button>
      </div>
      {!isCollapsed && (
        <>
          <span className="text-whiteColorAccent text-sm mx-1">Local State:</span>
          <div className="grid grid-cols-5 gap-2 px-2 mb-2">
            {localState.map((state, index) => {
              return (
                <LocalItem
                  key={index}
                  game={game}
                  slot={state.slot}
                  data={state.data}
                  onChange={onChange}
                />
              );
            })}

            {freeSlots.length !== 0 && (
              <LocalItem role="Add" game={game} slot={freeSlots[0]} onChange={onChange} />
            )}
            <LocalItem role="Trash" game={game} slot="0" onChange={onChange} />
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
