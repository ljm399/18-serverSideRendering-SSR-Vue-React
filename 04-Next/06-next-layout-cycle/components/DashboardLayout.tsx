import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function DashboardLayout({ children }: Props) {
  return (
    <div>
      <aside>sidebar</aside>
      <section>{children}</section>
    </div>
  );
}
