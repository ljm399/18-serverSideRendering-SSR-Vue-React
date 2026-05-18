import Link from "next/link";
import { memo, useCallback, useState } from "react";

const Child = memo(function Child(props: { onClick: () => void }) {
  return <button onClick={props.onClick}>child</button>;
});

export default function AboutPage() {
  const [count, setCount] = useState(0);

  const onClick = useCallback(() => {
    setCount((c) => c + 1);
  }, []);

  return (
    <main>
      <h1>About</h1>
      <div>
        <Link href="/">Back Home</Link>
      </div>
      <div>count: {count}</div>
      <Child onClick={onClick} />
    </main>
  );
}
