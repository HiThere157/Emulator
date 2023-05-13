import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { promises as fs } from "fs";

import { NextRequest } from "next/server";
import { getAuthConfig } from "@/helpers/s_auth";
import init from "@/helpers/s_init";

export const revalidate = 0;
const userDBPath = path.join(process.cwd(), "data/users.json");

/*
  Body: UserLogin
  Response: cookie, User
  Codes: 400, 401, 403
*/
export async function POST(request: NextRequest) {
  await init();

  // [DB] Read users
  const userDB = await fs.readFile(userDBPath, "utf-8");
  const users: DBUser[] = JSON.parse(userDB);

  // [Request] Get username and password
  const { username, password }: Partial<UserLogin> = await request.json();

  // [Validation] Check for missing fields
  if (!username || !password) {
    return new Response("Missing fields", {
      status: 400,
    });
  }

  // [Validation] Check if user exists
  const user = users.find((user: DBUser) => user.username.toLowerCase() === username.toLowerCase());
  if (!user) {
    return new Response("Invalid credentials", {
      status: 401,
    });
  }

  // [Validation] Check if passwords match
  const isMatch = await bcrypt.compare(password, user.hash);
  if (!isMatch) {
    return new Response("Invalid credentials", {
      status: 401,
    });
  }

  // [Validation] Check if user is enabled
  if (!user.enabled) {
    return new Response("User is not enabled", {
      status: 401,
    });
  }

  // [Config] Check if login is enabled in config
  const authConfig = await getAuthConfig();
  if (!authConfig.canLogin && user.role !== "Administrator") {
    return new Response("Login is disabled", {
      status: 403,
    });
  }

  // [JWT] Create token
  const payload: User = {
    id: user.id,
    username: user.username,
    role: user.role,
    enabled: user.enabled,
  };
  const token = jwt.sign(payload, authConfig.secret, {
    expiresIn: "12h",
  });

  return new Response(JSON.stringify(payload), {
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `login_token=${token}; Max-Age=43200; Path=/; HttpOnly; SameSite=Strict`,
    },
    status: 200,
  });
}
