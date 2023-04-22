import path from "path";
import bcrypt from "bcrypt";
import { promises as fs } from "fs";
import { NextRequest } from "next/server";

export const revalidate = 0;
const userDBPath = path.join(process.cwd(), "data/users.json");

/*
  Body: UserLogin
  Codes: 400
*/
export async function POST(request: NextRequest) {
  // [DB] Read users
  const userDB = await fs.readFile(userDBPath, "utf-8");
  const users: User[] = JSON.parse(userDB);

  // [Request] Get username and password
  const { username, password }: UserLogin = await request.json();

  // [Validation] Check if user exists
  const existingUser = users.find(
    (user: User) => user.username.toLowerCase() === username.toLowerCase(),
  );
  if (existingUser) {
    return new Response(JSON.stringify({ error: "User already exists" }), {
      status: 400,
    });
  }

  // [Validation] Check for maximum users
  if (users.length >= 50) {
    return new Response(JSON.stringify({ error: "Maximum users reached" }), {
      status: 400,
    });
  }

  // [DB] Create user
  const user: User = {
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
