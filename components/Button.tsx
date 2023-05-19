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
        "block rounded px-2 py-0.5 disabled:pointer-events-none disabled:opacity-50 " + className
      }
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
