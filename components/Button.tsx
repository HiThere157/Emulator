type ButtonProps = {
  children: React.ReactNode;
  theme?: "flat" | "color";
  className?: string;
  disabled?: boolean;
  onClick?: () => any;
};
export default function Button({
  children,
  theme = "flat",
  className,
  disabled,
  onClick,
}: ButtonProps) {
  return (
    <button
      className={
        "rounded-md " +
        (theme === "flat" ? "bg-el1 hover:bg-el1Accent active:bg-el1Active " : " ") +
        (theme === "color" ? "bg-el2 hover:bg-el2Accent active:bg-el2Active " : " ") +
        (disabled ? "opacity-50 cursor-not-allowed hover:!bg-el1 active:!bg-el1 " : " ") +
        (className ?? "")
      }
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
