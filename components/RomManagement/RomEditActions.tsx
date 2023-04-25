import makeApiCall from "@/helpers/api";

import Button from "@/components/Button";

import { BsFillTrashFill, BsSave } from "react-icons/bs";

type RomEditActionsProps = {
  romCR: RomFileCR;
  id: number;
  isLoading: boolean;
  setResult: (result: ApiResult<RomFile>) => any;
  onClose: () => any;
  onRomUpdate: (changedRom: RomFile) => any;
  onRomDelete: (id: number) => any;
};
export default function RomEditActions({
  romCR,
  id,
  isLoading,
  setResult,
  onClose,
  onRomUpdate,
  onRomDelete,
}: RomEditActionsProps) {
  const updateRom = async () => {
    setResult(null);

    const response = await makeApiCall<RomFile>(`/api/roms/${id}/meta`, {
      method: "POST",
      body: JSON.stringify(romCR),
    });
    setResult(response);

    if (!response?.error && response?.result) {
      onRomUpdate(response.result);
      onClose();
    }
  };

  const deleteRom = async () => {
    setResult(null);

    const response = await makeApiCall<RomFile>(`/api/roms/${id}/meta`, {
      method: "DELETE",
    });
    setResult(response);

    if (!response?.error) {
      onRomDelete(id);
      onClose();
    }
  };

  return (
    <div className="flex gap-2 mt-2">
      <Button className="ctrl-red flex items-center gap-2" onClick={deleteRom} disabled={isLoading}>
        <BsFillTrashFill className="text-xl" />
        <span className="font-bold mr-1">Delete</span>
      </Button>

      <div className="flex-grow" />

      <Button className="ctrl-flat flex items-center gap-2" onClick={onClose} disabled={isLoading}>
        <span className="font-bold mr-1">Cancel</span>
      </Button>
      <Button
        className="ctrl-blue flex items-center gap-2"
        onClick={updateRom}
        disabled={isLoading}
      >
        <BsSave className="text-lg mx-0.5" />
        <span className="font-bold mr-1">Save</span>
      </Button>
    </div>
  );
}
