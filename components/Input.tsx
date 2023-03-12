import { HTMLInputTypeAttribute } from "react";

type InputProps = {
  value: string;
  className?: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  onChange: (value: string) => any;
  onEnter?: () => any;
};
export default function Input({
  value,
  className,
  placeholder,
  type,
  onChange,
  onEnter,
}: InputProps) {
  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      onEnter?.();
    }
  };

  return (
    <input
      className={
        "rounded-md px-2 bg-el1 hover:bg-el1Accent active:bg-el1Active " + (className ?? "")
      }
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      type={type}
    />
  );
}
