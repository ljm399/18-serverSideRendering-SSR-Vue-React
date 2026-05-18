export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <aside>sidebar</aside>
      <section>{children}</section>
    </div>
  );
}
