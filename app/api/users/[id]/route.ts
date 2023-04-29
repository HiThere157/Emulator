import path from "path";
import { promises as fs } from "fs";
import { NextRequest } from "next/server";

import { validateToken } from "@/helpers/auth";

export const revalidate = 0;
const userDBPath = path.join(process.cwd(), "data/users.json");

type Props = {
  params: {
    id: string;
  };
};

/*
  Params: id
  Role: Administrator
  Body: UserCR
  Response: ReducedUser
  Codes: 400, 401, 403, 404
*/
export async function POST(request: NextRequest, { params }: Props) {
  // [Auth] Validate token
  const token = await validateToken(request);
  if (!token) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  // [Auth] Validate role
  if (token.role !== "Administrator") {
    return new Response("Administrator role required", {
      status: 403,
    });
  }

  // [Request] Get user details
  const { username, role, enabled }: Partial<UserCR> = await request.json();

  // [Validation] Check for missing fields
  if (!username || !role || enabled === undefined) {
    return new Response("Missing fields", {
      status: 400,
    });
  }

  // [DB] Read users
  const userDB = await fs.readFile(userDBPath, "utf-8");
  const users: User[] = JSON.parse(userDB);

  // [DB] Find user
  const currentUserIndex = users.findIndex((user) => user.id.toString() === params.id);

  // [Validation] Check if user exists
  if (currentUserIndex === -1) {
    return new Response("User not found", {
      status: 404,
    });
  }

  // [DB] Update user
  users[currentUserIndex] = {
    ...users[currentUserIndex],
    username,
    role,
    enabled,
  };

  // [DB] Write users
  await fs.writeFile(userDBPath, JSON.stringify(users, null, 2));

  return new Response(
    JSON.stringify({
      id: users[currentUserIndex].id,
      username,
      role,
      enabled,
    }),
    {
      headers: {
        "Content-Type": "application/json",
      },
      status: 200,
    },
  );
}

/*
  Params: id
  Role: Administrator
  Codes: 401, 403, 404
*/
export async function DELETE(request: NextRequest, { params }: Props) {
  // [Auth] Validate token
  const token = await validateToken(request);
  if (!token) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  // [Auth] Validate role
  if (token.role !== "Administrator") {
    return new Response("Administrator role required", {
      status: 403,
    });
  }

  // [DB] Read users
  const userDB = await fs.readFile(userDBPath, "utf-8");
  const users: User[] = JSON.parse(userDB);

  // [DB] Find user
  const currentUserIndex = users.findIndex((user) => user.id.toString() === params.id);

  // [Validation] Check if user exists
  if (currentUserIndex === -1) {
    return new Response("User not found", {
      status: 404,
    });
  }

  // [DB] Remove user
  users.splice(currentUserIndex, 1);

  // [DB] Write user database
  await fs.writeFile(userDBPath, JSON.stringify(users, null, 2));

  return new Response(null, {
    status: 200,
  });
}
