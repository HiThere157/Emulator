import { useRef, useState } from "react";
import useOutsideClick from "@/hooks/useOutsideClick";

import Button from "@/components/Button";

import { FiChevronDown } from "react-icons/fi";
import { BsCheckLg } from "react-icons/bs";

type DropdownProps = {
  values: string[];
  icons?: React.ReactNode[];
  value: string;
  label?: string;
  onChange: (value: string, index: number) => void;
};
export default function Dropdown({ values, icons, value, label, onChange }: DropdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useOutsideClick(ref, () => setIsOpen(false));

  return (
    <div ref={ref} className="relative z-[10]">
      <div className="flex items-center gap-2.5">
        {label && <span className="font-bold">{label}</span>}
        <Button theme="flat" onClick={() => setIsOpen(!isOpen)}>
          <div className="flex items-center gap-1">
            <span>{value}</span>
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
        value={value}
        onChange={(value: string, index: number) => {
          onChange(value, index);
          setIsOpen(false);
        }}
      />
    </div>
  );
}

type DrowdownBodyProps = {
  isOpen: boolean;
  values: string[];
  icons?: React.ReactNode[];
  value: string;
  onChange: (value: string, index: number) => void;
};
function DrowdownBody({ isOpen, values, icons, value, onChange }: DrowdownBodyProps) {
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
              theme={item === value ? "color" : "flat"}
              className="flex justify-between items-center gap-2 [&>svg]:text-xl"
              onClick={() => onChange(item, index)}
            >
              {icons && icons[index] && icons[index]}

              <span className="flex-grow text-start whitespace-nowrap">{item}</span>
              <BsCheckLg className={"text-xl " + (item === value ? "visible" : "invisible")} />
            </Button>
          );
        })}
      </div>
    </div>
  );
}
