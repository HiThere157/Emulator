import Image from "next/image";
import { useEffect, useState } from "react";

import placeholderSvg from "@/assets/qblock.svg";

type GameImageProps = {
  src: string;
  alt: string;
};
export default function GameImage({ src, alt }: GameImageProps) {
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    setIsError(false);
  }, [src]);

  if (isError || !src) {
    return (
      <div className="flex h-full items-center justify-center rounded bg-darkBg">
        <Image
          src={placeholderSvg}
          alt="Image not found"
          className="scale-50 opacity-20 grayscale"
        />
      </div>
    );
  }
  return (
    <Image src={src} alt={alt} className="rounded" fill={true} onError={() => setIsError(true)} />
  );
}
