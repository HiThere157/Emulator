import { useState } from "react";

import Popup from "../Popup";
import Error from "./Error";
import Button from "../Button";
import Input from "../Input";

import { BsPersonFillCheck } from "react-icons/bs";

type LoginProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => any;
  onLogin: () => any;
};
export default function Login({ isOpen, setIsOpen, onLogin }: LoginProps) {
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const sha256 = async (message: string) => {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
  };

  const closePopup = () => {
    setIsOpen(false);
    setPassword("");
    setError("");
  };

  const login = async () => {
    const passwordHash = await sha256(password);
    const result = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ passwordHash }),
    });

    if (result.ok) {
      const user = JSON.parse(await result.text());
      document.cookie = `user=${user.username}; Max-Age=43200; Secure; SameSite=Strict; Path=/`;
      closePopup();
      onLogin();
    } else {
      setError("Invalid Credentials");
    }
  };

  return (
    <Popup isOpen={isOpen} onBackgroundClick={closePopup}>
      <div className="flex flex-col w-[30rem] bg-lightBg rounded-md p-5">
        <div className="flex items-center justify-center gap-2 py-5 bg-darkBg rounded-md">
          <BsPersonFillCheck className="text-7xl text-el2Accent mr-4" />
          <div className="flex flex-col items-center gap-2">
            <div className="flex gap-2">
              <span className="text-whiteColorAccent">Password:</span>
              <Input value={password} onChange={setPassword} onEnter={login} type="password" />
            </div>
            <Error message={error} />
          </div>
        </div>

        <div className="flex justify-center gap-2 pt-2 text-xl mb-[-0.75rem]">
          <Button theme="color" className="px-2" onClick={closePopup}>
            Cancel
          </Button>
          <Button theme="color" className="px-2" onClick={login}>
            Login
          </Button>
        </div>
      </div>
    </Popup>
  );
}
