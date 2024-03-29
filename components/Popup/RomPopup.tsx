import { useEffect, useState } from "react";
import { cores } from "@/config/static";
import { formatBytes } from "@/helpers/format";
import { getLoginCookie } from "@/helpers/c_cookie";

import Popup from "@/components/Popup/Popup";
import Input from "@/components/Input";
import Dropdown from "@/components/Dropdown";
import Error from "@/components/Error";
import Loader from "@/components/Loader";
import GameImage from "@/components/Card/GameImage";
import RomEditActions from "@/components/RomManagement/RomEditActions";
import RomUploadActions from "@/components/RomManagement/RomUploadActions";
import FileUpload from "@/components/RomManagement/FileUpload";

const resolutions: string[] = ["200x275", "300x200", "260x230"];

type RomPopupProps = {
  rom: RomFile | null;
  onClose: () => any;
  onRomUpload: (newRom: RomFile) => any;
  onRomUpdate: (changedRom: RomFile) => any;
  onRomDelete: (id: number) => any;
};
export default function RomPopup({
  rom,
  onClose,
  onRomUpload,
  onRomUpdate,
  onRomDelete,
}: RomPopupProps) {
  const [result, setResult] = useState<ApiResult<RomFile | undefined>>({});

  const [name, setName] = useState<string>("");
  const [core, setCore] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [resolution, setResolution] = useState<string>("");
  const [romFile, setRomFile] = useState<File>();

  const isAdmin = getLoginCookie()?.role === "Administrator";

  // Reset the form when the popup is opened
  useEffect(() => {
    setResult({});

    setName(rom?.name ?? "");
    setCore(rom?.core ?? "");
    setImage(rom?.image ?? "");
    setResolution(rom?.image_resolution ?? "");
    setRomFile(undefined);
  }, [rom]);

  const getSize = (resolution: string) => {
    const [width, height] = resolution.split("x");
    return { width: parseInt(width || "200"), height: parseInt(height || "275") };
  };

  return (
    <Popup
      isOpen={rom !== null}
      onBackgroundClick={() => {
        if (result !== null) onClose();
      }}
      className="items-center justify-center"
    >
      <div className="rounded border-2 border-el1 bg-lightBg p-4">
        <div className="flex flex-col sm:flex-row">
          <div className="flex flex-col items-center justify-center">
            <div className="relative" style={getSize(resolution)}>
              <GameImage src={image} alt="Image Preview" />
            </div>
            <span className="mt-1 text-greyColor">Size: {formatBytes(rom?.size ?? 0)}</span>
          </div>

          <div className="mx-4 my-2 rounded border-b-2 border-r-2 border-el1" />

          <div className="flex flex-col-reverse justify-end gap-1">
            {/* flex-col-reverse: make the dropdowns not overlap each other */}

            {rom?.id === -1 ? (
              <RomUploadActions
                romCR={{ name, core, image, image_resolution: resolution } as RomFileCR}
                romFile={romFile}
                isLoading={result === null || !isAdmin}
                setResult={setResult}
                onClose={onClose}
                onRomUpload={onRomUpload}
              />
            ) : (
              <RomEditActions
                romCR={{ name, core, image, image_resolution: resolution } as RomFileCR}
                id={rom?.id ?? -1}
                isLoading={result === null || !isAdmin}
                setResult={setResult}
                onClose={onClose}
                onRomUpdate={onRomUpdate}
                onRomDelete={onRomDelete}
              />
            )}

            <div className="flex justify-center">
              <Loader isVisible={result === null} />
              <Error message={result?.error} />
            </div>
            <div className="flex-grow" />

            {rom?.id === -1 && (
              <div>
                <h3 className="text-lg font-bold">Rom File</h3>
                <FileUpload
                  fileName={romFile?.name}
                  onUpload={setRomFile}
                  disabled={result === null || !isAdmin}
                />
              </div>
            )}

            <SettingCategory name="Image">
              <span className="text-greyColor">Image Url:</span>
              <Input
                value={image}
                onChange={setImage}
                className="w-full"
                disabled={result === null || !isAdmin}
              />

              <span className="text-greyColor">Resolution:</span>
              <Dropdown
                values={resolutions}
                value={resolution}
                onChange={setResolution}
                disabled={result === null || !isAdmin}
              />
            </SettingCategory>

            <SettingCategory name="General">
              <span className="text-greyColor">Name:</span>
              <Input
                value={name}
                onChange={setName}
                className="w-full"
                disabled={result === null || !isAdmin}
              />

              <span className="text-greyColor">Platform:</span>
              <Dropdown
                values={Object.keys(cores)}
                value={core}
                lookup={cores}
                onChange={setCore}
                disabled={result === null || !isAdmin}
              />
            </SettingCategory>
          </div>
        </div>
      </div>
    </Popup>
  );
}

type SettingCategoryProps = {
  name: string;
  children: React.ReactNode;
};
function SettingCategory({ name, children }: SettingCategoryProps) {
  return (
    <div>
      <h3 className="text-lg font-bold">{name}</h3>
      <div className="m-1 grid grid-cols-[auto_1fr] gap-1">{children}</div>
    </div>
  );
}
