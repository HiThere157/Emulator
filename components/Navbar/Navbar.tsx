"use client";

import { useEffect, useState } from "react";

import Button from "../Button";
import NavbarItem from "./NavbarItem";
import UploadFiles from "../UploadFile/UploadFiles";

import { BsCapslockFill, BsGearFill } from "react-icons/bs";

export default function Navbar() {
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);

  const [files, setFiles] = useState<RomFile[]>();
  const [cores, setCores] = useState<string[]>([]);

  const fetchNav = async () => {
    setFiles(undefined);

    const result = await fetch("/api/roms");
    const files: RomFile[] = await result.json();

    setFiles(files);
    setCores(Array.from(new Set(files.map((file) => file.core))));
  };

  useEffect(() => {
    fetchNav();
  }, []);

  return (
    <nav className="flex flex-col gap-2 bg-lightBg p-2 h-full w-48">
      <UploadFiles isOpen={isUploadOpen} setIsOpen={setIsUploadOpen} onSubmit={fetchNav} />

      <div className="grid grid-cols-2 gap-2 h-8">
        <Button
          theme="color"
          className="flex justify-center items-center"
          onClick={() => setIsUploadOpen(true)}
        >
          <BsCapslockFill />
        </Button>
        <Button theme="color" className="flex justify-center items-center">
          <BsGearFill />
        </Button>
      </div>

      {files &&
        cores.map((core, index) => {
          return (
            <NavbarItem
              key={index}
              core={core}
              files={files.filter((file) => file.core === core)}
            />
          );
        })}
    </nav>
  );
}
