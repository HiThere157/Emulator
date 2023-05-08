import path from "path";
import crypto from "crypto";
import { promises as fs } from "fs";

import { NextRequest } from "next/server";
import { getAuthConfig, validateToken } from "@/helpers/auth";

export const revalidate = 0;
const authConfigPath = path.join(process.cwd(), "data/auth.json");

/*
  Role: Administrator
  Codes: 401, 403
*/
export async function DELETE(request: NextRequest) {
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

  // [Config] Regenerate secret
  authConfig.secret = crypto.randomBytes(64).toString("hex");

  // [Config] Write config
  await fs.writeFile(authConfigPath, JSON.stringify(authConfig, null, 2));

  return new Response(null, {
    status: 200,
  });
}
