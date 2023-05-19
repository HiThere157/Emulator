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
        <div className={"fixed bottom-0 left-0 right-0 top-0 z-[50] flex " + className}>
          <div
            className="absolute bottom-0 left-0 right-0 top-0 bg-darkBg opacity-90"
            onClick={onBackgroundClick}
          />
          <div className="z-[50]">{children}</div>
        </div>
      )}
    </>
  );
}
