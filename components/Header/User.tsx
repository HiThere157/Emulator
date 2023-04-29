"use client";

import { useEffect, useRef, useState } from "react";
import useOutsideClick from "@/hooks/useOutsideClick";
import { getLoginCookie, clearLoginCookie } from "@/helpers/cookie";
import makeApiCall from "@/helpers/api";

import Link from "@/components/Link";
import Button from "@/components/Button";

import { BsPersonCircle, BsAsterisk, BsBoxArrowRight } from "react-icons/bs";
import { FiChevronDown } from "react-icons/fi";

export default function User() {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [user, setUser] = useState<LoginCookiePayload | null>(null);

  useOutsideClick(ref, () => setIsOpen(false));
  useEffect(() => {
    setUser(getLoginCookie());
  }, []);

  const classLookup = {
    Administrator: "text-redColor",
    Player: "text-blueColor",
    Guest: "text-greyColor",
  };

  return (
    <div ref={ref} className="relative z-[15]">
      <Button
        className="ctrl-invisible flex items-center gap-2 text-start"
        onClick={() => setIsOpen(!isOpen)}
      >
        <BsPersonCircle className={"text-3xl " + classLookup[user?.role ?? "Guest"]} />

        <div className="flex flex-col leading-tight">
          <span>{user?.username ?? "Anonymous"}</span>
          <span className="text-sm text-greyColor">{user?.role ?? "Guest"}</span>
        </div>

        <FiChevronDown
          className={
            "text-3xl transition-transform duration-150 " + (isOpen ? "rotate-180" : "rotate-0")
          }
        />
      </Button>

      <UserBody isOpen={isOpen} />
    </div>
  );
}

type UserBodyProps = {
  isOpen: boolean;
};
function UserBody({ isOpen }: UserBodyProps) {
  const logout = async () => {
    const logoutResult = await makeApiCall<undefined>(
      "/api/auth/logout",
      {
        method: "POST",
      },
      500,
    );

    if (!logoutResult?.error) {
      clearLoginCookie();
      location.href = "/auth/login";
    }
  };

  return (
    <div
      className={
        "absolute top-12 right-0 overflow-hidden transition-size duration-200 " +
        (isOpen ? "max-h-screen" : "max-h-0")
      }
    >
      <div className="flex flex-col gap-1 rounded bg-el1 p-2">
        <Link
          href="/auth/changePassword"
          className="gap-2 py-0.5 px-2 ctrl-flat"
          activeClassName="ctrl-blue"
        >
          <BsAsterisk className="w-5" />
          <span>Change Password</span>
        </Link>

        <Button className="ctrl-flat flex items-center gap-2 text-redColor" onClick={logout}>
          <BsBoxArrowRight className="text-xl w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}
