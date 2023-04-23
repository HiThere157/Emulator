"use client";

import { useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/useStorage";
import { sortTypes } from "@/config/static";
import makeApiCall from "@/helpers/api";

import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import Input from "@/components/Input";
import Error from "@/components/Error";
import Category from "@/components/Card/Category";
import GameCard from "@/components/Card/GameCard";
import RomPopup from "@/components/Popup/RomPopup";

import {
  BsArrowBarUp,
  BsStars,
  BsSortDown,
  BsSortAlphaDown,
  BsSortAlphaDownAlt,
} from "react-icons/bs";
import { FiRefreshCw } from "react-icons/fi";
import { PulseLoader } from "react-spinners";

export default function Library() {
  const [roms, setRoms] = useState<ApiResult<RomFile[]>>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedRom, setSelectedRom] = useState<RomFile | null>(null);

  const [search, setSearch] = useState<string>("");
  const searchFilter = (rom: RomFile) => rom.name.toLowerCase().includes(search.toLowerCase());

  const [sortType, setSortType] = useLocalStorage<string>("emulator_library_sortType", "platform");
  const sortFunctionLookup: { [key: string]: (a: RomFile, b: RomFile) => number } = {
    platform: (a: RomFile, b: RomFile) => b.core.localeCompare(a.core),
    "name-asc": (a: RomFile, b: RomFile) => a.name.localeCompare(b.name),
    "name-desc": (a: RomFile, b: RomFile) => b.name.localeCompare(a.name),
    recent: (a: RomFile, b: RomFile) => b.id - a.id,
  };

  const uniqueReducer = (uniqueCores: string[], core: RomFile) => {
    if (!uniqueCores.includes(core.core)) uniqueCores.push(core.core);
    return uniqueCores;
  };

  const fetchRoms = async () => {
    setIsLoading(true);
    setRoms({});
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Prevent flashing of spinner

    setRoms(await makeApiCall<RomFile[]>("/api/roms"));
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRoms();
  }, []);

  return (
    <div>
      <RomPopup
        rom={selectedRom}
        onClose={() => setSelectedRom(null)}
        onRomUpload={(newRom: RomFile) => {
          setRoms({
            error: roms.error,
            result: roms.result ? [...roms.result, newRom] : [newRom],
          });
        }}
        onRomUpdate={(changedRom: RomFile) => {
          setRoms({
            error: roms.error,
            result: roms.result?.map((rom) => (rom.id === changedRom.id ? changedRom : rom)),
          });
        }}
        onRomDelete={(id: number) => {
          setRoms({
            error: roms.error,
            result: roms.result?.filter((rom) => rom.id !== id),
          });
        }}
      />

      <div className="flex justify-between gap-2 m-2">
        <Button
          className="ctrl-blue flex items-center gap-2"
          onClick={() => {
            setSelectedRom({
              id: -1,
              name: "",
              core: "",
              image: "",
              image_resolution: "200x275",
              uploaded_by: -1,
              size: 0,
            } as RomFile);
          }}
        >
          <BsArrowBarUp className="text-xl" />
          <span className="font-bold">Upload Rom</span>
        </Button>
        <Button className="ctrl-flat px-1" onClick={fetchRoms}>
          <FiRefreshCw className="text-lg" />
        </Button>
        <Input value={search} onChange={setSearch} placeholder="Search" />

        <div className="flex-grow" />

        <Dropdown
          values={Object.keys(sortTypes)}
          value={sortType}
          icons={[
            <BsSortDown key={0} />,
            <BsSortAlphaDown key={1} />,
            <BsSortAlphaDownAlt key={2} />,
            <BsStars key={3} />,
          ]}
          lookup={sortTypes}
          label="Sort By"
          onChange={setSortType}
        />
      </div>

      <div className="flex flex-col justify-center items-center gap-2">
        {isLoading && (
          <PulseLoader size="15px" color="#208CF0" className="mt-8" speedMultiplier={0.6} />
        )}
        <Error className="text-2xl mt-6" message={roms.error} />
      </div>

      {roms.result &&
        roms.result
          .filter(searchFilter)
          .sort(sortFunctionLookup[sortType])
          .reduce(uniqueReducer, [] as string[])
          .map((core) => {
            return (
              <Category
                key={core}
                name={core}
                count={roms.result?.filter((rom) => rom.core === core).length ?? 0}
              >
                <div className={"flex flex-wrap gap-2"}>
                  {roms.result
                    ?.filter((rom) => rom.core === core)
                    .filter(searchFilter)
                    .map((rom) => (
                      <GameCard
                        key={rom.id}
                        rom={rom}
                        onDetailsClick={() => setSelectedRom(rom)}
                      />
                    ))}
                </div>
              </Category>
            );
          })}
    </div>
  );
}
