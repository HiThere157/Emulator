import { useState } from "react";
import makeApiCall from "@/helpers/api";
import { getState, putState } from "@/helpers/indexeddb";

import Button from "@/components/Button";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import State from "@/components/SlotManagement/State";

import { BsArrowDown, BsArrowUp } from "react-icons/bs";

type SlotProps = {
  remoteState?: StateFile;
  localState?: StateFile;
  onSubmit: () => void;
};
export default function Slot({ remoteState, localState, onSubmit }: SlotProps) {
  const [result, setResult] = useState<ApiResult<undefined | Uint8Array>>({});

  const uploadState = async () => {
    if (!localState) return;

    setResult(null);

    const dbReq = await getState(localState.rom_id, localState?.slot);
    if (dbReq?.error) {
      setResult(dbReq);
      return;
    }

    const blobReq = await makeApiCall<undefined>(
      `/api/states/${localState.rom_id}/${localState.slot}`,
      {
        method: "PUT",
        body: dbReq?.result,
      },
    );

    setResult(blobReq);

    if (!blobReq?.error) {
      onSubmit();
    }
  };

  const downloadState = async () => {
    if (!remoteState) return;

    setResult(null);

    const response = await makeApiCall<Uint8Array>(
      `/api/states/${remoteState.rom_id}/${remoteState.slot}`,
      undefined,
      0,
      true,
    );
    if (response?.error || !response?.result) {
      setResult(response);
      return;
    }

    const dbRequest = await putState(remoteState.rom_id, remoteState.slot, response?.result);
    setResult(dbRequest);

    if (!dbRequest?.error) {
      onSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <State state={remoteState} type="remote" />

      <div className="flex justify-center gap-5">
        <Button className="ctrl-invisible py-2" onClick={uploadState} disabled={!localState}>
          <BsArrowUp className="text-3xl" />
        </Button>

        <Button className="ctrl-invisible py-2" onClick={downloadState} disabled={!remoteState}>
          <BsArrowDown className="text-3xl" />
        </Button>
      </div>

      <State state={localState} type="local" />

      <div className="flex flex-col justify-center items-center gap-2 m-4">
        <Loader isVisible={result === null} />
        <Error className="text-2xl" message={result?.error} />
      </div>
    </div>
  );
}
