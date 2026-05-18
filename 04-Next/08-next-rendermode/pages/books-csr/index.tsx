import { memo, useEffect, useState } from "react";

type Book = { id: number; name: string };

type BooksApiResp = { time: string; books: Book[] };

const BooksCSR = memo(function BooksCSR() {
  const [books, setBooks] = useState<Book[]>([]);
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const count = Math.floor(Math.random() * 10 + 1);
    fetch(`/api/books?count=${count}`)
      .then((r) => r.json() as Promise<BooksApiResp>)
      .then((data) => {
        console.log(data.books);
        setBooks(data.books);
        setTime(data.time);
      });
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <h1>BooksCSR</h1>
      <p>fetched time: {time || "(loading...)"}</p>
      <ul>
        {books.map((b) => (
          <li key={b.id}>{b.name}</li>
        ))}
      </ul>
      <p style={{ marginTop: 12 }}>
        Tip: View Page Source, you will not see the list rendered in HTML.
      </p>
    </div>
  );
});

export default BooksCSR;
