import { ChangeEvent } from "react";

type InputProps = {
  value: string;
  label?: string;
  placeholder?: string;
  type?: "text" | "password";
  className?: string;
  disabled?: boolean;
  onChange: (value: string) => void;
  onEnter?: () => void;
};
export default function Input({
  value,
  label,
  placeholder,
  type,
  className,
  disabled,
  onChange,
  onEnter,
}: InputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onEnter?.();
    }
  };

  return (
    <div className="flex items-center gap-2.5">
      {label && <span className="font-bold">{label}</span>}
      <input
        className={
          "ctrl-flat p-0.5 px-2 rounded disabled:opacity-50 disabled:pointer-events-none " +
          className
        }
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        type={type}
        disabled={disabled}
      />
    </div>
  );
}
