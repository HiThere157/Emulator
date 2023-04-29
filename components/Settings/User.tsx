import { useState } from "react";
import { roleClasses } from "@/config/static";
import makeApiCall from "@/helpers/api";

import Dropdown from "@/components/Dropdown";
import Checkbox from "@/components/Checkbox";
import Button from "@/components/Button";
import Loader from "@/components/Loader";
import Error from "@/components/Error";

import { BsFillTrashFill, BsPersonCircle, BsSave } from "react-icons/bs";

type UserProps = {
  user: ReducedUser;
  disabled?: boolean;
  onSubmit: () => any;
};
export default function User({ user, disabled, onSubmit }: UserProps) {
  const [result, setResult] = useState<ApiResult<ReducedUser | undefined>>({});

  const [role, setRole] = useState<string>(user.role);
  const [enabled, setEnabled] = useState<boolean>(user.enabled);

  const updateUser = async () => {
    setResult(null);

    // Update the user in the database
    const dbResult = await makeApiCall<ReducedUser>(
      `/api/users/${user.id}`,
      {
        method: "POST",
        body: JSON.stringify({ username: user.username, role, enabled } as UserCR),
      },
      750,
    );
    setResult(dbResult);

    // Update the rom in the list
    if (!dbResult?.error) {
      onSubmit();
    }
  };

  const deleteUser = async () => {
    setResult(null);

    // Delete the user from the database
    const dbResult = await makeApiCall<undefined>(
      `/api/users/${user.id}`,
      {
        method: "DELETE",
      },
      750,
    );
    setResult(dbResult);

    // Remove the rom from the list
    if (!dbResult?.error) {
      onSubmit();
    }
  };

  return (
    <div className="flex items-center justify-end rounded py-2 px-3 bg-lightBg">
      <div className="flex items-center gap-3">
        <BsPersonCircle className={"text-3xl " + roleClasses[user?.role ?? "Guest"]} />
        <span>{user.username}</span>
        <span className="text-greyColor">(ID: {user.id})</span>
      </div>

      <div className="flex flex-col flex-grow justify-center items-center gap-2">
        <Loader isVisible={result === null} />
        <Error className="text-xl" message={result?.error} />
      </div>

      <div className="w-52">
        <Dropdown
          values={["Administrator", "Player"]}
          value={role}
          label="Role"
          onChange={setRole}
          disabled={disabled}
        />
      </div>

      <div className="w-28">
        <Checkbox checked={enabled} label="Enabled" onChange={setEnabled} disabled={disabled} />
      </div>

      <div className="flex gap-2">
        <Button
          className="ctrl-blue py-1.5"
          onClick={updateUser}
          disabled={disabled || (role === user.role && enabled === user.enabled)}
        >
          <BsSave className="text-lg" />
        </Button>
        <Button
          className="ctrl-red py-1.5"
          onClick={deleteUser}
          disabled={disabled || user.role === "Administrator"}
        >
          <BsFillTrashFill className="text-xl" />
        </Button>
      </div>
    </div>
  );
}
