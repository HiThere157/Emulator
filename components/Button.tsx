import { MouseEvent } from "react";

type ButtonProps = {
  children: React.ReactNode;
  theme: "flat" | "hover" | "color" | "invisible";
  className?: string;
  onClick: (event: MouseEvent) => void;
};
export default function Button({ children, theme, className, onClick }: ButtonProps) {
  const classLookup = {
    invisible: "ctrl-el0",
    flat: "ctrl-el1",
    hover: "ctrl-el2",
    color: "ctrl-el3",
  };

  return (
    <button
      className={"block py-0.5 px-2 rounded " + classLookup[theme] + " " + className}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
