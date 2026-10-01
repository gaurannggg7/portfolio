import { NextResponse, type NextRequest } from "next/server";
import { VIEW_COOKIE, VIEW_PARAM, isView } from "./lib/view";

/**
 * A valid ?view= parameter (e.g. from a shared link) becomes the saved
 * preference, so the chosen style carries over to pages without the parameter.
 * Invalid values are ignored and fall back to the saved style or the default.
 */
export function proxy(request: NextRequest) {
  const view = request.nextUrl.searchParams.get(VIEW_PARAM);
  const response = NextResponse.next();
  if (isView(view) && request.cookies.get(VIEW_COOKIE)?.value !== view) {
    response.cookies.set(VIEW_COOKIE, view, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
  }
  return response;
}

export const config = {
  matcher: ["/", "/work/:slug*"],
};
