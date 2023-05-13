import path from "path";
import jwt from "jsonwebtoken";
import { promises as fs } from "fs";

import { NextRequest } from "next/server";

const authConfigPath = path.join(process.cwd(), "data/auth.json");

async function validateToken(request: NextRequest): Promise<User | null> {
  const authConfig = await getAuthConfig();
  if (!authConfig.secret) return null;

  const tokenCookie = request.cookies.get("login_token");
  if (!tokenCookie) return null;

  try {
    return jwt.verify(tokenCookie.value, authConfig.secret) as User;
  } catch {
    return null;
  }
}

async function getAuthConfig(): Promise<AuthConfig> {
  const authConfig = await fs.readFile(authConfigPath, "utf-8");
  return JSON.parse(authConfig);
}

export { validateToken, getAuthConfig };
