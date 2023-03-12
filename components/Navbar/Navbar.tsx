"use client";

import { useEffect, useState } from "react";

import { cores } from "@/config/cores";

import Button from "../Button";
import NavbarItem from "./NavbarItem";
import UploadFiles from "../UploadFile/UploadFiles";

import { BsCapslockFill, BsPencilFill } from "react-icons/bs";

export default function Navbar() {
  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [files, setFiles] = useState<RomFile[]>();

  const fetchNav = async () => {
    const result = await fetch("/api/roms");
    const files: RomFile[] = await result.json();

    setFiles(files);
  };

  useEffect(() => {
    fetchNav();
  }, []);

  return (
    <nav className="flex flex-col gap-2 bg-lightBg p-2 h-full w-48 whitespace-nowrap">
      <UploadFiles isOpen={isUploadOpen} setIsOpen={setIsUploadOpen} onSubmit={fetchNav} />

      <div className="grid grid-cols-2 gap-2 h-8">
        <Button
          theme="color"
          className={
            "flex justify-center items-center " + (isUploadOpen ? "border-2 border-el2Accent" : "")
          }
          onClick={() => setIsUploadOpen(true)}
        >
          <BsCapslockFill />
        </Button>
        <Button
          theme="color"
          className={
            "flex justify-center items-center " + (isEditing ? "border-2 border-el2Accent" : "")
          }
          onClick={() => setIsEditing(!isEditing)}
        >
          <BsPencilFill />
        </Button>
      </div>

      {files &&
        Object.keys(cores)
          .filter((core) => files.some((file) => file.core === core) || isEditing)
          .map((core, index) => {
            return (
              <NavbarItem
                key={index}
                core={core}
                files={files.filter((file) => file.core === core)}
                isEditing={isEditing}
                onMove={fetchNav}
              />
            );
          })}

      {isEditing && <NavbarItem core="Trash" files={[]} isEditing={true} onMove={fetchNav} />}
    </nav>
  );
}
