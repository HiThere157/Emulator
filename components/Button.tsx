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
      className={
        "block py-0.5 px-2 rounded disabled:opacity-50 disabled:pointer-events-none " + className
      }
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
