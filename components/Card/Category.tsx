"use client";

import { useState } from "react";
import { cores } from "@/config/lookups";

import Button from "@/components/Button";
import GameCard from "@/components/Card/GameCard";

import { FiChevronDown } from "react-icons/fi";

type CategoryProps = {
  name: string;
  roms: RomFile[];
};
export default function Category({ name, roms }: CategoryProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <div className="p-2">
      <Button
        theme="invisible"
        className="flex items-center w-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-2xl font-bold mr-1">{cores[name] ?? name}</h2>
        <span className="text-greyColor">({roms.length})</span>

        <hr className="flex-grow mx-3 text-greyColor" />

        <FiChevronDown
          className={
            "text-3xl transition-transform duration-150 " + (isOpen ? "rotate-180" : "rotate-0")
          }
        />
      </Button>

      <div
        className={
          "flex flex-wrap gap-2 overflow-hidden transition-size duration-200 " +
          (isOpen ? "max-h-screen" : "max-h-0")
        }
      >
        {roms.map((rom, index) => (
          <GameCard key={index} rom={rom} />
        ))}
      </div>
    </div>
  );
}
