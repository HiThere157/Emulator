"use client";

import { useEffect, useState } from "react";
import makeApiCall from "@/helpers/api";

import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import Input from "@/components/Input";
import Error from "@/components/Error";
import Loader from "@/components/Loader";
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

const uniqueReducer = (uniqueCores: string[], core: RomFile) => {
  if (!uniqueCores.includes(core.core)) uniqueCores.push(core.core);
  return uniqueCores;
};

const sortTypes: { [key: string]: string } = {
  platform: "Platform",
  "name-asc": "Name (A → Z)",
  "name-desc": "Name (Z → A)",
  recent: "Recently Added",
};

const sortFunctions: { [key: string]: (a: RomFile, b: RomFile) => number } = {
  platform: (a: RomFile, b: RomFile) => b.core.localeCompare(a.core),
  "name-asc": (a: RomFile, b: RomFile) => a.name.localeCompare(b.name),
  "name-desc": (a: RomFile, b: RomFile) => b.name.localeCompare(a.name),
  recent: (a: RomFile, b: RomFile) => b.id - a.id,
};

export default function LibraryPage() {
  const [roms, setRoms] = useState<ApiResult<RomFile[]>>(null);
  const [selectedRom, setSelectedRom] = useState<RomFile | null>(null);

  const [search, setSearch] = useState<string>("");
  const [sortType, setSortType] = useState<string>("name-asc");

  const searchFilter = (rom: RomFile) => rom.name.toLowerCase().includes(search.toLowerCase());

  const fetchData = async () => {
    setRoms(null);
    setRoms(await makeApiCall<RomFile[]>("/api/roms", undefined, 750));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <RomPopup
        rom={selectedRom}
        onClose={() => setSelectedRom(null)}
        onRomUpload={(newRom: RomFile) => {
          setRoms({
            result: roms?.result ? [...roms.result, newRom] : [newRom],
          });
        }}
        onRomUpdate={(changedRom: RomFile) => {
          setRoms({
            result: roms?.result?.map((rom) => (rom.id === changedRom.id ? changedRom : rom)),
          });
        }}
        onRomDelete={(id: number) => {
          setRoms({
            result: roms?.result?.filter((rom) => rom.id !== id),
          });
        }}
      />

      <div className="flex justify-center flex-wrap gap-2 m-2">
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
        <Button className="ctrl-flat px-1 group" onClick={fetchData} disabled={roms === null}>
          <FiRefreshCw className="text-lg group-hover:rotate-180 duration-150" />
        </Button>
        <Input value={search} onChange={setSearch} placeholder="Search" />

        <div className="hidden sm:block flex-grow" />

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
        <Loader isVisible={roms === null} />
        <Error className="text-2xl" message={roms?.error} />
      </div>

      <div className="flex flex-col gap-2 p-2">
        {roms?.result &&
          roms.result
            .filter(searchFilter)
            .sort(sortFunctions[sortType])
            .reduce(uniqueReducer, [] as string[])
            .map((core) => {
              return (
                <Category
                  key={core}
                  name={core}
                  count={roms.result?.filter((rom) => rom.core === core).length ?? 0}
                >
                  <div className="flex-col items-center sm:flex-row sm:items-start flex flex-wrap gap-2">
                    {roms.result
                      ?.filter((rom) => rom.core === core)
                      .filter(searchFilter)
                      .sort(sortFunctions[sortType])
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
    </div>
  );
}
