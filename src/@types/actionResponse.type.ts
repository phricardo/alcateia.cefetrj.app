export type IActionResponse<T = null> = {
  ok: boolean;
  error: string | null;
  data: T | null;
};
