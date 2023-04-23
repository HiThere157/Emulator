import { MouseEvent } from "react";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
  onClick: (event: MouseEvent) => void;
};
export default function Button({ children, className, onClick }: ButtonProps) {
  return (
    <button className={"block py-0.5 px-2 rounded " + className} onClick={onClick}>
      {children}
    </button>
  );
}
