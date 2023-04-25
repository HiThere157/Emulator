"use client";

import { useState } from "react";
import makeApiCall from "@/helpers/api";
import { setLoginCookie } from "@/helpers/cookie";

import Input from "@/components/Input";
import Button from "@/components/Button";
import Error from "@/components/Error";
import Loader from "@/components/Loader";

import { BsPersonBoundingBox } from "react-icons/bs";

export default function Login() {
  const [result, setResult] = useState<ApiResult<LoginCookiePayload>>({});
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
    // check if username and password are not empty
    if (!username || !password) return;

    setResult(null);

    if (isRegistering) {
      await register();
    } else {
      await login();
    }
  };

  const register = async () => {
    // check if passwords match
    if (isRegistering && password !== confirmPassword) {
      setResult({ error: "Passwords do not match" });
      return;
    }

    // check min password length
    if (isRegistering && password.length < 8) {
      setResult({ error: "Password must be at least 8 characters long" });
      return;
    }

    const response = await makeApiCall<LoginCookiePayload>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: await sha256(password),
      } as UserLogin),
    });
    setResult(response);

    if (!response?.error) {
      setIsRegistering(false);
      login();
    }
  };

  const login = async () => {
    const response = await makeApiCall<LoginCookiePayload>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: await sha256(password),
      } as UserLogin),
    });
    setResult(response);

    if (response?.error) {
      setPassword("");
      setConfirmPassword("");
    }

    if (response?.result) {
      setLoginCookie(response.result);

      // redirect to callback url
      const urlParams = new URLSearchParams(window.location.search);
      const callbackUrl = urlParams.get("callbackUrl") ?? "/";

      window.location.href = callbackUrl;
    }
  };

  return (
    <div className="absolute top-1/4 left-1/2 translate-x-[-50%] translate-y-[-50%] flex flex-col items-center rounded">
      <BsPersonBoundingBox className="text-8xl text-blueColor mb-7" />

      <div className="grid grid-cols-[auto_auto] gap-2">
        <span>Username:</span>
        <Input value={username} onChange={setUsername} />

        <span>Password:</span>
        <Input value={password} onChange={setPassword} onEnter={onSubmit} type="password" />

        {isRegistering && (
          <>
            <span>Confirm Password:</span>
            <Input
              value={confirmPassword}
              onChange={setConfirmPassword}
              onEnter={onSubmit}
              type="password"
            />
          </>
        )}
      </div>

      <div className="flex justify-center mt-4">
        <Loader isVisible={result === null} />
        <Error message={result?.error} />
      </div>

      <div className="flex gap-2 mt-4">
        <Button
          className="ctrl-invisible underline underline-offset-2"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? "Login Instead" : "No Account? Register"}
        </Button>
        <Button className="ctrl-blue" onClick={onSubmit} disabled={result === null}>
          Login
        </Button>
      </div>
    </div>
  );
}
