import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWTSecret = "AAAAAAA";

async function validateToken(request: NextRequest): Promise<LoginCookiePayload | null> {
  const tokenCookie = request.cookies.get("login_token");
  if (!tokenCookie) return null;

  try {
    return jwt.verify(tokenCookie.value, JWTSecret) as LoginCookiePayload;
  } catch {
    return null;
  }
}

export { validateToken };
