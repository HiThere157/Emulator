"use client";

import packageInfo from "@/package.json";
import { useEffect, useRef, useState } from "react";
import useOutsideClick from "@/hooks/useOutsideClick";
import { roleClasses } from "@/config/static";
import { getLoginCookie, clearLoginCookie } from "@/helpers/c_cookie";
import makeApiCall from "@/helpers/c_api";

import Link from "@/components/Link";
import Button from "@/components/Button";

import { BsPersonCircle, BsFillPersonLinesFill, BsBoxArrowRight, BsDot } from "react-icons/bs";
import { SiNextdotjs, SiGithub } from "react-icons/si";
import { FiChevronDown } from "react-icons/fi";

export default function Profile() {
  const ref = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useOutsideClick(ref, () => setIsOpen(false));
  useEffect(() => {
    setUser(getLoginCookie());
  }, []);

  return (
    <div ref={ref} className="relative z-[15]">
      <Button
        className="ctrl-invisible flex h-11 items-center gap-2 text-start"
        onClick={() => setIsOpen(!isOpen)}
      >
        <BsPersonCircle className={"text-3xl " + roleClasses[user?.role ?? "Guest"]} />

        <div className="hidden flex-col leading-tight sm:flex">
          <span>{user?.username ?? "Anonymous"}</span>
          <span className="text-sm text-greyColor">{user?.role ?? "Guest"}</span>
        </div>

        <FiChevronDown
          className={
            "hidden text-3xl transition-transform duration-150 sm:block " +
            (isOpen ? "rotate-180" : "rotate-0")
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
  const ref = useRef<HTMLDivElement>(null);

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
      ref={ref}
      className={"absolute right-0 top-12 overflow-hidden transition-size duration-200"}
      style={{ height: isOpen ? ref.current?.scrollHeight : 0 }}
    >
      <div className="flex flex-col gap-1 rounded bg-el1 p-2">
        <Link href="/auth/edit" className="ctrl-flat gap-2 px-2 py-0.5" activeClassName="ctrl-blue">
          <BsFillPersonLinesFill className="w-5 text-xl" />
          <span>Account Settings</span>
        </Link>

        <Button className="ctrl-flat flex items-center gap-2 text-redColor" onClick={logout}>
          <BsBoxArrowRight className="w-5 text-xl" />
          <span>Logout</span>
        </Button>

        <hr className="my-1 text-el1Active" />

        <div className="flex items-center justify-center gap-1 text-greyColor">
          <a
            href="https://github.com/HiThere157/Emulator"
            className="flex items-center gap-1.5"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiGithub className="text-lg" />
            <span className="text-sm underline underline-offset-2">v{packageInfo.version}</span>
          </a>

          <BsDot />

          <a
            href="https://github.com/vercel/next.js"
            className="flex items-center gap-1.5"
            target="_blank"
            rel="noopener noreferrer"
          >
            <SiNextdotjs className="text-lg" />
            <span className="text-sm underline underline-offset-2">
              v{packageInfo.dependencies.next.substring(1)}
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
