"use client";

import { useEffect, useState } from "react";
import makeApiCall from "@/helpers/api";
import { getStates } from "@/helpers/indexeddb";

import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import Error from "@/components/Error";
import Loader from "@/components/Loader";
import Slot from "@/components/SlotManagement/Slot";

import { FiRefreshCw } from "react-icons/fi";

export default function Library() {
  const [roms, setRoms] = useState<ApiResult<RomFile[]>>(null);
  const [remoteState, setRemoteState] = useState<ApiResult<StateFile[]>>(null);
  const [localState, setLocalState] = useState<ApiResult<StateFile[]>>(null);

  const [selectedRomId, setSelectedRomId] = useState<string>("");

  const fetchData = async () => {
    setLocalState(null);
    setRemoteState(null);

    const romsReq = makeApiCall<RomFile[]>("/api/roms", undefined);
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
      <div className="flex gap-2 m-2">
        <Dropdown
          values={roms?.result?.map((rom) => rom.id.toString()) ?? []}
          value={selectedRomId}
          lookup={Object.fromEntries(
            roms?.result?.map((rom) => [rom.id.toString(), rom.name]) ?? [],
          )}
          label="Game"
          justify="start"
          onChange={setSelectedRomId}
        />

        <Button className="ctrl-flat px-1" onClick={fetchData}>
          <FiRefreshCw className="text-lg" />
        </Button>
      </div>

      <div className="flex flex-col justify-center items-center gap-2 m-4">
        <Loader isVisible={roms === null || remoteState === null || localState === null} />
        <Error
          className="text-2xl"
          message={roms?.error ?? remoteState?.error ?? localState?.error}
        />
      </div>

      <div className="flex justify-center gap-5 p-2">
        {[1, 2, 3, 4, 5].map((slot) => (
          <Slot
            key={slot}
            remoteState={remoteState?.result?.find(
              (state) => state.slot === slot && state.rom_id.toString() === selectedRomId,
            )}
            localState={localState?.result?.find(
              (state) => state.slot === slot && state.rom_id.toString() === selectedRomId,
            )}
            onSubmit={fetchData}
          />
        ))}
      </div>
    </div>
  );
}