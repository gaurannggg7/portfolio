/** Portfolio view styles. Shared by the server (resolution) and client (switcher). */
export const VIEWS = ["lab", "campus", "notes"] as const;
export type View = (typeof VIEWS)[number];

export const DEFAULT_VIEW: View = "lab";
export const VIEW_PARAM = "view";
export const VIEW_COOKIE = "view";

export const VIEW_LABELS: Record<View, string> = {
  lab: "Systems Lab",
  campus: "Research Campus",
  notes: "Field Notes",
};

export const isView = (v: unknown): v is View => typeof v === "string" && (VIEWS as readonly string[]).includes(v);

/** Resolution order: valid URL parameter, then saved cookie, then Systems Lab. */
export function resolveView(param: string | string[] | undefined, saved: string | undefined): View {
  const p = Array.isArray(param) ? param[0] : param;
  if (isView(p)) return p;
  if (isView(saved)) return saved;
  return DEFAULT_VIEW;
}
