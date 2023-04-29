function getLoginCookie(): ReducedUser | null {
  if (typeof window === "undefined") return null;

  const userCookieString = document.cookie
    .split("; ")
    .find((row) => row.startsWith("login_info="))
    ?.split("=")[1];

  if (!userCookieString) {
    return null;
  }

  return JSON.parse(userCookieString) as ReducedUser;
}

function setLoginCookie(payload: ReducedUser) {
  if (typeof window === "undefined") return;

  document.cookie = `login_info=${JSON.stringify(
    payload,
  )}; Max-Age=43200; Secure; SameSite=Lax; Path=/`;
}

function clearLoginCookie() {
  if (typeof window === "undefined") return;

  document.cookie = "login_info=; Max-Age=0; Secure; SameSite=Lax; Path=/";
}

export { getLoginCookie, setLoginCookie, clearLoginCookie };
