import { useState } from "react";

import Popup from "../Popup";
import Button from "../Button";
import Input from "../Input";

import { BsPersonFillCheck } from "react-icons/bs";

type UploadFilesProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => any;
};
export default function UploadFiles({ isOpen, setIsOpen }: UploadFilesProps) {
  const [password, setPassword] = useState<string>("");

  const closePopup = () => {
    setIsOpen(false);
    setPassword("");
  };

  const login = async () => {
    await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });

    closePopup();
  };

  return (
    <Popup isOpen={isOpen} onBackgroundClick={closePopup}>
      <div className="flex flex-col w-[30rem] bg-lightBg rounded-md p-5">
        <div className="flex items-center justify-center gap-2 py-5 bg-darkBg rounded-md">
          <BsPersonFillCheck className="text-7xl text-el2Accent mr-4" />
          <span className="text-whiteColorAccent">Password:</span>
          <Input value={password} onChange={setPassword} onEnter={login} type="password" />
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
