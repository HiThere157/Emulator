type PopupProps = {
  children: React.ReactNode;
  isOpen: boolean;
  onBackgroundClick: () => any;
};
export default function Popup({ children, isOpen, onBackgroundClick }: PopupProps) {
  return (
    <>
      {isOpen && (
        <>
          <div
            className="absolute top-0 bottom-0 left-0 right-0 opacity-80 bg-darkBg z-[50]"
            onClick={onBackgroundClick}
          />
          <div className="absolute top-1/4 left-1/2 translate-x-[-50%] z-[50]">{children}</div>
        </>
      )}
    </>
  );
}
