import { useState, useEffect } from "react";

import { getStates } from "@/helpers/indexeddb";

import Popup from "../Popup";
import GameItem from "./GameItem";

type StateProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => any;
};
export default function State({ isOpen, setIsOpen }: StateProps) {
  const [remoteStates, setRemoteStates] = useState<StateFile[]>([]);
  const [localStates, setLocalStates] = useState<State[]>([]);

  const fetchStates = async () => {
    const result = await fetch("/api/states");
    const remoteStates: StateFile[] = await result.json();
    setRemoteStates(remoteStates);

    const localStates = await getStates();
    setLocalStates(localStates);
  };

  useEffect(() => {
    if (isOpen) {
      fetchStates();
    }
  }, [isOpen]);

  return (
    <Popup isOpen={isOpen} onBackgroundClick={() => setIsOpen(false)}>
      <div className="w-[45rem] max-w-[100vw] rounded-md p-5 bg-lightBg">
        <div className="max-h-[65vh] p-5 rounded-md overflow-auto bg-darkBg">
          {Array.from(
            new Set([
              ...remoteStates.map((state) => state.game),
              ...localStates.map((state) => state.game),
            ]),
          )
            .sort((a: string, b: string) => a.localeCompare(b)).map((game, index) => {
              return (
                <GameItem
                  key={index}
                  game={game}
                  remoteState={remoteStates.filter((state) => state.game == game)}
                  localState={localStates.filter((state) => state.game == game)}
                  onChange={fetchStates}
                />
              );
            })}
        </div>
      </div>
    </Popup>
  );
}
