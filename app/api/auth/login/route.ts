import jwt from "jsonwebtoken";
require("dotenv").config();

import { NextRequest } from "next/server";
import { getBody } from "@/helpers/api";

export const revalidate = 0;

export async function POST(request: NextRequest) {
  // dont sign if the secret is not configured (500)
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return new Response(null, { status: 500 });
  }

  // verify body and body props (400)
  const body: { password: string } | undefined = await getBody(request);
  if (!body || !body.password) {
    return new Response(null, { status: 400 });
  }

  if (body.password === process.env.ADMIN_PW) {
    const payload = { username: "Admin" };
    const token = jwt.sign(payload, secret, { expiresIn: "12h" });

    return new Response(JSON.stringify(payload), {
      headers: [
        ["Set-Cookie", `token=${token}; Max-Age=43200; Secure; HttpOnly; SameSite=Strict; Path=/`],
      ],
    });
  }

  return new Response(null, { status: 403 });
}
