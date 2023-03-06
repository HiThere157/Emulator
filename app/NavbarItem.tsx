"use client";

import { useState } from "react";

import Link from "next/link";

import { BsChevronDown, BsChevronUp } from "react-icons/bs";

type NavbarItemProps = {
  folder: RomFolder;
};
export default function NavbarItem({ folder }: NavbarItemProps) {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <div>
      <button
        className="bg-el hover:bg-elAccent active:bg-elActive rounded-md px-2 w-full"
        onClick={() => {
          setIsCollapsed(!isCollapsed);
        }}
      >
        <div className="flex items-center gap-2">
          {isCollapsed ? <BsChevronDown /> : <BsChevronUp />}
          <span>{folder.name}</span>
        </div>
      </button>
      {!isCollapsed && (
        <div>
          {folder.files.map((fileName, index) => {
            return (
              <Link key={index} href={``}>
                {fileName}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
