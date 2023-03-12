import { useState } from "react";

import Button from "../Button";
import Login from "./Login";

import { BsPersonFillLock, BsPersonFillCheck, BsBoxArrowInRight } from "react-icons/bs";

export default function CurrentUser() {
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);

  const logout = async () => {
    await fetch("/api/auth/logout");
  };

  return (
    <div className="grid grid-cols-[1fr_auto] gap-2 h-8">
      <Login isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} />

      <Button
        theme="flat"
        className={
          "flex justify-center items-center gap-1 " +
          (isLoginOpen ? "border-2 border-el2Accent" : "")
        }
        onClick={() => setIsLoginOpen(true)}
      >
        <BsPersonFillLock className="text-2xl" />
        <span>Guest</span>
      </Button>
      <Button theme="flat" className="flex justify-center items-center px-2" onClick={logout}>
        <BsBoxArrowInRight className="text-2xl ml-[-0.25rem]" />
      </Button>
    </div>
  );
}
