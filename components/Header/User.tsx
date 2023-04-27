"use client";

import { useEffect, useRef, useState } from "react";
import useOutsideClick from "@/hooks/useOutsideClick";
import { getLoginCookie, clearLoginCookie } from "@/helpers/cookie";
import makeApiCall from "@/helpers/api";

import OptionLink from "@/components/Header/OptionLink";
import Button from "@/components/Button";

import { BsPersonCircle, BsGearFill, BsPersonFillGear, BsBoxArrowRight } from "react-icons/bs";
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
    const response = await makeApiCall<undefined>(
      "/api/auth/logout",
      {
        method: "POST",
      },
      500,
    );

    if (!response?.error) {
      clearLoginCookie();
      location.href = "/login";
    }
  };

  return (
    <div
      className={
        "absolute top-12 right-0 overflow-hidden transition-size duration-200 " +
        (isOpen ? "max-h-screen" : "max-h-0")
      }
    >
      <div className="flex flex-col rounded bg-el1 p-2">
        <OptionLink href="/admin/settings" icon={<BsGearFill className="text-lg w-5" />}>
          Settings
        </OptionLink>
        <OptionLink href="/admin/users" icon={<BsPersonFillGear className="text-xl w-5" />}>
          User Management
        </OptionLink>

        <hr className="my-2 text-el1Active" />

        <Button className="ctrl-flat flex items-center gap-2 text-redColor" onClick={logout}>
          <BsBoxArrowRight className="text-xl w-5" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );
}
