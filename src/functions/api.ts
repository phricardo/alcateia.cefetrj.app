const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL as string;

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

export function USER_GET() {
  return {
    url: `${API_BASE_URL}/v1/users`,
    options: {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include" as RequestCredentials,
    },
  };
}

export function LOGIN_VALIDATE_POST(token: string) {
  return {
    url: `${API_BASE_URL}/v1/login/validate`,
    options: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `CEFETID_SSO=${token}`,
      },
    },
  };
}

export function STUDENT_CARD_VALIDATE_GET(studentId: string) {
  return {
    url: `${API_BASE_URL}/v1/student/enrollment/${studentId}/authentication`,
    options: {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include" as RequestCredentials,
    },
  };
}
