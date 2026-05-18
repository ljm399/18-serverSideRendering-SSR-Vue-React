import Link from "next/link";
import { useRouter } from "next/router";

export default function CartPage() {
  const router = useRouter();

  return (
    <main>
      <h1>Cart</h1>
      <div>count: {String(router.query.count ?? "")}</div>
      <div>
        <Link href="/">Back Home</Link>
      </div>
    </main>
  );
}
