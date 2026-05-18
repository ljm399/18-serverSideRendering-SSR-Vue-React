export async function POST(req: Request) {
  const url = new URL(req.url);

  const query = Object.fromEntries(url.searchParams.entries());
  console.log("[route handler] query =>", query);

  const body = await req.json();
  console.log("[route handler] body =>", body);

  return Response.json({
    name: "liujun",
    age: 18,
    token: "aabbcc",
  });
}
