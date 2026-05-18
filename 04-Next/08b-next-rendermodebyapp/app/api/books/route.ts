type Book = { id: number; name: string };

function buildBooks(count: number): Book[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    name: `book-${i + 1}`,
  }));
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const count = parseInt(url.searchParams.get("count") || "5");

  return Response.json({
    time: new Date().toISOString(),
    books: buildBooks(Number.isFinite(count) ? count : 5),
  });
}
