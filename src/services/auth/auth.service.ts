import { toast } from "sonner";

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
    toast.success('Log in successful');
    return json;
  } catch (error: any) {
    return { errors: { form: error?.message || "Network error" } };
  }
};

export const logoutService = async () => {
  try {
    await fetch(`/api/auth/logout`, { method: "POST" });
    toast.success('Log out successfully');
  } catch (e) {
  }
};

export const getTokensFromCookies = async () => {
  try {
    const response = await fetch('/api/auth/tokens', {
      method: "GET",
    })

    return await response.json();
  } catch (error) {
    console.log("Error: ", error);
    return error
  }
}