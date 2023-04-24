import { BsFillFileEarmarkCheckFill, BsFillCloudCheckFill, BsPlusSquare } from "react-icons/bs";

type StateBoxProps = {
  isPresent: boolean;
  type: "local" | "remote";
  slot: number;
};
export default function StateBox({ isPresent, type, slot }: StateBoxProps) {
  return (
    <div
      className={
        "flex flex-col justify-center items-center gap-2 aspect-square w-44 rounded border-2 border-dashed " +
        (isPresent ? "border-blueColor" : "border-el1")
      }
    >
      {isPresent ? (
        type === "remote" ? (
          <BsFillCloudCheckFill className="text-blueColor text-4xl" />
        ) : (
          <BsFillFileEarmarkCheckFill className="text-blueColor text-4xl" />
        )
      ) : (
        <BsPlusSquare className="text-4xl text-el1" />
      )}
      <span className="text-greyColor">
        {type === "remote" ? "Remote" : "Local"} Slot {slot}
      </span>
    </div>
  );
}
