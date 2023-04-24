import { useState } from "react";
import makeApiCall from "@/helpers/api";

import Button from "@/components/Button";
import Error from "@/components/Error";
import StateBox from "@/components/StateManagement/StateBox";

import { FaLongArrowAltDown, FaLongArrowAltUp } from "react-icons/fa";
import { PulseLoader } from "react-spinners";
import { getState, putState } from "@/helpers/indexeddb";

type StateSlotProps = {
  slot: number;
  local?: StateFile;
  remote?: StateFile;
  onDownload: (stateFile: StateFile) => void;
  onUpload: (stateFile: StateFile) => void;
};
export default function StateSlot({ slot, local, remote, onDownload, onUpload }: StateSlotProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const upload = async () => {
    if (!local) return;

    setIsLoading(true);
    setError(undefined);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Prevent flashing of spinner

    const { error } = await makeApiCall<StateFile>(
      `/api/states/${local.rom_id}/${local.slot}`,
      "text",
      {
        method: "PUT",
        body: await getState(local.rom_id, local.slot),
      },
    );

    if (!error) onUpload(local);

    setError(error);
    setIsLoading(false);
  };

  const download = async () => {
    if (!remote) return;

    setIsLoading(true);
    setError(undefined);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Prevent flashing of spinner

    const { error, result } = await makeApiCall<Blob>(
      `/api/states/${remote.rom_id}/${remote.slot}`,
      "buffer",
      {
        method: "GET",
      },
    );

    if (result) await putState(remote.rom_id, remote.slot, result);
    if (!error) onDownload(remote);

    setError(error);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col items-center">
      <StateBox isPresent={!!remote} type="remote" slot={slot} />

      <div className="flex justify-center items-center text-3xl h-20">
        {!isLoading ? (
          <>
            <Button
              className="ctrl-invisible py-2 text-greyColor hover:text-whiteColor"
              onClick={upload}
              disabled={!local}
            >
              <FaLongArrowAltUp />
            </Button>
            <Button
              className="ctrl-invisible py-2 text-greyColor hover:text-whiteColor"
              onClick={download}
              disabled={!remote}
            >
              <FaLongArrowAltDown />
            </Button>
          </>
        ) : (
          <PulseLoader size="15px" color="#208CF0" speedMultiplier={0.6} />
        )}
      </div>

      <StateBox isPresent={!!local} type="local" slot={slot} />

      <Error className="text-xl mt-3" message={error} />
    </div>
  );
}
