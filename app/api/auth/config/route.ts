import path from "path";
import { promises as fs } from "fs";

import { NextRequest } from "next/server";
import { getAuthConfig, validateToken } from "@/helpers/s_auth";

export const revalidate = 0;
const authConfigPath = path.join(process.cwd(), "data/auth.json");

/*
  Codes: 401
  Response: AuthConfigCR
*/
export async function GET(request: NextRequest) {
  // [Auth] Validate token
  const token = await validateToken(request);
  if (!token) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  // [Config] Read config
  const authConfig = await getAuthConfig();

  return new Response(
    JSON.stringify({
      canLogin: authConfig.canLogin,
      canRegister: authConfig.canRegister,
      maxUsers: authConfig.maxUsers,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
}

/*
  Role: Administrator
  Body: AuthConfigCR
  Codes: 400, 401, 403
*/
export async function POST(request: NextRequest) {
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

  // [Config] Read config
  const authConfig = await getAuthConfig();

  // [Request] Get config
  const { canLogin, canRegister, maxUsers }: Partial<AuthConfigCR> = await request.json();

  // [Validation] Check for missing fields
  if (canLogin === undefined || canRegister === undefined || !maxUsers) {
    return new Response("Missing fields", {
      status: 400,
    });
  }

  // [Config] Update config
  authConfig.canLogin = canLogin;
  authConfig.canRegister = canRegister;
  authConfig.maxUsers = maxUsers;

  // [Config] Write config
  await fs.writeFile(authConfigPath, JSON.stringify(authConfig, null, 2));

  return new Response(null, {
    status: 200,
  });
}
