// // export { auth as middleware } from "@/auth";

// import { auth } from "@/auth";
// import { NextRequest, NextResponse } from "next/server";

// export function middleware(req: NextRequest) {
//   console.log("Incoming request:", req.method, req.nextUrl.pathname);

//   // Run NextAuth authentication middleware
//   return auth(req) ?? NextResponse.next();
// }
import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

// ANSI color codes for console logs
const colors = {
  reset: "\x1b[0m",
  cyan: "\x1b[36m", // Middleware logs
  blue: "\x1b[34m", // HTTP method
  magenta: "\x1b[35m", // Request path
  yellow: "\x1b[33m", // Warnings
  red: "\x1b[31m", // Errors
  green: "\x1b[32m", // Success messages
};

export function middleware(req: NextRequest) {
  console.log(
    `${colors.cyan}[MIDDLEWARE] Incoming request:${colors.reset}`,
    `${colors.blue}${req.method}${colors.reset}`,
    "→",
    `${colors.magenta}${req.nextUrl.pathname}${colors.reset}`
  );

  try {
    // Run NextAuth authentication middleware
    const res = auth(req);

    if (res) {
      console.log(
        `${colors.green}[AUTH] Request authenticated successfully.${colors.reset}`
      );
      return res;
    } else {
      console.warn(
        `${colors.yellow}[AUTH] No authentication response. Proceeding...${colors.reset}`
      );
      return NextResponse.next();
    }
  } catch (error) {
    console.error(
      `${colors.red}[ERROR] Middleware error: ${error}${colors.reset}`
    );
    return NextResponse.error();
  }
}
