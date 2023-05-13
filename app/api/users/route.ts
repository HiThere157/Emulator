import path from "path";
import { promises as fs } from "fs";
import { NextRequest } from "next/server";

import { validateToken } from "@/helpers/s_auth";

export const revalidate = 0;
const userDBPath = path.join(process.cwd(), "data/users.json");

/*
  Response: User[]
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
  const users: DBUser[] = JSON.parse(userDB);

  const reducedUsers: User[] = users.map((user) => ({
    id: user.id,
    username: user.username,
    role: user.role,
    enabled: user.enabled,
  }));

  return new Response(JSON.stringify(reducedUsers), {
    headers: {
      "Content-Type": "application/json",
    },
    status: 200,
  });
}
