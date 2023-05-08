"use client";

import { useState, useEffect } from "react";
import { clearLoginCookie } from "@/helpers/cookie";
import makeApiCall from "@/helpers/api";

import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Input from "@/components/Input";
import Loader from "@/components/Loader";
import Error from "@/components/Error";

import { FiRefreshCw } from "react-icons/fi";
import { BsSave } from "react-icons/bs";

export default function AuthOptionPage() {
  const [config, setConfig] = useState<ApiResult<AuthConfigCR | undefined>>(null);

  const [canLogin, setCanLogin] = useState<boolean>(true);
  const [canRegister, setCanRegister] = useState<boolean>(true);
  const [maxUsers, setMaxUsers] = useState<number>(50);

  const fetchData = async () => {
    setConfig(null);
    setConfig(await makeApiCall<AuthConfigCR>("/api/auth/config", undefined, 750));
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (config?.result) {
      setCanLogin(config.result.canLogin);
      setCanRegister(config.result.canRegister);
      setMaxUsers(config.result.maxUsers);
    }
  }, [config]);

  const updateConfig = async () => {
    setConfig(null);

    // Update the config
    const dbResult = await makeApiCall<undefined>(
      "/api/auth/config",
      {
        method: "POST",
        body: JSON.stringify({ canLogin, canRegister, maxUsers } as AuthConfigCR),
      },
      750,
    );
    setConfig(dbResult);

    // Refresh the config
    if (!dbResult?.error) {
      fetchData();
    }
  };

  const revokeSessions = async () => {
    setConfig(null);

    // Revoke all sessions
    const dbResult = await makeApiCall<undefined>(
      "/api/auth/config/token",
      {
        method: "DELETE",
      },
      750,
    );
    setConfig(dbResult);

    // Logout the user
    if (!dbResult?.error) {
      clearLoginCookie();
      location.href = "/auth/login";
    }
  };

  return (
    <div>
      <div className="m-2">
        <Button className="ctrl-flat h-7 px-1 group" onClick={fetchData} disabled={config === null}>
          <FiRefreshCw className="text-lg group-hover:rotate-180 duration-150" />
        </Button>
      </div>

      <div className="flex flex-col justify-center items-center gap-2">
        <Loader isVisible={config === null} />
        <Error className="text-2xl" message={config?.error} />
      </div>

      <div className="flex flex-col gap-2 p-2">
        <Checkbox
          checked={canLogin}
          label="Users can Login"
          onChange={setCanLogin}
          disabled={config === null}
        />
        <Checkbox
          checked={canRegister}
          label="New Users can Register"
          onChange={setCanRegister}
          disabled={config === null}
        />
        <Input
          value={maxUsers.toString()}
          type="number"
          onChange={(value) => setMaxUsers(parseInt(value))}
          label="Maximum Users"
          disabled={config === null}
        />

        <div className="flex justify-between">
          <Button className="ctrl-red" onClick={revokeSessions}>
            Revoke all Sessions
          </Button>
          <Button
            className="ctrl-blue flex items-center gap-1"
            onClick={updateConfig}
            disabled={config === null}
          >
            <BsSave className="text-lg mx-0.5" />
            <span className="font-bold mr-1">Save</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
