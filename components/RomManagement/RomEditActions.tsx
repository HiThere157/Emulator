import { useEffect, useState } from "react";
import makeApiCall from "@/helpers/api";

import Button from "@/components/Button";

import { BsFillTrashFill, BsSave } from "react-icons/bs";
import { PulseLoader } from "react-spinners";

type RomEditActionsProps = {
  romCR: RomFileCR;
  id: number;
  setError: (error?: string) => any;
  setIsBusy: (isBusy: boolean) => any;
  onClose: () => any;
  onRomUpdate: (rom: RomFile) => any;
  onRomDelete: (id: number) => any;
};
export default function RomEditActions({
  romCR,
  id,
  setError,
  setIsBusy,
  onClose,
  onRomUpdate,
  onRomDelete,
}: RomEditActionsProps) {
  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState<boolean>(false);

  const updateRom = async () => {
    setIsSaveLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Prevent flashing of spinner

    const { error, result } = await makeApiCall<RomFile>(`/api/roms/${id}`, {
      method: "PUT",
      body: JSON.stringify(romCR),
    });

    if (result) onRomUpdate(result);
    if (!error) onClose();

    setError(error);
    setIsSaveLoading(false);
  };

  const deleteRom = async () => {
    setIsDeleteLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Prevent flashing of spinner

    const { error } = await makeApiCall(`/api/roms/${id}`, {
      method: "DELETE",
    });

    if (!error) {
      onClose();
      onRomDelete(id);
    }

    setError(error);
    setIsDeleteLoading(false);
  };

  useEffect(() => {
    setIsBusy(isSaveLoading || isDeleteLoading);
  }, [isSaveLoading, isDeleteLoading]);

  return (
    <div className="flex gap-2 mt-2">
      <Button
        className="ctrl-red flex items-center gap-2"
        onClick={deleteRom}
        disabled={isSaveLoading || isDeleteLoading}
      >
        {isDeleteLoading ? (
          <PulseLoader size="8px" color="#F0F0F0" speedMultiplier={0.6} />
        ) : (
          <>
            <BsFillTrashFill className="text-xl" />
            <span className="font-bold mr-1">Delete</span>
          </>
        )}
      </Button>

      <div className="flex-grow" />

      <Button
        className="ctrl-flat flex items-center gap-2"
        onClick={onClose}
        disabled={isSaveLoading || isDeleteLoading}
      >
        <span className="font-bold mr-1">Cancel</span>
      </Button>
      <Button
        className="ctrl-blue flex items-center gap-2"
        onClick={updateRom}
        disabled={isSaveLoading || isDeleteLoading}
      >
        {isSaveLoading ? (
          <PulseLoader size="8px" color="#F0F0F0" speedMultiplier={0.6} />
        ) : (
          <>
            <BsSave className="text-lg mx-0.5" />
            <span className="font-bold mr-1">Save</span>
          </>
        )}
      </Button>
    </div>
  );
}
