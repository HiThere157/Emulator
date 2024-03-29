import { useRef, useState } from "react";
import useOutsideClick from "@/hooks/useOutsideClick";

import Button from "@/components/Button";

import { FiChevronDown } from "react-icons/fi";
import { BsCheckLg } from "react-icons/bs";

type DropdownProps = {
  values: string[];
  value: string;
  placeholder?: string;
  icons?: React.ReactNode[];
  lookup?: { [key: string]: string };
  label?: string;
  justify?: "start" | "end";
  disabled?: boolean;
  onChange: (value: string) => void;
};
export default function Dropdown({
  values,
  value,
  placeholder,
  icons,
  lookup,
  label,
  justify,
  disabled,
  onChange,
}: DropdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useOutsideClick(ref, () => setIsOpen(false));

  return (
    <div ref={ref} className="relative z-[10] w-fit">
      <div className="flex items-center gap-2.5">
        {label && <span className="font-bold">{label}</span>}
        <Button
          className="ctrl-flat min-h-[1.75rem]"
          onClick={() => setIsOpen(!isOpen)}
          disabled={disabled}
        >
          <div className="flex items-center gap-1">
            <span>{value == "" ? placeholder : lookup?.[value] ?? value}</span>
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
        justify={justify ?? "end"}
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
  justify: "start" | "end";
  icons?: React.ReactNode[];
  lookup?: { [key: string]: string };
  onChange: (value: string) => void;
};
function DrowdownBody({
  isOpen,
  values,
  value,
  justify,
  icons,
  lookup,
  onChange,
}: DrowdownBodyProps) {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className={
        "absolute top-8 overflow-hidden transition-size duration-200 " +
        (justify === "start" ? "left-0" : "right-0")
      }
      style={{ height: isOpen ? ref.current?.scrollHeight : 0 }}
    >
      <div className="flex flex-col gap-1 rounded bg-el1 p-2">
        {values.map((item, index) => {
          return (
            <Button
              key={item}
              className={
                "flex items-center justify-between gap-2 [&>svg]:text-xl " +
                (item === value ? "ctrl-blue" : "ctrl-flat")
              }
              onClick={() => onChange(item)}
            >
              {icons && icons[index] && icons[index]}

              <span className="flex-grow whitespace-nowrap text-start">
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
