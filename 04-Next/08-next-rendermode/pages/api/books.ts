import type { NextApiRequest, NextApiResponse } from "next";

type Book = { id: number; name: string };

function buildBooks(count: number): Book[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    name: `book-${i + 1}`,
  }));
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const count = parseInt((req.query.count as string) || "5");
  res.status(200).json({
    time: new Date().toISOString(),
    books: buildBooks(Number.isFinite(count) ? count : 5),
  });
}
