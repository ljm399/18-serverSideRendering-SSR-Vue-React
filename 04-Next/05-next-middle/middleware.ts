import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  // console.log(pathname,'pathname');
  
  if (pathname === "/mw-log") {
    console.log("middleware =>", req.nextUrl.pathname);
    return NextResponse.next();
  }

  if (pathname === "/home") {
    const isV2 = req.cookies.get("exp")?.value === "v2";
    if (isV2) {
      return NextResponse.rewrite(new URL("/v2/home", req.nextUrl.origin));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin/secret")) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  if (pathname.startsWith("/admin")) {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      const loginUrl = req.nextUrl.clone();
      loginUrl.pathname = "/login";
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/private")) {
    const key = req.headers.get("x-api-key");
    if (key !== "demo") {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/juanpi/api")) {
    console.log(req.nextUrl.pathname, "req.nextUrl.pathname");

    const restPath = pathname.replace("/juanpi/api", "");
    const targetUrl = new URL('oppo/info',`http://localhost:8000`);
    return NextResponse.rewrite(targetUrl);
  }

  if (pathname.startsWith("/wall")) {
    const token = req.cookies.get("token")?.value;
    if (!token && pathname !== "/wall/login") {
      return NextResponse.redirect(new URL("/wall/login", req.nextUrl.origin));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/mw-log",
    "/home",
    "/admin/:path*",
    "/api/private/:path*",
    "/juanpi/api/:path*",
    "/wall/:path*",
  ],
};
