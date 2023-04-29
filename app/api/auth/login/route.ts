import path from "path";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { promises as fs } from "fs";
import dotenv from "dotenv";
dotenv.config();

import { NextRequest } from "next/server";
import init from "@/helpers/init";

export const revalidate = 0;
const userDBPath = path.join(process.cwd(), "data/users.json");

/*
  Body: UserLogin
  Response: cookie, ReducedUser
  Codes: 400, 401
*/
export async function POST(request: NextRequest) {
  await init();

  const JWTSecret = process.env.JWT_SECRET;
  if (!JWTSecret) {
    return new Response("JWT secret not configured", {
      status: 500,
    });
  }

  // [DB] Read users
  const userDB = await fs.readFile(userDBPath, "utf-8");
  const users: User[] = JSON.parse(userDB);

  // [Request] Get username and password
  const { username, password }: Partial<UserLogin> = await request.json();

  // [Validation] Check for missing fields
  if (!username || !password) {
    return new Response("Missing fields", {
      status: 400,
    });
  }

  // [Validation] Check if user exists
  const user = users.find((user: User) => user.username.toLowerCase() === username.toLowerCase());
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

  // [JWT] Create token
  const payload: ReducedUser = {
    id: user.id,
    username: user.username,
    role: user.role,
    enabled: user.enabled,
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
