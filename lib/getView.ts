import { cookies } from "next/headers";
import { VIEW_COOKIE, VIEW_PARAM, resolveView, type View } from "./view";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

/** Server-side view for a page, from its search params and the saved cookie. */
export async function getView(searchParams: SearchParams): Promise<View> {
  const [sp, jar] = await Promise.all([searchParams, cookies()]);
  return resolveView(sp[VIEW_PARAM], jar.get(VIEW_COOKIE)?.value);
}
