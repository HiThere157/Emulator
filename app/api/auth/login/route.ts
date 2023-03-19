import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

import { NextRequest } from "next/server";

import { error, info, warn } from "@/helpers/logging";
import { getBody } from "@/helpers/api";

export const revalidate = 0;

export async function POST(request: NextRequest) {
  // dont sign if the secret is not configured (500)
  const secret = process.env.JWT_SECRET;
  const adminPW = process.env.ADMIN_PW;
  if (!secret || !adminPW) {
    error("JWT_SECRET or ADMIN_PW not configured");
    return new Response(null, { status: 500 });
  }

  // verify body and body props (400)
  const body: { passwordHash: string } | undefined = await getBody(request);
  if (!body || !body.passwordHash) {
    warn("invalid POST request for /auth/login");
    return new Response(null, { status: 400 });
  }

  const adminHash = crypto.createHash("sha256").update(adminPW).digest("hex");
  if (body.passwordHash === adminHash) {
    const payload = { username: "Admin" };
    const token = jwt.sign(payload, secret, { expiresIn: "12h" });

    info("successful POST request for /auth/login");
    return new Response(JSON.stringify(payload), {
      headers: [
        ["Set-Cookie", `token=${token}; Max-Age=43200; Secure; HttpOnly; SameSite=Strict; Path=/`],
      ],
    });
  }

  return new Response(null, { status: 403 });
}
