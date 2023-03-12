export const revalidate = 0;

export async function GET() {
  return new Response(null, {
    headers: [["Set-Cookie", `token=null; Max-Age=0; Secure; HttpOnly; SameSite=Strict; Path=/`]],
  });
}
