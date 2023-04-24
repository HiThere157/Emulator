"use client";

import { useState } from "react";
import makeApiCall from "@/helpers/api";
import { setLoginCookie } from "@/helpers/cookie";

import Input from "@/components/Input";
import Button from "@/components/Button";
import Error from "@/components/Error";

import { BsPersonBoundingBox } from "react-icons/bs";
import { PulseLoader } from "react-spinners";

export default function Login() {
  const [isRegistering, setIsRegistering] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Prevent flashing of spinner

    if (isRegistering) {
      await register();
    } else {
      await login();
    }

    setIsLoading(false);
  };

  const login = async () => {
    const { result, error } = await makeApiCall<LoginCookiePayload>("/api/auth/login", "json", {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: await sha256(password),
      } as UserLogin),
    });

    if (error) {
      setError(error);

      setPassword("");
      setConfirmPassword("");
      return;
    }

    if (result) {
      setLoginCookie(result);

      // redirect to callback url
      const urlParams = new URLSearchParams(window.location.search);
      const callbackUrl = urlParams.get("callbackUrl") ?? "/";

      window.location.href = callbackUrl;
    }
  };

  const register = async () => {
    // check if passwords match
    if (isRegistering && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // check min password length
    if (isRegistering && password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    const { error } = await makeApiCall<LoginCookiePayload>("/api/auth/register", "text", {
      method: "POST",
      body: JSON.stringify({
        username: username,
        password: await sha256(password),
      } as UserLogin),
    });

    if (error) {
      setError(error);
      return;
    }

    // register successful, login
    setIsRegistering(false);
    login();
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

      <Error message={error} className="mt-3" />

      <div className="flex gap-2 mt-4">
        <Button
          className="ctrl-invisible underline underline-offset-2"
          onClick={() => setIsRegistering(!isRegistering)}
        >
          {isRegistering ? "Login Instead" : "No Account? Register"}
        </Button>
        <Button className="ctrl-blue" onClick={onSubmit} disabled={isLoading}>
          {isLoading ? <PulseLoader size="8px" color="#F0F0F0" speedMultiplier={0.6} /> : "Login"}
        </Button>
      </div>
    </div>
  );
}
