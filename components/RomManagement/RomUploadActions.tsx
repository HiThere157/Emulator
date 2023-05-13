import makeApiCall from "@/helpers/c_api";

import Button from "@/components/Button";

import { BsSave } from "react-icons/bs";

type RomUploadActionsProps = {
  romCR: RomFileCR;
  romFile?: File;
  isLoading: boolean;
  setResult: (result: ApiResult<RomFile>) => any;
  onClose: () => any;
  onRomUpload: (newRom: RomFile) => any;
};
export default function RomUploadActions({
  romCR,
  romFile,
  isLoading,
  setResult,
  onClose,
  onRomUpload,
}: RomUploadActionsProps) {
  const uploadRom = async () => {
    setResult(null);

    if (!romFile) {
      setResult({ error: "No file selected" });
      return;
    }

    // Create the rom in the database
    const dbResult = await makeApiCall<RomFile>(
      `/api/roms`,
      {
        method: "POST",
        body: JSON.stringify(romCR),
      },
      750,
    );
    if (dbResult?.error || dbResult?.result?.id === undefined) {
      setResult(dbResult);
      return;
    }

    // Upload the rom file
    const blobResult = await makeApiCall<undefined>(`/api/roms/${dbResult.result.id}`, {
      method: "PUT",
      body: romFile,
    });
    setResult(blobResult);

    // Add the rom to the list
    if (!blobResult?.error) {
      onRomUpload(dbResult.result);
      onClose();
    }
  };

  return (
    <div className="flex justify-end gap-2 mt-2">
      <Button className="ctrl-flat font-bold" onClick={onClose} disabled={isLoading}>
        Cancel
      </Button>
      <Button
        className="ctrl-blue flex items-center gap-1.5"
        onClick={uploadRom}
        disabled={isLoading}
      >
        <BsSave className="text-lg" />
        <span className="font-bold">Save</span>
      </Button>
    </div>
  );
}
