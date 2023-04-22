/*
  Response: cookie
*/
export async function POST() {
  return new Response(null, {
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": `login_token=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict`,
    },
    status: 200,
  });
}
