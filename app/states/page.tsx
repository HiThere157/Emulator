"use client";

import { useEffect, useState } from "react";
import makeApiCall from "@/helpers/c_api";
import { getStates } from "@/helpers/c_indexeddb";
import { getLoginCookie } from "@/helpers/c_cookie";

import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import Error from "@/components/Error";
import Loader from "@/components/Loader";
import Slot from "@/components/SlotManagement/Slot";

import { FiRefreshCw } from "react-icons/fi";

export default function StatesPage() {
  const [roms, setRoms] = useState<ApiResult<RomFile[]>>(null);
  const [remoteState, setRemoteState] = useState<ApiResult<StateFile[]>>(null);
  const [localState, setLocalState] = useState<ApiResult<StateFile[]>>(null);

  const [selectedRomId, setSelectedRomId] = useState<string>("");
  const userId = getLoginCookie()?.id;

  const fetchData = async () => {
    setLocalState(null);
    setRemoteState(null);

    const romsReq = makeApiCall<RomFile[]>("/api/roms");
    const remoteStateReq = makeApiCall<StateFile[]>("/api/states", undefined, 750);
    const localStateReq = getStates();

    const [romsResult, remoteStateResult, localStateResult] = await Promise.all([
      romsReq,
      remoteStateReq,
      localStateReq,
    ]);

    setRoms(romsResult);
    setRemoteState(remoteStateResult);
    setLocalState(localStateResult);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="m-2 flex gap-2">
        <Dropdown
          values={
            roms?.result
              ?.sort((a, b) => a.name.localeCompare(b.name))
              .map((rom) => rom.id.toString()) ?? []
          }
          value={selectedRomId}
          placeholder="Select a Game"
          lookup={Object.fromEntries(
            roms?.result?.map((rom) => [rom.id.toString(), rom.name]) ?? [],
          )}
          label="Game"
          justify="start"
          onChange={setSelectedRomId}
        />

        <Button
          className="ctrl-flat group px-1"
          onClick={fetchData}
          disabled={roms === null || remoteState === null || localState === null}
        >
          <FiRefreshCw className="text-lg duration-150 group-hover:rotate-180" />
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center gap-2">
        <Loader isVisible={roms === null || remoteState === null || localState === null} />
        <Error
          className="text-2xl"
          message={roms?.error ?? remoteState?.error ?? localState?.error}
        />
      </div>

      <div className="flex flex-wrap justify-center gap-5 p-2">
        {[1, 2, 3, 4, 5].map((slot) => (
          <Slot
            key={slot}
            remoteState={remoteState?.result?.find(
              (state) =>
                state.user_id === userId &&
                state.rom_id.toString() === selectedRomId &&
                state.slot === slot,
            )}
            localState={localState?.result?.find(
              (state) => state.rom_id.toString() === selectedRomId && state.slot === slot,
            )}
            onSubmit={fetchData}
          />
        ))}
      </div>
    </div>
  );
}
