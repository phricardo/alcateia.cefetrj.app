export default function handleActionError(error: unknown): {
  ok: boolean;
  error: string;
  data: null;
} {
  const errorMessage =
    error instanceof Error ? error.message : "An unknown error occurred";

  return {
    ok: false,
    error: errorMessage,
    data: null,
  };
}
