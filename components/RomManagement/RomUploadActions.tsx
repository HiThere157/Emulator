import { useEffect, useState } from "react";
import makeApiCall from "@/helpers/api";

import Button from "@/components/Button";

import { BsSave } from "react-icons/bs";
import { PulseLoader } from "react-spinners";

type RomUploadActionsProps = {
  romCR: RomFileCR;
  romFile?: File;
  setError: (error?: string) => any;
  setIsBusy: (isBusy: boolean) => any;
  onClose: () => any;
  onRomUpload: (rom: RomFile) => any;
};
export default function RomUploadActions({
  romCR,
  romFile,
  setError,
  setIsBusy,
  onClose,
  onRomUpload,
}: RomUploadActionsProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const uploadRom = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Prevent flashing of spinner

    if (!romFile) {
      setError("No ROM file uploaded");
      setIsLoading(false);
      return;
    }

    const { error: db_error, result: db_result } = await makeApiCall<RomFile>(`/api/roms`, {
      method: "POST",
      body: JSON.stringify(romCR),
    });

    setError(db_error);

    if (db_result && !db_error) {
      const { error: blob_error } = await makeApiCall<RomFile>(`/api/roms/${db_result.id}/blob`, {
        method: "POST",
        body: romFile,
      });

      onRomUpload(db_result);
      if (!blob_error) onClose();
      setError(blob_error);
    }

    setIsLoading(false);
  };

  useEffect(() => {
    setIsBusy(isLoading);
  }, [isLoading]);

  return (
    <div className="flex justify-end gap-2 mt-2">
      <Button className="ctrl-flat flex items-center gap-2" onClick={onClose} disabled={isLoading}>
        <span className="font-bold mr-1">Cancel</span>
      </Button>
      <Button
        className="ctrl-blue flex items-center gap-2"
        onClick={uploadRom}
        disabled={isLoading}
      >
        {isLoading ? (
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
