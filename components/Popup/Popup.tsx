type PopupProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onBackgroundClick?: () => any;
  className?: string;
};
export default function Popup({ children, isOpen, onBackgroundClick, className }: PopupProps) {
  return (
    <>
      {isOpen && (
        <div className={"fixed top-0 bottom-0 left-0 right-0 flex z-[50] " + className}>
          <div
            className="absolute top-0 bottom-0 left-0 right-0 opacity-90 bg-darkBg"
            onClick={onBackgroundClick}
          />
          <div className="z-[50]">{children}</div>
        </div>
      )}
    </>
  );
}
