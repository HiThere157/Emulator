"use client";

import { useEffect, useState } from "react";

import { cores } from "@/config/cores";

import UploadFiles from "../FileUpload/UploadFiles";
import CurrentUser from "../Login/CurrentUser";
import NavbarItem from "./NavbarItem";
import Button from "../Button";

import { BsCapslockFill, BsPencilFill } from "react-icons/bs";

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
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

  useEffect(() => {
    if (!isAdmin) {
      setIsEditing(false);
    }
  }, [isAdmin]);

  return (
    <nav className="flex flex-col gap-2 p-2 w-full bg-lightBg whitespace-nowrap sm:w-48 sm:h-screen">
      <UploadFiles isOpen={isUploadOpen} setIsOpen={setIsUploadOpen} onSubmit={fetchNav} />

      <div className="grid grid-cols-2 gap-2 h-8">
        <Button
          theme="color"
          className={
            "flex justify-center items-center " + (isUploadOpen ? "border-2 border-el2Accent" : "")
          }
          disabled={!isAdmin}
          onClick={() => setIsUploadOpen(true)}
        >
          <BsCapslockFill />
        </Button>
        <Button
          theme="color"
          className={
            "flex justify-center items-center " + (isEditing ? "border-2 border-el2Accent" : "")
          }
          disabled={!isAdmin}
          onClick={() => setIsEditing(!isEditing)}
        >
          <BsPencilFill />
        </Button>
      </div>

      <div className="flex-grow">
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
      </div>

      <CurrentUser isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
    </nav>
  );
}
