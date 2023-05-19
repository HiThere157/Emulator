import { useEffect, useRef, useState } from "react";
import { cores } from "@/config/static";

import Button from "@/components/Button";

import { FiChevronDown } from "react-icons/fi";

type CategoryProps = {
  name: string;
  count: number;
  children?: React.ReactNode;
};
export default function Category({ name, count, children }: CategoryProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    const handleResize = () => setHeight(ref.current?.scrollHeight ?? 0);
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [ref.current?.scrollHeight]);

  return (
    <div>
      <Button
        className="ctrl-invisible flex w-full items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h2 className="mr-1 text-2xl font-bold">{cores[name] ?? name}</h2>
        <span className="text-greyColor">({count})</span>

        <hr className="mx-3 flex-grow rounded border-t-2 text-el1" />

        <FiChevronDown
          className={
            "text-3xl transition-transform duration-150 " + (isOpen ? "rotate-180" : "rotate-0")
          }
        />
      </Button>

      <div
        ref={ref}
        className={"overflow-hidden transition-size duration-200"}
        style={{ maxHeight: isOpen ? height : 0 }}
      >
        {children}
      </div>
    </div>
  );
}
