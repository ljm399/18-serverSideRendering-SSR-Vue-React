type Book = { id: number; name: string };

export const revalidate = 5;

export default async function Page() {
  const time = new Date().toISOString();

  return (
    <div style={{ padding: 24 }}>
      <h1>BooksISR (App Router revalidate=5)</h1>
      <p>看时间有无变化判断isr有无生效---time(from server component): {time}</p>
    </div>
  );
}
