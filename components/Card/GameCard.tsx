import Image from "next/image";
import Link from "next/link";

import Button from "@/components/Button";

import { BsCaretRightFill, BsThreeDots } from "react-icons/bs";

type GameCardProps = {
  rom: RomFile;
};
export default function GameCard({ rom }: GameCardProps) {
  const [width, height] = rom.image_resolution.split("x").map((value) => parseInt(value));

  return (
    <div className="relative h-fit">
      <Link href={`/player/${rom.core}/${rom.id}`} className="block ctrl-el0 p-2 rounded group">
        <div className="relative" style={{ width, height }}>
          <Image src={rom.image} alt={rom.name} className="rounded" fill={true} />

          <div className="absolute top-0 bottom-0 left-0 right-0 invisible bg-darkBg opacity-25 group-hover:visible" />
          <BsCaretRightFill className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] text-8xl invisible group-hover:visible" />
        </div>

        <span className="block truncate m-1" style={{ width: width - 40 }}>
          {rom.name}
        </span>
      </Link>

      <Button theme="invisible" className="absolute bottom-3 right-2 px-1" onClick={() => {}}>
        <BsThreeDots className="text-xl" />
      </Button>
    </div>
  );
}
