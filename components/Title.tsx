type TitleProps = {
  children: React.ReactNode;
  text: string;
  position: "right" | "bottom";
  className?: string;
};
export default function Title({ children, text, position, className = "" }: TitleProps) {
  const containerClasses = "absolute peer-hover:scale-100 scale-0 z-[15]";
  const accentClasses = "absolute h-2 w-2 rounded-sm bg-el1 rotate-45";
  const textClasses = "rounded bg-el1 text-sm px-1.5 whitespace-pre";

  return (
    <div className={"relative " + className}>
      <div className="peer">{children}</div>
      {position === "right" && (
        <div
          className={
            "right-0 top-1/2 translate-x-[100%] translate-y-[-50%] pl-2 " + containerClasses
          }
        >
          <div className={"left-1 top-1/2 translate-y-[-50%] " + accentClasses} />
          <div className={textClasses}>{text}</div>
        </div>
      )}

      {position === "bottom" && (
        <div
          className={
            "bottom-0 right-1/2 translate-x-[50%] translate-y-[100%] pt-2 " + containerClasses
          }
        >
          <div className={"left-1/2 top-1 translate-x-[-50%] " + accentClasses} />
          <div className={textClasses}>{text}</div>
        </div>
      )}
    </div>
  );
}
