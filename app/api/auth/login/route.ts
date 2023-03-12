import jwt from "jsonwebtoken";
require("dotenv").config();

import { NextRequest } from "next/server";
import { getBody } from "@/helpers/api";

export const revalidate = 0;

export async function POST(request: NextRequest) {
  const body: { password: string } | undefined = await getBody(request);
  if (!body || !body.password) {
    return new Response(null, { status: 400 });
  }

  if (body.password === process.env.ADMIN_PW) {
    const payload = { username: "admin" };
    const token = jwt.sign(payload, "shhhhh", { expiresIn: "12h" });

    return new Response(JSON.stringify(payload), {
      headers: [
        ["Set-Cookie", `token=${token}; Max-Age=43200; Secure; HttpOnly; SameSite=Strict; Path=/`],
      ],
    });
  }

  return new Response(null, { status: 403 });
}
