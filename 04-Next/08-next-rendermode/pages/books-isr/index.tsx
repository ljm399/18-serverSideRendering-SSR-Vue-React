import type { GetStaticProps, InferGetStaticPropsType } from "next";

type Book = { id: number; name: string };

async function fetchBooks(count: number) {
  return {
    data: {
      books: Array.from({ length: count }).map((_, i) => ({
        id: i + 1,
        name: `book-${i + 1}`,
      })) as Book[],
    },
  };
}

export const getStaticProps: GetStaticProps<{ books: Book[]; count: number }> =
  async () => {
    const count = Math.floor(Math.random() * 10 + 1);
    const res = await fetchBooks(count);

    return {
      props: {
        books: res.data.books,
        count,
      },
      revalidate: 5,
    };
  };

export default function BooksISRPage(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  return (
    <div style={{ padding: 24 }}>
      <h1>BooksISR</h1>
      <p>count(from generate): {props.count}</p>
      <ul>
        {props.books.map((b) => (
          <li key={b.id}>{b.name}</li>
        ))}
      </ul>
    </div>
  );
}
