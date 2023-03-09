type InputProps = {
  value: string;
  className?: string;
  placeholder?: string;
  onChange: (value: string) => any;
};
export default function Input({ value, className, placeholder, onChange }: InputProps) {
  return (
    <input
      className={
        "rounded-md px-2 bg-el1 hover:bg-el1Accent active:bg-el1Active " + (className ?? "")
      }
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
    />
  );
}
