import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

import { NextRequest } from "next/server";

async function validateToken(request: NextRequest): Promise<LoginCookiePayload | null> {
  const JWTSecret = process.env.JWT_SECRET;
  if (!JWTSecret) return null;

  const tokenCookie = request.cookies.get("login_token");
  if (!tokenCookie) return null;

  try {
    return jwt.verify(tokenCookie.value, JWTSecret) as LoginCookiePayload;
  } catch {
    return null;
  }
}

export { validateToken };
