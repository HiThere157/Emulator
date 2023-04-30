import path from "path";
import bcrypt from "bcrypt";
import { promises as fs } from "fs";
import { NextRequest } from "next/server";
import init from "@/helpers/init";

export const revalidate = 0;
const userDBPath = path.join(process.cwd(), "data/users.json");

/*
  Body: UserLogin
  Codes: 400
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
  const existingUser = users.find(
    (user: DBUser) => user.username.toLowerCase() === username.toLowerCase(),
  );
  if (existingUser) {
    return new Response("User already exists", {
      status: 400,
    });
  }

  // [Validation] Check for maximum users
  if (users.length >= 50) {
    return new Response("Maximum users reached", {
      status: 400,
    });
  }

  // [DB] Create user
  const user: DBUser = {
    id: new Date().getTime(),
    username,
    hash: await bcrypt.hash(password, 10),
    role: "Player",
    enabled: false,
  };
  users.push(user);

  // [DB] Write users
  await fs.writeFile(userDBPath, JSON.stringify(users, null, 2));

  return new Response(null, {
    status: 200,
  });
}
