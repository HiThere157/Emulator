"use client";

import { useState } from "react";
import makeApiCall from "@/helpers/c_api";
import { setLoginCookie } from "@/helpers/c_cookie";

import Input from "@/components/Input";
import Button from "@/components/Button";
import Error from "@/components/Error";
import Loader from "@/components/Loader";

import { BsPersonBoundingBox } from "react-icons/bs";

export default function Login() {
  const [result, setResult] = useState<ApiResult<User | undefined>>({});
  const [isRegistering, setIsRegistering] = useState<boolean>(false);

  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const sha256 = async (string: string) => {
    const stringBuffer = new TextEncoder().encode(string);
    const hashBuffer = await crypto.subtle.digest("SHA-256", stringBuffer);

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    return hashHex;
  };

  const onSubmit = async () => {
    if (window.location.protocol !== "https:" && window.location.hostname !== "localhost") {
      setResult({ error: "HTTPS connection required" });
      return;
    }

    // Check if username and password are not empty
    if (!username || !password) return;

    setResult(null);

    if (isRegistering) {
      await register();
    } else {
      await login();
    }
  };

  const register = async () => {
    // Check if passwords match
    if (isRegistering && password !== confirmPassword) {
      setResult({ error: "Passwords do not match" });
      return;
    }

    // Check min password length
    if (isRegistering && password.length < 8) {
      setResult({ error: "Password must be at least 8 characters long" });
      return;
    }

    const registerResult = await makeApiCall<undefined>(
      "/api/auth/register",
      {
        method: "POST",
        body: JSON.stringify({
          username: username,
          password: await sha256(password),
        } as UserLogin),
      },
      750,
    );
    setResult(registerResult);

    // Login if registration was successful
    if (!registerResult?.error) {
      setIsRegistering(false);
      login();
    }
  };

  const login = async () => {
    const loginResult = await makeApiCall<User>(
      "/api/auth/login",
      {
        method: "POST",
        body: JSON.stringify({
          username: username,
          password: await sha256(password),
        } as UserLogin),
      },
      750,
    );
    setResult(loginResult);

    // Clear password fields if login failed
    if (loginResult?.error) {
      setPassword("");
      setConfirmPassword("");
    }

    // Set login cookie if login was successful
    if (loginResult?.result) {
      setLoginCookie(loginResult.result);
      window.location.href = "/";
    }
  };

  return (
    <div className="flex flex-col items-center rounded py-[10vh]">
      <BsPersonBoundingBox className="mb-7 text-8xl text-blueColor" />

      <div className="grid grid-cols-[auto_auto] gap-2">
        <span>Username:</span>
        <Input value={username} onChange={setUsername} disabled={result === null} />

        <span>Password:</span>
        <Input
          value={password}
          onChange={setPassword}
          onEnter={onSubmit}
          type="password"
          disabled={result === null}
        />

        {isRegistering && (
          <>
            <span>Confirm Password:</span>
            <Input
              value={confirmPassword}
              onChange={setConfirmPassword}
              onEnter={onSubmit}
              type="password"
              disabled={result === null}
            />
          </>
        )}
      </div>

      <div className="mt-4 flex justify-center">
        <Loader isVisible={result === null} />
        <Error message={result?.error} />
      </div>

      <div className="mt-4 flex gap-2">
        <Button
          className="ctrl-invisible underline underline-offset-2"
          onClick={() => setIsRegistering(!isRegistering)}
          disabled={result === null}
        >
          {isRegistering ? "Login Instead" : "No Account? Register"}
        </Button>
        <Button className="ctrl-blue" onClick={onSubmit} disabled={result === null}>
          {isRegistering ? "Register" : "Login"}
        </Button>
      </div>
    </div>
  );
}
