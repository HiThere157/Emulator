import path from "path";
import { promises as fs } from "fs";
import { NextRequest } from "next/server";

import { validateToken } from "@/helpers/auth";

export const revalidate = 0;
const userDBPath = path.join(process.cwd(), "data/users.json");

/*
  Response: ReducedUser[]
  Codes: 401
*/
export async function GET(request: NextRequest) {
  // [Auth] Validate token
  if (!(await validateToken(request))) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  // [DB] Read users
  const userDB = await fs.readFile(userDBPath, "utf-8");
  const users: User[] = JSON.parse(userDB);

  const reducedUsers: ReducedUser[] = users.map((user) => ({
    id: user.id,
    username: user.username,
    role: user.role,
  }));

  return new Response(JSON.stringify(reducedUsers), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
}