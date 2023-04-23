"use client";

import { useState } from "react";
import { cores } from "@/config/static";

import Button from "@/components/Button";

import { FiChevronDown } from "react-icons/fi";

type CategoryProps = {
  name: string;
  count: number;
  isGrid: boolean;
  children?: React.ReactNode;
};
export default function Category({ name, count, isGrid, children }: CategoryProps) {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  return (
    <div className="p-2">
      <Button
        className="ctrl-invisible flex items-center w-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="text-2xl font-bold mr-1">{cores[name] ?? name}</h2>
        <span className="text-greyColor">({count})</span>

        <hr className="flex-grow mx-3 border-t-2 rounded text-greyColor" />

        <FiChevronDown
          className={
            "text-3xl transition-transform duration-150 " + (isOpen ? "rotate-180" : "rotate-0")
          }
        />
      </Button>

      <div
        className={
          "flex overflow-hidden transition-size duration-200 " +
          (isOpen ? "max-h-screen" : "max-h-0") +
          " " +
          (isGrid ? "flex-wrap gap-2" : "flex-col")
        }
      >
        {children}
      </div>
    </div>
  );
}
