"use client";

import { useEffect, useState } from "react";
import makeApiCall from "@/helpers/api";
import { getStates } from "@/helpers/indexeddb";

import Dropdown from "@/components/Dropdown";
import Button from "@/components/Button";
import Error from "@/components/Error";

import { FiRefreshCw } from "react-icons/fi";
import { PulseLoader } from "react-spinners";

export default function States() {
  const [state, setState] = useState<ApiResult<State> | null>({});

  const [roms, setRoms] = useState<ApiResult<RomFile[]>>({});
  const [selectedRomId, setSelectedRomId] = useState<string>("");

  const fetchData = async () => {
    setState(null);
    setRoms({ result: roms.result }); // Keep current result and delete error

    await new Promise((resolve) => setTimeout(resolve, 1000)); // Prevent flashing of spinner

    const [newRoms, remoteStates, localStates] = await Promise.all([
      makeApiCall<RomFile[]>("/api/roms"),
      makeApiCall<StateFile[]>("/api/states"),
      getStates(),
    ]);

    setState({
      error: remoteStates.error,
      result: {
        remote: remoteStates.result,
        local: localStates,
      },
    });
    setRoms(newRoms);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div className="flex justify-between gap-2 m-2">
        <Button className="ctrl-flat px-1" onClick={fetchData}>
          <FiRefreshCw className="text-lg" />
        </Button>

        <Dropdown
          label="Rom"
          value={selectedRomId}
          values={roms.result?.map((rom) => rom.id.toString()) ?? []}
          lookup={Object.fromEntries(
            roms.result?.map((rom) => [rom.id.toString(), rom.name]) ?? [],
          )}
          onChange={setSelectedRomId}
        />
      </div>

      <div className="flex flex-col justify-center items-center gap-2">
        {state === null && (
          <PulseLoader size="15px" color="#208CF0" className="mt-8" speedMultiplier={0.6} />
        )}
        <Error className="text-2xl mt-6" message={state?.error ?? roms?.error} />
      </div>
    </div>
  );
}
