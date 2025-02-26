// export { auth as middleware } from "@/auth";

import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  console.log("Incoming request:", req.method, req.nextUrl.pathname);

  // Run NextAuth authentication middleware
  return auth(req) ?? NextResponse.next();
}
