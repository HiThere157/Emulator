"use client";

import { useEffect, useState } from "react";

import { cores } from "@/config/cores";

import UploadFiles from "../FileUpload/UploadFiles";
import State from "../State/State";
import User from "../Login/User";
import NavbarItem from "./NavbarItem";
import Button from "../Button";

import { BsCapslockFill, BsPencilFill, BsFolderFill } from "react-icons/bs";
import DiskUsage from "./DiskUsage";

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isState, setIsState] = useState<boolean>(false);

  const [roms, setRoms] = useState<RomFile[]>([]);
  const [diskUsage, setDisUsage] = useState<DiskUsage>();

  const fetchInfos = async () => {
    const romResult = await fetch("/api/roms");
    const roms: RomFile[] = await romResult.json();
    setRoms(roms);

    const usageResut = await fetch("/api/fs");
    const diskUsage = await usageResut.json();
    setDisUsage(diskUsage);
  };

  useEffect(() => {
    fetchInfos();
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      setIsEditing(false);
    }
  }, [isAdmin]);

  return (
    <nav className="flex flex-col gap-2 p-2 whitespace-nowrap bg-lightBg min-w-[12rem] w-full sm:w-fit sm:h-screen">
      <UploadFiles isOpen={isUploadOpen} setIsOpen={setIsUploadOpen} onSubmit={fetchInfos} />
      <State isOpen={isState} setIsOpen={setIsState} onChange={fetchInfos} />

      <div className="grid grid-cols-3 gap-2 h-8">
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
        <Button
          theme="color"
          className={
            "flex justify-center items-center " + (isState ? "border-2 border-el2Accent" : "")
          }
          disabled={!isAdmin}
          onClick={() => setIsState(true)}
        >
          <BsFolderFill />
        </Button>
      </div>

      <div className="flex-grow">
        {Object.keys(cores)
          .filter((core) => roms.some((rom) => rom.core === core) || isEditing)
          .map((core, index) => {
            return (
              <NavbarItem
                key={index}
                core={core}
                files={roms.filter((rom) => rom.core === core)}
                isEditing={isEditing}
                onMove={fetchInfos}
              />
            );
          })}

        {isEditing && <NavbarItem core="Trash" files={[]} isEditing={true} onMove={fetchInfos} />}
      </div>

      <DiskUsage usage={diskUsage} />
      <User isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
    </nav>
  );
}
