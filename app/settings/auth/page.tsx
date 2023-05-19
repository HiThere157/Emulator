"use client";

import { useState, useEffect } from "react";
import { clearLoginCookie, getLoginCookie } from "@/helpers/c_cookie";
import makeApiCall from "@/helpers/c_api";

import Button from "@/components/Button";
import Checkbox from "@/components/Checkbox";
import Input from "@/components/Input";
import Loader from "@/components/Loader";
import Error from "@/components/Error";
import ConfirmPopup from "@/components/Popup/ConfirmPopup";

import { FiRefreshCw } from "react-icons/fi";
import { BsSave } from "react-icons/bs";

export default function AuthOptionPage() {
  const [config, setConfig] = useState<ApiResult<AuthConfigCR | undefined>>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState<boolean>(false);

  const [canLogin, setCanLogin] = useState<boolean>(true);
  const [canRegister, setCanRegister] = useState<boolean>(true);
  const [maxUsers, setMaxUsers] = useState<number>(50);

  const isAdmin = getLoginCookie()?.role === "Administrator";

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
      <ConfirmPopup
        isOpen={isConfirmOpen}
        text="This will revoke all active sessions."
        btnText="Revoke"
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          setIsConfirmOpen(false);
          revokeSessions();
        }}
      />

      <div className="m-2">
        <Button className="ctrl-flat group h-7 px-1" onClick={fetchData} disabled={config === null}>
          <FiRefreshCw className="text-lg duration-150 group-hover:rotate-180" />
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center gap-2">
        <Loader isVisible={config === null} />
        <Error className="text-2xl" message={config?.error} />
      </div>

      <div className="flex flex-col gap-2 p-2">
        <Checkbox
          checked={canLogin}
          label="Users can Login"
          onChange={setCanLogin}
          disabled={!isAdmin || config === null}
        />
        <Checkbox
          checked={canRegister}
          label="New Users can Register"
          onChange={setCanRegister}
          disabled={!isAdmin || config === null}
        />
        <Input
          value={maxUsers.toString()}
          type="number"
          onChange={(value) => setMaxUsers(parseInt(value))}
          label="Maximum Users"
          disabled={!isAdmin || config === null}
        />

        <div className="flex justify-between">
          <Button
            className="ctrl-red font-bold"
            onClick={() => setIsConfirmOpen(true)}
            disabled={!isAdmin}
          >
            Revoke all Sessions
          </Button>
          <Button
            className="ctrl-blue flex items-center gap-1.5"
            onClick={updateConfig}
            disabled={!isAdmin || config === null}
          >
            <BsSave className="text-lg" />
            <span className="font-bold">Save</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
