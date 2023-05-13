import { useState } from "react";
import makeApiCall from "@/helpers/c_api";
import { deleteState, getState, putState } from "@/helpers/c_indexeddb";

import Button from "@/components/Button";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import State from "@/components/SlotManagement/State";
import Title from "@/components/Title";

import { BsArrowDown, BsArrowUp } from "react-icons/bs";

type SlotProps = {
  remoteState?: StateFile;
  localState?: StateFile;
  onSubmit: () => void;
};
export default function Slot({ remoteState, localState, onSubmit }: SlotProps) {
  const [result, setResult] = useState<ApiResult<ArrayBuffer | undefined>>({});

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
    const blobResult = await makeApiCall<ArrayBuffer>(
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
    const dbResult = await putState(
      remoteState.rom_id,
      remoteState.slot,
      new Uint8Array(blobResult?.result),
    );
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
    <div className="flex flex-col items-center gap-5">
      <State state={remoteState} type="remote" onDelete={deleteRemoteState} />

      <div className="flex justify-center gap-5">
        <Title text="Upload to Server" position="bottom">
          <Button
            className="ctrl-invisible py-2"
            onClick={uploadState}
            disabled={!localState || result === null}
          >
            <BsArrowUp className="text-3xl" />
          </Button>
        </Title>

        <Title text="Download to Client" position="bottom">
          <Button
            className="ctrl-invisible py-2"
            onClick={downloadState}
            disabled={!remoteState || result === null}
          >
            <BsArrowDown className="text-3xl" />
          </Button>
        </Title>
      </div>

      <State state={localState} type="local" onDelete={deleteLocalState} />

      <div className="flex flex-col justify-center items-center gap-2 m-4">
        <Loader isVisible={result === null} />
        <Error className="text-2xl max-w-min" message={result?.error} />
      </div>
    </div>
  );
}
