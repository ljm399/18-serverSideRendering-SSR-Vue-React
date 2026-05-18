// "use client"
export default function Home() {
  if(typeof window !== 'undefined') {
    console.log(process.env.PORT,'ss');
    console.log(process.env.NEXT_PUBLIC_BASE_URL);
    console.log(process.env.HY,'clientHY');//undefined 'clientHY'
  } else {
    console.log(process.env.NEXT_PUBLIC_BASE_URL);
    console.log(process.env.PORT);
    console.log(process.env.HY);
  }
  return (
    <div className="Home">
      测试hy
    </div>
  );
}
