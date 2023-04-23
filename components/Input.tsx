import { ChangeEvent } from "react";

type InputProps = {
  value: string;
  label?: string;
  placeholder?: string;
  type?: "text" | "password";
  onChange: (value: string) => void;
  onEnter?: () => void;
};
export default function Input({ value, label, placeholder, type, onChange, onEnter }: InputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onEnter?.();
    }
  };

  return (
    <div className="flex items-center gap-2.5">
      {label && <span className="font-bold">{label}</span>}
      <input
        className="p-0.5 px-2 rounded ctrl-flat"
        value={value}
        onChange={(event: ChangeEvent<HTMLInputElement>) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        type={type}
      />
    </div>
  );
}
