import { useEffect, useState } from "react";

import Button from "../Button";
import Login from "./Login";

import { BsPersonFillLock, BsPersonFillCheck, BsBoxArrowInRight } from "react-icons/bs";

type UserProps = {
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => any;
};
export default function User({ isAdmin, setIsAdmin }: UserProps) {
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);

  const logout = async () => {
    await fetch("/api/auth/logout");
    document.cookie = `user=null; Max-Age=0; Secure; SameSite=Strict; Path=/`;
    setIsAdmin(false);
  };

  useEffect(() => {
    const username = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user="))
      ?.split("=")[1];

    setIsAdmin(username === "Admin");
  }, []);

  return (
    <div className="flex gap-2 h-8">
      <Login isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} onLogin={() => setIsAdmin(true)} />

      <Button
        className={
          "flex items-center justify-center flex-grow gap-2 " +
          (isLoginOpen ? "border-2 border-el2Accent" : "")
        }
        disabled={isAdmin}
        onClick={() => setIsLoginOpen(true)}
      >
        {isAdmin ? (
          <BsPersonFillCheck className="text-2xl text-el2Accent" />
        ) : (
          <BsPersonFillLock className="text-2xl" />
        )}

        <span>{isAdmin ? "Admin" : "Guest"}</span>
      </Button>
      <Button className="px-2" disabled={!isAdmin} onClick={logout}>
        <BsBoxArrowInRight className="text-2xl ml-[-0.25rem]" />
      </Button>
    </div>
  );
}
