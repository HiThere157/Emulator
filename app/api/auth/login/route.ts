import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { promises as fs } from "fs";
import { NextRequest } from "next/server";

export const revalidate = 0;
const userDBPath = path.join(process.cwd(), "data/users.json");
const JWTSecret = "AAAAAAA";

/*
  Body: UserLogin
  Response: cookie, LoginCookiePayload
  Codes: 401
*/
export async function POST(request: NextRequest) {
  // [DB] Read users
  const userDB = await fs.readFile(userDBPath, "utf-8");
  const users: User[] = JSON.parse(userDB);

  // [Request] Get username and password
  const { username, password }: UserLogin = await request.json();

  // [Validation] Check if user exists
  const user = users.find((user: User) => user.username.toLowerCase() === username.toLowerCase());
  if (!user) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
    });
  }

  // [Validation] Check if passwords match
  const isMatch = await bcrypt.compare(password, user.hash);
  if (!isMatch) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 401,
    });
  }

  // [Validation] Check if user is enabled
  if (!user.enabled) {
    return new Response(JSON.stringify({ error: "User is not enabled" }), {
      status: 401,
    });
  }

  // [JWT] Create token
  const payload: LoginCookiePayload = {
    id: user.id,
    username: user.username,
    role: user.role,
  };
  const token = jwt.sign(payload, JWTSecret, {
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
