type ButtonProps = {
  children: React.ReactNode;
  theme: "flat" | "color";
  className?: string;
  onClick?: () => any;
};
export default function Button({ children, theme, className, onClick }: ButtonProps) {
  return (
    <button
      className={
        "rounded-md " +
        (theme === "flat" ? "bg-el1 hover:bg-el1Accent active:bg-el1Active " : " ") +
        (theme === "color" ? "bg-el2 hover:bg-el2Accent active:bg-el2Active " : " ") +
        (className ?? "")
      }
      onClick={onClick}
    >
      {children}
    </button>
  );
}
