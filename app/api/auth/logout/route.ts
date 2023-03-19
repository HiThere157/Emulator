import { info } from "@/helpers/logging";

export const revalidate = 0;

export async function GET() {
  info("successful GET request for /auth/logout");
  return new Response(null, {
    headers: [["Set-Cookie", `token=null; Max-Age=0; Secure; HttpOnly; SameSite=Strict; Path=/`]],
  });
}
