import type { GetStaticProps, InferGetStaticPropsType } from "next";
import { memo } from "react";

type Book = { id: number; name: string };

// 模拟网络接口
async function fetchBooks() {
  return { data: { books: [{ id: 1, name: "book1" },{id: 2, name: "book2"}] as Book[] } };
}

export const getStaticProps: GetStaticProps<{ books: Book[] }> = async () => {
  const res = await fetchBooks();
  return {
    props: {
      books: res.data.books,
    },
  };
};

const BooksSSG = memo(function BooksSSG(
  props: InferGetStaticPropsType<typeof getStaticProps>
) {
  const { books } = props;
  return (
    <div className="home" style={{ padding: 24 }}>
      <div>BooksSSG</div>
      <ul>
        {books?.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
});

export default BooksSSG;
