import { useEffect, useState } from "react";

import Button from "../Button";
import Login from "./Login";

import { BsPersonFillLock, BsPersonFillCheck, BsBoxArrowInRight } from "react-icons/bs";

type CurrentUserProps = {
  isLoggedIn: boolean;
  setIsLoggedIn: (isLoggedIn: boolean) => any;
};
export default function CurrentUser({ isLoggedIn, setIsLoggedIn }: CurrentUserProps) {
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);

  const logout = async () => {
    await fetch("/api/auth/logout");
    document.cookie = `user=null; Max-Age=0; Secure; SameSite=Strict; Path=/`;
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const username = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user="))
      ?.split("=")[1];

    setIsLoggedIn(username === "Admin");
  }, []);

  return (
    <div className="grid grid-cols-[1fr_auto] gap-2 h-8">
      <Login isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} onLogin={() => setIsLoggedIn(true)} />

      <Button
        theme="flat"
        className={
          "flex justify-center items-center gap-2 " +
          (isLoginOpen ? "border-2 border-el2Accent" : "")
        }
        disabled={isLoggedIn}
        onClick={() => setIsLoginOpen(true)}
      >
        {isLoggedIn ? (
          <BsPersonFillCheck className="text-2xl text-el2Accent" />
        ) : (
          <BsPersonFillLock className="text-2xl" />
        )}

        <span>{isLoggedIn ? "Admin" : "Guest"}</span>
      </Button>
      <Button
        theme="flat"
        className="flex justify-center items-center px-2"
        disabled={!isLoggedIn}
        onClick={logout}
      >
        <BsBoxArrowInRight className="text-2xl ml-[-0.25rem]" />
      </Button>
    </div>
  );
}
