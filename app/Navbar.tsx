"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import { BsChevronDown, BsChevronUp } from "react-icons/bs";

export default function Navbar() {
  const [files, setFiles] = useState<RomFile[]>([]);
  const [cores, setCores] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const result = await fetch("/api/roms");
      const files: RomFile[] = await result.json();

      setFiles(files);
      setCores(Array.from(new Set(files.map((file) => file.core))));
    })();
  }, []);

  return (
    <nav className="flex flex-col gap-3 bg-lightBg p-2 h-full w-40">
      {cores.map((core, index) => {
        return (
          <NavbarItem key={index} core={core} files={files.filter((file) => file.core === core)} />
        );
      })}
    </nav>
  );
}

type NavbarItemProps = {
  core: string;
  files: RomFile[];
};
function NavbarItem({ core, files }: NavbarItemProps) {
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
          <span>{core}</span>
        </div>
      </button>
      {!isCollapsed && (
        <div className="flex flex-col mx-2">
          {files.map((file, index) => {
            return (
              <Link
                key={index}
                href={`/player/${file.id}`}
                className="text-whiteColorAccent hover:text-whiteColor"
              >
                {file.friendlyName}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
