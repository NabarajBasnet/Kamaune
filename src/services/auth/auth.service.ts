interface dataProps {
  email: string;
  password: string;
}

// Call internal Next.js API route; it will talk to the backend and set cookies
export const loginService = async (data: dataProps) => {
  const { email, password } = data;
  try {
    const response = await fetch(`/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const json = await response.json().catch(() => ({}));
    if (!response.ok) {
      return {
        errors: json?.errors ?? { form: json?.message || "Login failed" },
      };
    }
    return json;
  } catch (error: any) {
    return { errors: { form: error?.message || "Network error" } };
  }
};

export const logoutService = async () => {
  try {
    await fetch(`/api/auth/logout`, { method: "POST" });
  } catch (e) {
    // ignore
  }
};
