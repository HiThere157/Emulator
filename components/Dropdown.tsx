import { useState, useRef, useEffect } from "react";

import Button from "./Button";

import { BsCaretDownFill, BsCaretUpFill } from "react-icons/bs";

type DropdownProps = {
  items: string[];
  friendlyLookup?: { [key: string]: string };
  value: string;
  onChange: (value: string) => any;
};
export default function Dropdown({ items, friendlyLookup, value, onChange }: DropdownProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    function handleClickOutside({ target }: MouseEvent) {
      if (ref.current && !ref.current.contains(target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);

  const changeSelectedItem = (item: string) => {
    onChange(item);
    setIsOpen(false);
  };

  return (
    <div ref={ref} className="relative w-fit z-[10]">
      <Button className="px-2" onClick={() => setIsOpen(!isOpen)}>
        <div className="flex items-center">
          <span className="mr-2">{friendlyLookup?.[value] ?? value}</span>
          {isOpen ? <BsCaretUpFill /> : <BsCaretDownFill />}
        </div>
      </Button>
      {isOpen && (
        <DropdownBody
          items={items}
          friendlyLookup={friendlyLookup}
          onSelection={changeSelectedItem}
        />
      )}
    </div>
  );
}

type DropdownBodyProps = {
  items: string[];
  friendlyLookup?: { [key: string]: string };
  onSelection: (value: string) => any;
};
function DropdownBody({ items, friendlyLookup, onSelection }: DropdownBodyProps) {
  return (
    <div className="absolute flex flex-col rounded-md overflow-hidden mt-1">
      {items.map((item, index) => {
        return (
          <Button
            key={index}
            className={
              "px-2 text-start rounded-none border-el1Active " + (index !== 0 ? "border-t-2" : "")
            }
            onClick={() => onSelection(item)}
          >
            {friendlyLookup?.[item] ?? item}
          </Button>
        );
      })}
    </div>
  );
}
