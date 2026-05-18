type Book = { id: number; name: string };

export const dynamic = "force-dynamic";

function buildBooks(count: number): Book[] {
  return Array.from({ length: count }).map((_, i) => ({
    id: i + 1,
    name: `book-${i + 1}`,
  }));
}

export default async function Page() {
  const time = new Date().toISOString();
  const books = buildBooks(3);

  return (
    <div style={{ padding: 24 }}>
      <h1>BooksSSR (App Router no-store)</h1>
      <p>time(from server component): {time}</p>
      <ul>
        {books.map((b) => (
          <li key={b.id}>{b.name}</li>
        ))}
      </ul>
    </div>
  );
}
