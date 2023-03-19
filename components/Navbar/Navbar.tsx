"use client";

import { useEffect, useState } from "react";

import { cores } from "@/config/cores";

import UploadFiles from "../FileUpload/UploadFiles";
import State from "../State/State";
import User from "../Login/User";
import NavbarItem from "./NavbarItem";
import Button from "../Button";

import { BsCapslockFill, BsPencilFill, BsFolderFill } from "react-icons/bs";

export default function Navbar() {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const [isUploadOpen, setIsUploadOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isState, setIsState] = useState<boolean>(false);

  const [games, setGames] = useState<RomFile[]>();

  const fetchGames = async () => {
    const result = await fetch("/api/roms");
    const games: RomFile[] = await result.json();
    setGames(games);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  useEffect(() => {
    if (!isAdmin) {
      setIsEditing(false);
    }
  }, [isAdmin]);

  return (
    <nav className="flex flex-col gap-2 p-2 whitespace-nowrap bg-lightBg w-full sm:w-fit sm:h-screen">
      <UploadFiles isOpen={isUploadOpen} setIsOpen={setIsUploadOpen} onSubmit={fetchGames} />
      <State isOpen={isState} setIsOpen={setIsState} />

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
        {games &&
          Object.keys(cores)
            .filter((core) => games.some((game) => game.core === core) || isEditing)
            .map((core, index) => {
              return (
                <NavbarItem
                  key={index}
                  core={core}
                  files={games.filter((game) => game.core === core)}
                  isEditing={isEditing}
                  onMove={fetchGames}
                />
              );
            })}

        {isEditing && <NavbarItem core="Trash" files={[]} isEditing={true} onMove={fetchGames} />}
      </div>

      <User isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
    </nav>
  );
}
