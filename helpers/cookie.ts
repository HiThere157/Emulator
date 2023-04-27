"use client";

function getLoginCookie(): LoginCookiePayload | null {
  if (typeof window === "undefined") return null;

  const userCookieString = document.cookie
    .split("; ")
    .find((row) => row.startsWith("login_info="))
    ?.split("=")[1];

  if (!userCookieString) {
    return null;
  }

  return JSON.parse(userCookieString) as LoginCookiePayload;
}

function setLoginCookie(payload: LoginCookiePayload) {
  if (typeof window === "undefined") return;

  document.cookie = `login_info=${JSON.stringify(
    payload,
  )}; Max-Age=43200; Secure; SameSite=Strict; Path=/`;
}

function clearLoginCookie() {
  if (typeof window === "undefined") return;

  document.cookie = "login_info=; Max-Age=0; Secure; SameSite=Strict; Path=/";
}

export { getLoginCookie, setLoginCookie, clearLoginCookie };
