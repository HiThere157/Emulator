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
      <div className="flex items-center justify-center h-full bg-darkBg rounded">
        <Image
          src={placeholderSvg}
          alt="Image not found"
          className="grayscale opacity-20 scale-50"
        />
      </div>
    );
  }
  return (
    <Image src={src} alt={alt} className="rounded" fill={true} onError={() => setIsError(true)} />
  );
}
