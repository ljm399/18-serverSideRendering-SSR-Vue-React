"use client"
export default function AppHome() {
  if(typeof window !== 'undefined') {
    console.log(process.env.PORT,'ss');
    console.log(process.env.HY,'HY');
    console.log(process.env.NEXT_PUBLIC_BASE_URL,'app');
  } else {
    console.log(process.env.NEXT_PUBLIC_BASE_URL,'app');
    console.log(process.env.PORT,'app');
    console.log(process.env.HY);
  }
  return (
    <div className="Home">
      测试hy
    </div>
  );
}
