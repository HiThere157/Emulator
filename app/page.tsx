"use client";

import { useEffect, useState } from "react";
import makeApiCall from "@/helpers/api";

import Button from "@/components/Button";
import Dropdown from "@/components/Dropdown";
import Category from "@/components/Card/Category";
import Error from "@/components/Error";
import Input from "@/components/Input";

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
  const [roms, setRoms] = useState<RomFile[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState<string>("");
  const [sortType, setSortType] = useState<number>(0);
  const sortTypeLookup = ["Platform", "Name (A → Z)", "Name (Z → A)", "Recently Added"];
  const sortFunctionLookup = [
    (a: RomFile, b: RomFile) => b.core.localeCompare(a.core),
    (a: RomFile, b: RomFile) => a.name.localeCompare(b.name),
    (a: RomFile, b: RomFile) => b.name.localeCompare(a.name),
    (a: RomFile, b: RomFile) => b.id - a.id,
  ];

  const fetchRoms = async () => {
    setError(null);
    setRoms(null);

    const [error, result] = await makeApiCall<RomFile[]>("/api/roms");

    // wait for 1 second to prevent flashing of spinner
    // UX improvement
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (error) return setError(error);
    setRoms(result);
  };

  useEffect(() => {
    fetchRoms();
  }, []);

  return (
    <div>
      <div className="flex justify-between gap-2 m-2">
        <Button theme="color" className="flex items-center gap-2" onClick={() => { }}>
          <BsArrowBarUp className="text-xl" />
          <span>Upload Rom</span>
        </Button>
        <Button theme="flat" className="px-1" onClick={fetchRoms}>
          <FiRefreshCw className="text-lg" />
        </Button>
        <Input value={search} onChange={setSearch} placeholder="Search" />

        <div className="flex-grow" />

        <Dropdown
          values={sortTypeLookup}
          icons={[
            <BsSortDown key={0} />,
            <BsSortAlphaDown key={1} />,
            <BsSortAlphaDownAlt key={2} />,
            <BsStars key={3} />,
          ]}
          value={sortTypeLookup[sortType]}
          label="Sort By"
          onChange={(_value: string, index: number) => setSortType(index)}
        />
      </div>

      <div className="flex flex-col justify-center items-center gap-2">
        {roms === null && !error && <PulseLoader size="15px" color="#208CF0" className="mt-8" speedMultiplier={0.6} />}
        <Error className="text-2xl mt-6" message={error} />
      </div>

      {roms &&
        Array.from(
          new Set(
            roms
              .filter((rom) => rom.name.toLowerCase().includes(search.toLowerCase()))
              .sort(sortFunctionLookup[sortType])
              .map((rom) => rom.core),
          ),
        ).map((core) => {
          return (
            <Category
              key={core}
              name={core}
              roms={roms.filter(
                (rom) => rom.core === core && rom.name.toLowerCase().includes(search.toLowerCase()),
              )}
            />
          );
        })}
    </div>
  );
}
