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
        className="ctrl-invisible group block max-w-min rounded p-2"
      >
        <div className="relative" style={{ width, height }}>
          <GameImage src={rom.image} alt={rom.name} />

          <div className="invisible absolute bottom-0 left-0 right-0 top-0 bg-darkBg opacity-25 group-hover:visible" />
          <BsCaretRightFill className="invisible absolute left-1/2 top-1/2 translate-x-[-50%] translate-y-[-50%] text-8xl group-hover:visible" />
        </div>

        <span className="m-1 block">{rom.name}</span>
      </Link>

      <Button className="ctrl-invisible absolute bottom-3 right-2 px-1" onClick={onDetailsClick}>
        <BsThreeDots className="text-xl" />
      </Button>
    </div>
  );
}
