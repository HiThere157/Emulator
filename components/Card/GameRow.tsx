import Link from "next/link";

import Button from "@/components/Button";
import GameImage from "@/components/Card/GameImage";

import { BsCaretRightFill, BsThreeDots } from "react-icons/bs";

type GameRowProps = {
  rom: RomFile;
  onDetailsClick: () => void;
};
export default function GameRow({ rom, onDetailsClick }: GameRowProps) {
  const [width, height] = rom.image_resolution.split("x").map((value) => parseInt(value) * 0.2);

  return (
    <div className="relative h-fit">
      <Link
        href={`/player/${rom.core}/${rom.id}`}
        className="ctrl-invisible flex items-center gap-2 p-2 rounded group"
      >
        <div className="relative" style={{ width, height }}>
          <GameImage src={rom.image} alt={rom.name} />

          <div className="absolute top-0 bottom-0 left-0 right-0 invisible bg-darkBg opacity-25 group-hover:visible" />
          <BsCaretRightFill className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-3xl invisible group-hover:visible" />
        </div>

        <span className="block truncate text-lg m-1" style={{ width: "calc(100% - 6em)" }}>
          {rom.name}
        </span>
      </Link>

      <Button className="ctrl-invisible absolute bottom-6 right-2 px-1" onClick={onDetailsClick}>
        <BsThreeDots className="text-xl" />
      </Button>
    </div>
  );
}
