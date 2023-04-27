import Link from "next/link";

import Button from "@/components/Button";
import GameImage from "@/components/Card/GameImage";

import { BsCaretRightFill, BsThreeDots } from "react-icons/bs";

type GameCardProps = {
  rom: RomFile;
  onDetailsClick: () => void;
};
export default function GameCard({ rom, onDetailsClick }: GameCardProps) {
  const [width, height] = rom.image_resolution.split("x").map((value) => parseInt(value));

  return (
    <div className="relative h-fit">
      <Link
        href={`/player/${rom.core}/${rom.id}`}
        className="block ctrl-invisible p-2 rounded group"
      >
        <div className="relative" style={{ width, height }}>
          <GameImage src={rom.image} alt={rom.name} />

          <div className="absolute top-0 bottom-0 left-0 right-0 invisible bg-darkBg opacity-25 group-hover:visible" />
          <BsCaretRightFill className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-8xl invisible group-hover:visible" />
        </div>

        <span className="block truncate m-1" style={{ width: "calc(100% - 2em)" }}>
          {rom.name}
        </span>
      </Link>

      <Button className="ctrl-invisible absolute bottom-3 right-2 px-1" onClick={onDetailsClick}>
        <BsThreeDots className="text-xl" />
      </Button>
    </div>
  );
}
