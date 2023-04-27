import { useState } from "react";
import makeApiCall from "@/helpers/api";
import { deleteState, getState, putState } from "@/helpers/indexeddb";

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
  const [result, setResult] = useState<ApiResult<Uint8Array | undefined>>({});

  const uploadState = async () => {
    if (!localState) return;
    setResult(null);

    // Get the state from indexeddb
    const [dbResult] = await Promise.all([
      getState(localState.rom_id, localState?.slot),
      new Promise((resolve) => setTimeout(resolve, 750)),
    ]);
    if (dbResult?.error) {
      setResult(dbResult);
      return;
    }

    // Upload the state to the server
    const blobResult = await makeApiCall<undefined>(
      `/api/states/${localState.rom_id}/${localState.slot}`,
      {
        method: "PUT",
        body: dbResult?.result,
      },
    );
    setResult(blobResult);

    if (!blobResult?.error) {
      onSubmit();
    }
  };

  const downloadState = async () => {
    if (!remoteState) return;
    setResult(null);

    // Download the state from the server
    const blobResult = await makeApiCall<Uint8Array>(
      `/api/states/${remoteState.rom_id}/${remoteState.slot}`,
      undefined,
      750,
      true,
    );
    if (blobResult?.error || !blobResult?.result) {
      setResult(blobResult);
      return;
    }

    // Save the state to indexeddb
    const dbResult = await putState(remoteState.rom_id, remoteState.slot, blobResult?.result);
    setResult(dbResult);

    if (!dbResult?.error) {
      onSubmit();
    }
  };

  const deleteLocalState = async () => {
    if (!localState) return;
    setResult(null);

    const [dbResult] = await Promise.all([
      deleteState(localState.rom_id, localState.slot),
      new Promise((resolve) => setTimeout(resolve, 750)),
    ]);
    setResult(dbResult);

    if (!dbResult?.error) {
      onSubmit();
    }
  };

  const deleteRemoteState = async () => {
    if (!remoteState) return;
    setResult(null);

    const dbResult = await makeApiCall<undefined>(
      `/api/states/${remoteState.rom_id}/${remoteState.slot}`,
      {
        method: "DELETE",
      },
      750,
    );
    setResult(dbResult);

    if (!dbResult?.error) {
      onSubmit();
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <State state={remoteState} type="remote" onDelete={deleteRemoteState} />

      <div className="flex justify-center gap-5">
        <Button className="ctrl-invisible py-2" onClick={uploadState} disabled={!localState}>
          <BsArrowUp className="text-3xl" />
        </Button>

        <Button className="ctrl-invisible py-2" onClick={downloadState} disabled={!remoteState}>
          <BsArrowDown className="text-3xl" />
        </Button>
      </div>

      <State state={localState} type="local" onDelete={deleteLocalState} />

      <div className="flex flex-col justify-center items-center gap-2 m-4">
        <Loader isVisible={result === null} />
        <Error className="text-2xl" message={result?.error} />
      </div>
    </div>
  );
}
