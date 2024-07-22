const API_BASE_URL = process.env.API_BASE_URL as string;

export function LOGIN_POST({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  return {
    url: `${API_BASE_URL}/v1/login`,
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    },
  };
}
