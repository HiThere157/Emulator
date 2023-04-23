import { useRef, useState } from "react";
import useOutsideClick from "@/hooks/useOutsideClick";

import Button from "@/components/Button";

import { FiChevronDown } from "react-icons/fi";
import { BsCheckLg } from "react-icons/bs";

type DropdownProps = {
  values: string[];
  value: string;
  icons?: React.ReactNode[];
  lookup?: { [key: string]: string };
  label?: string;
  onChange: (value: string) => void;
};
export default function Dropdown({ values, icons, lookup, value, label, onChange }: DropdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useOutsideClick(ref, () => setIsOpen(false));

  return (
    <div ref={ref} className="relative w-fit z-[10]">
      <div className="flex items-center gap-2.5">
        {label && <span className="font-bold">{label}</span>}
        <Button className="ctrl-flat" onClick={() => setIsOpen(!isOpen)}>
          <div className="flex items-center gap-1">
            <span>{lookup?.[value] ?? value}</span>
            <FiChevronDown
              className={
                "text-xl transition-transform duration-150 " + (isOpen ? "rotate-180" : "rotate-0")
              }
            />
          </div>
        </Button>
      </div>

      <DrowdownBody
        isOpen={isOpen}
        values={values}
        icons={icons}
        lookup={lookup}
        value={value}
        onChange={(value: string) => {
          onChange(value);
          setIsOpen(false);
        }}
      />
    </div>
  );
}

type DrowdownBodyProps = {
  isOpen: boolean;
  values: string[];
  value: string;
  icons?: React.ReactNode[];
  lookup?: { [key: string]: string };
  onChange: (value: string) => void;
};
function DrowdownBody({ isOpen, values, icons, lookup, value, onChange }: DrowdownBodyProps) {
  return (
    <div
      className={
        "absolute top-8 right-0 overflow-hidden transition-size duration-200 " +
        (isOpen ? "max-h-screen" : "max-h-0")
      }
    >
      <div className="flex flex-col rounded bg-el1 p-2">
        {values.map((item, index) => {
          return (
            <Button
              key={item}
              className={
                "flex justify-between items-center gap-2 [&>svg]:text-xl " +
                (item === value ? "ctrl-blue" : "ctrl-flat")
              }
              onClick={() => onChange(item)}
            >
              {icons && icons[index] && icons[index]}

              <span className="flex-grow text-start whitespace-nowrap">
                {lookup?.[item] ?? item}
              </span>
              <BsCheckLg className={"text-xl " + (item === value ? "visible" : "invisible")} />
            </Button>
          );
        })}
      </div>
    </div>
  );
}
