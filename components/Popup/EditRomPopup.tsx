import { useEffect, useState } from "react";
import { cores, resolutions } from "@/config/static";
import { formatBytes } from "@/helpers/format";
import makeApiCall from "@/helpers/api";

import Popup from "@/components/Popup/Popup";
import Input from "@/components/Input";
import Dropdown from "@/components/Dropdown";
import Button from "@/components/Button";
import GameImage from "@/components/Card/GameImage";

import { BsFillTrashFill, BsSave } from "react-icons/bs";
import { PulseLoader } from "react-spinners";
import Error from "../Error";

type EditRomPopupProps = {
  rom: RomFile | null;
  onClose: () => any;
};
export default function EditRomPopup({ rom, onClose }: EditRomPopupProps) {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [core, setCore] = useState<string>("");
  const [image, setImage] = useState<string>("");

  const [resolution, setResolution] = useState<string>("");

  useEffect(() => {
    setName(rom?.name ?? "");
    setCore(rom?.core ?? "");
    setImage(rom?.image ?? "");
    setResolution(rom?.image_resolution ?? "");
  }, [rom]);

  const getSize = (resolution: string) => {
    const [width, height] = resolution.split("x");
    return { width: parseInt(width), height: parseInt(height) };
  };

  const updateRom = async () => {
    setIsLoading(true);

    const [error] = await makeApiCall(`/api/roms/${rom?.id}`, {
      method: "PUT",
      body: JSON.stringify({ name, core, image, image_resolution: resolution } as RomFileCR),
    });

    // wait for 1 second to prevent flashing of spinner
    // UX improvement
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (!error) onClose();

    setError(error);
    setIsLoading(false);
  };

  return (
    <Popup isOpen={rom !== null} onBackgroundClick={onClose}>
      <div className="p-4 rounded border-2 bg-lightBg border-el1">
        <div className="flex">
          <div className="flex flex-col items-center justify-center">
            <div className="relative" style={getSize(resolution)}>
              <GameImage src={image} alt="Image Preview" />
            </div>
            <span className="text-greyColor mt-1">Size: {formatBytes(rom?.size ?? 0)}</span>
          </div>

          <div className="mx-4 my-2 rounded border-r-2 border-el1" />

          <div className="flex flex-col-reverse justify-end gap-1">
            {/* flex-col-reverse: make the dropdowns not overlap each other */}
            <div className="flex gap-2 mt-2">
              <Button className="ctrl-red flex items-center gap-2" onClick={() => { }}>
                <BsFillTrashFill className="text-xl" />
                <span className="font-bold mr-1">Delete</span>
              </Button>

              <div className="flex-grow" />

              <Button className="ctrl-flat flex items-center gap-2" onClick={onClose}>
                <span className="font-bold mr-1">Cancel</span>
              </Button>

              <Button className="ctrl-blue flex items-center gap-2" onClick={updateRom}>
                {isLoading ? <PulseLoader size="8px" color="#F0F0F0" speedMultiplier={0.6} /> : (
                  <>
                    <BsSave className="text-lg mx-0.5" />
                    <span className="font-bold mr-1">Save</span>
                  </>
                )}
              </Button>
            </div>

            <div className="flex justify-center">
              <Error message={error} />
            </div>
            <div className="flex-grow" />

            <SettingCategory name="Image">
              <span className="text-greyColor">Image Url:</span>
              <Input value={image} onChange={setImage} />

              <span className="text-greyColor">Resolution:</span>
              <Dropdown values={resolutions} value={resolution} onChange={setResolution} />
            </SettingCategory>

            <SettingCategory name="General Settings">
              <span className="text-greyColor">Name:</span>
              <Input value={name} onChange={setName} />

              <span className="text-greyColor">Platform:</span>
              <Dropdown
                values={Object.keys(cores)}
                value={core}
                lookup={cores}
                onChange={setCore}
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
      <div className="grid grid-cols-[auto_1fr] gap-1 m-1">{children}</div>
    </div>
  );
}
