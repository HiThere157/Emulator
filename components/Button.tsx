import { MouseEvent } from "react";

type ButtonProps = {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  onClick: (event: MouseEvent) => void;
};
export default function Button({ children, disabled, className, onClick }: ButtonProps) {
  return (
    <button
      className={"can-disable block py-0.5 px-2 rounded " + className}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
